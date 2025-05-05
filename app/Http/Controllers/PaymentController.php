<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\EnrollmentController;
use Illuminate\Support\Facades\DB;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Carbon\Carbon;

class PaymentController extends Controller
{
    protected $enrollmentController;

    public function __construct(EnrollmentController $enrollmentController)
    {
        $this->middleware('auth:sanctum');
        $this->enrollmentController = $enrollmentController;
    }

    public function process(Payment $payment)
    {
        $this->authorize('view', $payment);

        $order = $payment->order;
        $course = $order->items->first()->course;

        return view('payments.process', compact('payment', 'order', 'course'));
    }

    public function success(Request $request, Payment $payment)
    {
        $this->authorize('view', $payment);

        $order = $payment->order;
        $courses = $order->items->pluck('course');

        // Mettre à jour le paiement
        $payment->update([
            'status' => 'COMPLETED',
            'transaction_id' => $request->transaction_id,
            'timestamp' => now()
        ]);

        // Mettre à jour la commande
        $order->update([
            'status' => 'COMPLETED'
        ]);

        $enrolledCourses = [];

        // Créer l'inscription et la facture
        DB::transaction(function () use ($order, $courses, &$invoice, &$enrolledCourses) {
            foreach ($courses as $course) {
                // Créer l'inscription pour chaque cours
                $order->user->enrolledCourses()->attach($course->id, [
                    'enrollment_date' => now(),
                    'price' => $course->price,
                    'payment_id' => $order->payment->id,
                    'status' => 'ACTIVE'
                ]);

                // Créer un certificat si le cours en propose un
                if ($course->has_certificate) {
                    $certificate = $course->certificates()->create([
                        'user_id' => $order->user_id,
                        'issue_date' => now(),
                        'title' => $course->title,
                        'instructor_name' => $course->instructor->name,
                        'student_name' => $order->user->name,
                        'course_title' => $course->title
                    ]);
                }

                $enrolledCourses[] = [
                    'id' => $course->id,
                    'title' => $course->title,
                    'status' => 'ENROLLED'
                ];
            }

            // Créer une facture unique pour tous les cours
            $invoice = $order->invoice()->create([
                'user_id' => $order->user_id,
                'total_amount' => $order->total_amount,
                'tax_amount' => $order->tax,
                'discount' => $order->discount,
                'final_amount' => $order->final_amount,
                'issue_date' => now(),
                'due_date' => now()->addDays(30),
                'status' => 'PAID',
                'billing_address' => $order->billing_address
            ]);
        });

        // Générer l'URL de la facture
        $invoiceUrl = route('invoice.download', ['invoice' => $invoice->id]);

        return response()->json([
            'status' => 'success',
            'message' => 'Paiement traité avec succès',
            'data' => [
                'courses' => $enrolledCourses,
                'payment' => [
                    'id' => $payment->id,
                    'status' => $payment->status,
                    'amount' => $payment->amount,
                    'invoice_url' => $invoiceUrl
                ],
                'enrollment' => [
                    'status' => 'ACTIVE',
                    'date' => now()->format('Y-m-d H:i:s'),
                    'total_courses' => count($enrolledCourses)
                ]
            ]
        ], 200);
    }

    public function cancel(Payment $payment)
    {
        $this->authorize('view', $payment);

        $order = $payment->order;

        // Mettre à jour le paiement
        $payment->update([
            'status' => 'CANCELLED',
            'timestamp' => now()
        ]);

        // Mettre à jour la commande
        $order->update([
            'status' => 'CANCELLED'
        ]);

        return response()->json(['status' => 'success']);
    }

    public function webhook(Request $request)
    {
        try {
            // Vérification de la signature du webhook (à implémenter selon votre système de paiement)

            $paymentId = $request->input('payment_id');
            $payment = Payment::findOrFail($paymentId);

            if ($request->input('status') === 'COMPLETED' && $payment->status !== 'COMPLETED') {
                $payment->update([
                    'status' => 'COMPLETED',
                    'transaction_id' => $request->input('transaction_id')
                ]);

                // Mettre à jour le statut de la commande
                $payment->order->update(['status' => 'COMPLETED']);

                // Créer automatiquement l'inscription au cours
                $this->enrollmentController->enrollAfterPayment($payment);
            }

            return response()->json(['message' => 'Webhook traité avec succès']);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors du traitement du webhook',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function checkout(Request $request)
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));

        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'eur',
                    'product_data' => [
                        'name' => 'Nom du produit',
                    ],
                    'unit_amount' => 1000, // Montant en centimes (10,00 €)
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => route('success'),
            'cancel_url' => route('cancel'),
        ]);

        return response()->json(['id' => $session->id]);
    }

    /**
     * Récupérer toutes les transactions
     */
    public function index(Request $request)
    {
        try {
            $query = Payment::with([
                'order.items.course',
                'order.user',
                'order.invoice'
            ])->orderBy('created_at', 'desc');

            // Filtrer par statut si spécifié
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Filtrer par date si spécifié
            if ($request->has('start_date')) {
                $query->whereDate('created_at', '>=', $request->start_date);
            }
            if ($request->has('end_date')) {
                $query->whereDate('created_at', '<=', $request->end_date);
            }

            // Pagination
            $payments = $query->paginate(10);

            $formattedPayments = $payments->map(function ($payment) {
                $courses = $payment->order->items->map(function ($item) {
                    return [
                        'id' => $item->course->id,
                        'title' => $item->course->title,
                        'price' => $item->price,
                        'discount' => $item->discount
                    ];
                });

                return [
                    'id' => $payment->id,
                    'transaction_id' => $payment->transaction_id,
                    'amount' => $payment->amount,
                    'status' => $payment->status,
                    'date' => $payment->created_at->format('Y-m-d H:i:s'),
                    'user' => [
                        'id' => $payment->order->user->id,
                        'name' => $payment->order->user->name,
                        'email' => $payment->order->user->email
                    ],
                    'order' => [
                        'id' => $payment->order->id,
                        'total_amount' => $payment->order->total_amount,
                        'discount' => $payment->order->discount,
                        'final_amount' => $payment->order->final_amount,
                        'status' => $payment->order->status
                    ],
                    'courses' => $courses,
                    'invoice' => $payment->order->invoice ? [
                        'id' => $payment->order->invoice->id,
                        'download_url' => route('invoice.download', ['invoice' => $payment->order->invoice->id])
                    ] : null
                ];
            });

            return response()->json([
                'status' => 'success',
                'data' => [
                    'transactions' => $formattedPayments,
                    'pagination' => [
                        'total' => $payments->total(),
                        'per_page' => $payments->perPage(),
                        'current_page' => $payments->currentPage(),
                        'last_page' => $payments->lastPage()
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la récupération des transactions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function processPayment(Request $request)
    {
        try {
            // Validation des données de paiement
            $validated = $request->validate([
                'payment_method' => 'required|string',
                'card_number' => 'required_if:payment_method,card|string',
                'expiry_month' => 'required_if:payment_method,card|string',
                'expiry_year' => 'required_if:payment_method,card|string',
                'cvv' => 'required_if:payment_method,card|string',
                'billing_address' => 'required|array',
                'billing_address.street' => 'required|string',
                'billing_address.city' => 'required|string',
                'billing_address.state' => 'required|string',
                'billing_address.country' => 'required|string',
                'billing_address.postal_code' => 'required|string',
                'course_id' => 'required|exists:courses,id',
                'amount' => 'required|numeric|min:0'
            ]);

            DB::beginTransaction();

            // Créer la commande
            $order = Order::create([
                'user_id' => Auth::id(),
                'total_amount' => $validated['amount'],
                'discount' => 0, // À implémenter selon votre logique de remise
                'tax' => 0, // À implémenter selon votre logique de taxe
                'final_amount' => $validated['amount'],
                'status' => Order::STATUS_PENDING,
                'billing_address' => $validated['billing_address'],
                'created_date' => Carbon::now()
            ]);

            // Créer l'élément de commande
            $order->items()->create([
                'course_id' => $validated['course_id'],
                'price' => $validated['amount'],
                'discount' => 0 // À implémenter selon votre logique de remise
            ]);

            // Créer le paiement
            $payment = Payment::create([
                'order_id' => $order->id,
                'user_id' => Auth::id(),
                'amount' => $validated['amount'],
                'currency' => 'EUR',
                'method' => $validated['payment_method'],
                'status' => 'PENDING',
                'billing_details' => json_encode($validated['billing_address'])
            ]);

            // Simuler un paiement réussi (à remplacer par votre logique de paiement réelle)
            $payment->update([
                'status' => 'COMPLETED',
                'transaction_id' => 'TRANS_' . uniqid()
            ]);

            // Mettre à jour le statut de la commande
            $order->update(['status' => Order::STATUS_COMPLETED]);

            // Créer l'inscription au cours
            $enrollmentResponse = $this->enrollmentController->enrollAfterPayment($payment);

            DB::commit();

            return response()->json([
                'message' => 'Paiement traité avec succès',
                'payment' => $payment,
                'enrollment' => $enrollmentResponse->original
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Une erreur est survenue lors de la création de la session de paiement.',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}
