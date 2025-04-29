<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Stripe\Webhook;

class StripeController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(config('stripe.secret'));
    }

    /**
     * Create a Stripe checkout session for a course purchase
     *
     * @param Request $request
     * @param Course $course
     * @return \Illuminate\Http\JsonResponse
     */
    public function createCheckoutSession(Request $request, Course $course)
    {
        try {
            $user = Auth::user();

            // Check if user is already enrolled in the course
            if ($user->enrolledCourses()->where('course_id', $course->id)->exists()) {
                return response()->json([
                    'error' => 'Vous êtes déjà inscrit à ce cours.'
                ], 400);
            }

            // Create an order
            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => $course->price,
                'discount' => $course->discount ?? 0,
                'tax' => 0, // Calculate based on tax rules
                'final_amount' => $course->price - ($course->discount ?? 0),
                'payment_method' => 'stripe',
                'status' => 'PENDING',
                'created_date' => now(),
                'billing_address' => $request->billing_address ?? null
            ]);

            // Create an order item
            $order->items()->create([
                'course_id' => $course->id,
                'price' => $course->price,
                'discount' => $course->discount ?? 0
            ]);

            // Create a payment record
            $payment = Payment::create([
                'order_id' => $order->id,
                'user_id' => $user->id,
                'amount' => $order->final_amount,
                'currency' => config('stripe.currency'),
                'method' => 'stripe',
                'status' => 'PENDING',
                'transaction_id' => null,
                'timestamp' => now(),
                'billing_details' => $request->billing_address ?? null
            ]);

            // Create Stripe checkout session
            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => [
                    [
                        'price_data' => [
                            'currency' => config('stripe.currency'),
                            'product_data' => [
                                'name' => $course->title,
                                'description' => $course->subtitle,
                                'images' => [$course->image_url ? url('storage/' . $course->image_url) : null],
                            ],
                            'unit_amount' => (int)($order->final_amount * 100), // Stripe requires amount in cents
                        ],
                        'quantity' => 1,
                    ],
                ],
                'metadata' => [
                    'order_id' => $order->id,
                    'payment_id' => $payment->id,
                    'course_id' => $course->id,
                    'user_id' => $user->id,
                ],
                'mode' => 'payment',
                'success_url' => route('stripe.success') . '?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('stripe.cancel') . '?session_id={CHECKOUT_SESSION_ID}',
            ]);

            // Update payment with Stripe session ID
            $payment->update([
                'transaction_id' => $session->id
            ]);

            return response()->json([
                'sessionId' => $session->id,
                'url' => $session->url
            ]);
        } catch (\Exception $e) {
            Log::error('Stripe session creation error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Une erreur est survenue lors de la création de la session de paiement.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Handle successful payment
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function success(Request $request)
    {
        try {
            $sessionId = $request->get('session_id');

            if (!$sessionId) {
                return redirect()->route('home')->with('error', 'Session de paiement invalide.');
            }

            $session = Session::retrieve($sessionId);
            $payment = Payment::where('transaction_id', $sessionId)->first();

            if (!$payment) {
                return redirect()->route('home')->with('error', 'Paiement non trouvé.');
            }

            $order = $payment->order;
            $course = $order->items->first()->course;
            $user = $order->user;

            // Check if payment is already processed
            if ($payment->status === 'COMPLETED') {
                return redirect()->route('courses.show', $course->id)
                    ->with('success', 'Paiement déjà traité. Vous êtes inscrit au cours.');
            }

            // Process the successful payment
            DB::transaction(function () use ($payment, $order, $course, $user) {
                // Update payment status
                $payment->update([
                    'status' => 'COMPLETED',
                    'timestamp' => now()
                ]);

                // Update order status
                $order->update([
                    'status' => 'COMPLETED'
                ]);

                // Create enrollment
                $user->enrolledCourses()->attach($course->id, [
                    'enrollment_date' => now(),
                    'price' => $course->price,
                    'payment_id' => $payment->id,
                    'status' => 'ACTIVE'
                ]);

                // Create certificate if course offers one
                if ($course->has_certificate) {
                    $course->certificates()->create([
                        'user_id' => $user->id,
                        'issue_date' => now(),
                        'title' => $course->title,
                        'instructor_name' => $course->instructor->name,
                        'student_name' => $user->name,
                        'course_title' => $course->title
                    ]);
                }

                // Create invoice
                $order->invoice()->create([
                    'user_id' => $user->id,
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

            return redirect()->route('courses.show', $course->id)
                ->with('success', 'Paiement réussi. Vous êtes maintenant inscrit au cours.');
        } catch (\Exception $e) {
            Log::error('Stripe success callback error: ' . $e->getMessage());
            return redirect()->route('home')
                ->with('error', 'Une erreur est survenue lors du traitement du paiement.');
        }
    }

    /**
     * Handle cancelled payment
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function cancel(Request $request)
    {
        try {
            $sessionId = $request->get('session_id');

            if (!$sessionId) {
                return redirect()->route('home')->with('error', 'Session de paiement invalide.');
            }

            $payment = Payment::where('transaction_id', $sessionId)->first();

            if (!$payment) {
                return redirect()->route('home')->with('error', 'Paiement non trouvé.');
            }

            $order = $payment->order;
            $course = $order->items->first()->course;

            // Update payment and order status
            $payment->update([
                'status' => 'CANCELLED',
                'timestamp' => now()
            ]);

            $order->update([
                'status' => 'CANCELLED'
            ]);

            return redirect()->route('courses.show', $course->id)
                ->with('error', 'Le paiement a été annulé.');
        } catch (\Exception $e) {
            Log::error('Stripe cancel callback error: ' . $e->getMessage());
            return redirect()->route('home')
                ->with('error', 'Une erreur est survenue lors de l\'annulation du paiement.');
        }
    }

    /**
     * Handle Stripe webhooks
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function webhook(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $webhookSecret = config('stripe.webhook_secret');

        try {
            if ($webhookSecret) {
                $event = Webhook::constructEvent($payload, $sigHeader, $webhookSecret);
            } else {
                // For testing without a webhook secret
                $event = json_decode($payload, true);
            }

            // Handle the event
            switch ($event->type) {
                case 'checkout.session.completed':
                    $session = $event->data->object;
                    $this->handleSuccessfulPayment($session);
                    break;
                case 'charge.refunded':
                    $charge = $event->data->object;
                    $this->handleRefundedPayment($charge);
                    break;
                default:
                    Log::info('Unhandled Stripe event: ' . $event->type);
            }

            return response()->json(['status' => 'success']);
        } catch (SignatureVerificationException $e) {
            Log::error('Stripe webhook signature verification failed: ' . $e->getMessage());
            return response()->json(['error' => 'Invalid signature'], 400);
        } catch (\Exception $e) {
            Log::error('Stripe webhook error: ' . $e->getMessage());
            return response()->json(['error' => 'Webhook error'], 500);
        }
    }

    /**
     * Handle successful payment from webhook
     *
     * @param \Stripe\Checkout\Session $session
     * @return void
     */
    private function handleSuccessfulPayment($session)
    {
        try {
            $payment = Payment::where('transaction_id', $session->id)->first();

            if (!$payment || $payment->status === 'COMPLETED') {
                return;
            }

            $order = $payment->order;
            $course = $order->items->first()->course;
            $user = $order->user;

            DB::transaction(function () use ($payment, $order, $course, $user) {
                // Update payment status
                $payment->update([
                    'status' => 'COMPLETED',
                    'timestamp' => now()
                ]);

                // Update order status
                $order->update([
                    'status' => 'COMPLETED'
                ]);

                // Create enrollment if it doesn't exist
                if (!$user->enrolledCourses()->where('course_id', $course->id)->exists()) {
                    $user->enrolledCourses()->attach($course->id, [
                        'enrollment_date' => now(),
                        'price' => $course->price,
                        'payment_id' => $payment->id,
                        'status' => 'ACTIVE'
                    ]);

                    // Create certificate if course offers one
                    if ($course->has_certificate) {
                        $course->certificates()->create([
                            'user_id' => $user->id,
                            'issue_date' => now(),
                            'title' => $course->title,
                            'instructor_name' => $course->instructor->name,
                            'student_name' => $user->name,
                            'course_title' => $course->title
                        ]);
                    }

                    // Create invoice
                    $order->invoice()->create([
                        'user_id' => $user->id,
                        'total_amount' => $order->total_amount,
                        'tax_amount' => $order->tax,
                        'discount' => $order->discount,
                        'final_amount' => $order->final_amount,
                        'issue_date' => now(),
                        'due_date' => now()->addDays(30),
                        'status' => 'PAID',
                        'billing_address' => $order->billing_address
                    ]);
                }
            });
        } catch (\Exception $e) {
            Log::error('Error processing successful payment webhook: ' . $e->getMessage());
        }
    }

    /**
     * Handle refunded payment from webhook
     *
     * @param \Stripe\Charge $charge
     * @return void
     */
    private function handleRefundedPayment($charge)
    {
        try {
            // Find payment by charge ID or related transaction ID
            $payment = Payment::where('transaction_id', $charge->payment_intent)->first();

            if (!$payment) {
                return;
            }

            $order = $payment->order;
            $course = $order->items->first()->course;
            $user = $order->user;

            DB::transaction(function () use ($payment, $order, $course, $user) {
                // Update payment status
                $payment->update([
                    'status' => 'REFUNDED',
                    'timestamp' => now()
                ]);

                // Update order status
                $order->update([
                    'status' => 'REFUNDED'
                ]);

                // Remove enrollment
                $user->enrolledCourses()->detach($course->id);

                // Remove certificate
                $course->certificates()
                    ->where('user_id', $user->id)
                    ->delete();

                // Update invoice
                $order->invoice()->update([
                    'status' => 'REFUNDED'
                ]);
            });
        } catch (\Exception $e) {
            Log::error('Error processing refunded payment webhook: ' . $e->getMessage());
        }
    }

    /**
     * Create a Stripe checkout session for all items in the cart
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createCartCheckoutSession(Request $request)
    {
        try {
            $user = Auth::user();
            $cartItems = $user->shoppingCart()->with('course')->get();
            
            if ($cartItems->isEmpty()) {
                return response()->json([
                    'error' => 'Votre panier est vide.'
                ], 400);
            }
            
            // Calculate total amount
            $totalAmount = $cartItems->sum(function($item) {
                return $item->course->price - ($item->course->discount ?? 0);
            });
            
            // Create an order
            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => $totalAmount,
                'discount' => $cartItems->sum('course.discount'),
                'tax' => 0, // Calculate based on tax rules
                'final_amount' => $totalAmount,
                'payment_method' => 'stripe',
                'status' => 'PENDING',
                'created_date' => now(),
                'billing_address' => $request->billing_address ?? null
            ]);
            
            // Create order items
            foreach ($cartItems as $item) {
                $order->items()->create([
                    'course_id' => $item->course_id,
                    'price' => $item->course->price,
                    'discount' => $item->course->discount ?? 0
                ]);
            }
            
            // Create a payment record
            $payment = Payment::create([
                'order_id' => $order->id,
                'user_id' => $user->id,
                'amount' => $order->final_amount,
                'currency' => config('stripe.currency'),
                'method' => 'stripe',
                'status' => 'PENDING',
                'transaction_id' => null,
                'timestamp' => now(),
                'billing_details' => $request->billing_address ?? null
            ]);
            
            // Prepare line items for Stripe
            $lineItems = [];
            foreach ($cartItems as $item) {
                $course = $item->course;
                $imageUrl = null;
                
                // Vérifier si l'URL de l'image existe et n'est pas vide
                if ($course->image_url) {
                    $imageUrl = url('storage/' . $course->image_url);
                }
                
                $lineItemData = [
                    'price_data' => [
                        'currency' => config('stripe.currency'),
                        'product_data' => [
                            'name' => $course->title,
                            'description' => $course->subtitle ?? 'Cours en ligne',
                        ],
                        'unit_amount' => (int)(($course->price - ($course->discount ?? 0)) * 100),
                    ],
                    'quantity' => 1,
                ];
                
                // Ajouter l'image uniquement si elle existe
                if ($imageUrl) {
                    $lineItemData['price_data']['product_data']['images'] = [$imageUrl];
                }
                
                $lineItems[] = $lineItemData;
            }
            
            // Préparer les URLs de succès et d'annulation avec fallback
            $successUrl = $request->success_url ?? route('stripe.cart.success');
            $cancelUrl = $request->cancel_url ?? route('stripe.cart.cancel');
            
            // Assurer que les URLs contiennent le paramètre de session
            if (strpos($successUrl, 'session_id') === false) {
                $successUrl .= (strpos($successUrl, '?') !== false ? '&' : '?') . 'session_id={CHECKOUT_SESSION_ID}';
            }
            
            if (strpos($cancelUrl, 'session_id') === false) {
                $cancelUrl .= (strpos($cancelUrl, '?') !== false ? '&' : '?') . 'session_id={CHECKOUT_SESSION_ID}';
            }
            
            // Create Stripe checkout session
            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => $lineItems,
                'metadata' => [
                    'order_id' => $order->id,
                    'payment_id' => $payment->id,
                    'user_id' => $user->id,
                ],
                'mode' => 'payment',
                'success_url' => $successUrl,
                'cancel_url' => $cancelUrl,
            ]);
            
            // Update payment with Stripe session ID
            $payment->update([
                'transaction_id' => $session->id
            ]);
            
            return response()->json([
                'sessionId' => $session->id,
                'url' => $session->url
            ]);
        } catch (\Exception $e) {
            Log::error('Stripe cart session creation error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Une erreur est survenue lors de la création de la session de paiement.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Handle successful cart payment
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function cartSuccess(Request $request)
    {
        try {
            $sessionId = $request->get('session_id');
            
            if (!$sessionId) {
                return redirect()->route('home')->with('error', 'Session de paiement invalide.');
            }
            
            $session = Session::retrieve($sessionId);
            $payment = Payment::where('transaction_id', $sessionId)->first();
            
            if (!$payment) {
                return redirect()->route('home')->with('error', 'Paiement non trouvé.');
            }
            
            $order = $payment->order;
            $user = $order->user;
            
            // Check if payment is already processed
            if ($payment->status === 'COMPLETED') {
                return redirect()->route('student.dashboard')
                    ->with('success', 'Paiement déjà traité. Vous êtes inscrit aux cours.');
            }
            
            // Process the successful payment
            DB::transaction(function () use ($payment, $order, $user) {
                // Update payment status
                $payment->update([
                    'status' => 'COMPLETED',
                    'timestamp' => now()
                ]);
                
                // Update order status
                $order->update([
                    'status' => 'COMPLETED'
                ]);
                
                // Create enrollments for all courses in the order
                foreach ($order->items as $item) {
                    $course = $item->course;
                    
                    // Check if user is already enrolled in the course
                    if (!$user->enrolledCourses()->where('course_id', $course->id)->exists()) {
                        $user->enrolledCourses()->attach($course->id, [
                            'enrollment_date' => now(),
                            'price' => $course->price,
                            'payment_id' => $payment->id,
                            'status' => 'ACTIVE'
                        ]);
                        
                        // Create certificate if course offers one
                        if ($course->has_certificate) {
                            $course->certificates()->create([
                                'user_id' => $user->id,
                                'issue_date' => now(),
                                'title' => $course->title,
                                'instructor_name' => $course->instructor->name,
                                'student_name' => $user->name,
                                'course_title' => $course->title
                            ]);
                        }
                    }
                }
                
                // Create invoice
                $order->invoice()->create([
                    'user_id' => $user->id,
                    'total_amount' => $order->total_amount,
                    'tax_amount' => $order->tax,
                    'discount' => $order->discount,
                    'final_amount' => $order->final_amount,
                    'issue_date' => now(),
                    'due_date' => now()->addDays(30),
                    'status' => 'PAID',
                    'billing_address' => $order->billing_address
                ]);
                
                // Clear the shopping cart
                $user->shoppingCart()->delete();
            });
            
            return redirect()->route('student.dashboard')
                ->with('success', 'Paiement réussi. Vous êtes maintenant inscrit à tous les cours.');
        } catch (\Exception $e) {
            Log::error('Stripe cart success callback error: ' . $e->getMessage());
            return redirect()->route('home')
                ->with('error', 'Une erreur est survenue lors du traitement du paiement.');
        }
    }

    /**
     * Handle cancelled cart payment
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function cartCancel(Request $request)
    {
        try {
            $sessionId = $request->get('session_id');
            
            if (!$sessionId) {
                return redirect()->route('home')->with('error', 'Session de paiement invalide.');
            }
            
            $payment = Payment::where('transaction_id', $sessionId)->first();
            
            if (!$payment) {
                return redirect()->route('home')->with('error', 'Paiement non trouvé.');
            }
            
            $order = $payment->order;
            
            // Update payment and order status
            $payment->update([
                'status' => 'CANCELLED',
                'timestamp' => now()
            ]);
            
            $order->update([
                'status' => 'CANCELLED'
            ]);
            
            return redirect()->route('cart')
                ->with('error', 'Le paiement a été annulé.');
        } catch (\Exception $e) {
            Log::error('Stripe cart cancel callback error: ' . $e->getMessage());
            return redirect()->route('home')
                ->with('error', 'Une erreur est survenue lors de l\'annulation du paiement.');
        }
    }

    /**
     * Create a Stripe checkout session for frontend React integration
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createFrontendCheckoutSession(Request $request)
    {
        try {
            $user = Auth::user();
            
            // Validate request
            $validated = $request->validate([
                'cart_items' => 'array',
                'success_url' => 'required|string',
                'cancel_url' => 'required|string',
                'billing_address' => 'nullable|string',
                'customer_info' => 'nullable|array',
            ]);
            
            // Si le panier est vide dans la requête, utiliser le panier de l'utilisateur
            $cartItems = [];
            if (empty($validated['cart_items'])) {
                $cartItems = $user->shoppingCart()->with('course')->get();
            } else {
                // Traiter les éléments du panier fournis dans la requête
                foreach ($validated['cart_items'] as $item) {
                    $course = Course::find($item['course_id']);
                    if ($course) {
                        $cartItems[] = (object)[
                            'course' => $course,
                            'course_id' => $course->id
                        ];
                    }
                }
            }
            
            if (empty($cartItems)) {
                return response()->json([
                    'error' => 'Votre panier est vide.'
                ], 400);
            }
            
            // Calculate total amount
            $totalAmount = 0;
            foreach ($cartItems as $item) {
                $totalAmount += $item->course->price - ($item->course->discount ?? 0);
            }
            
            // Create an order
            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => $totalAmount,
                'discount' => 0, // Calculer la remise si nécessaire
                'tax' => 0, // Calculer la taxe si nécessaire
                'final_amount' => $totalAmount,
                'payment_method' => 'stripe',
                'status' => 'PENDING',
                'created_date' => now(),
                'billing_address' => $validated['billing_address'] ?? null
            ]);
            
            // Create order items
            foreach ($cartItems as $item) {
                $order->items()->create([
                    'course_id' => $item->course->id,
                    'price' => $item->course->price,
                    'discount' => $item->course->discount ?? 0
                ]);
            }
            
            // Create a payment record
            $payment = Payment::create([
                'order_id' => $order->id,
                'user_id' => $user->id,
                'amount' => $order->final_amount,
                'currency' => config('stripe.currency'),
                'method' => 'stripe',
                'status' => 'PENDING',
                'transaction_id' => null,
                'timestamp' => now(),
                'billing_details' => $validated['billing_address'] ?? null
            ]);
            
            // Prepare line items for Stripe
            $lineItems = [];
            foreach ($cartItems as $item) {
                $course = $item->course;
                $imageUrl = null;
                
                // Vérifier si l'URL de l'image existe et n'est pas vide
                if ($course->image_url) {
                    $imageUrl = url('storage/' . $course->image_url);
                }
                
                $lineItemData = [
                    'price_data' => [
                        'currency' => config('stripe.currency'),
                        'product_data' => [
                            'name' => $course->title,
                            'description' => $course->subtitle ?? 'Cours en ligne',
                        ],
                        'unit_amount' => (int)(($course->price - ($course->discount ?? 0)) * 100),
                    ],
                    'quantity' => 1,
                ];
                
                // Ajouter l'image uniquement si elle existe
                if ($imageUrl) {
                    $lineItemData['price_data']['product_data']['images'] = [$imageUrl];
                }
                
                $lineItems[] = $lineItemData;
            }
            
            // Préparer les URLs de succès et d'annulation
            $successUrl = $validated['success_url'];
            $cancelUrl = $validated['cancel_url'];
            
            // Assurer que les URLs contiennent le paramètre de session
            if (strpos($successUrl, 'session_id') === false) {
                $successUrl .= (strpos($successUrl, '?') !== false ? '&' : '?') . 'session_id={CHECKOUT_SESSION_ID}';
            }
            
            if (strpos($cancelUrl, 'session_id') === false) {
                $cancelUrl .= (strpos($cancelUrl, '?') !== false ? '&' : '?') . 'session_id={CHECKOUT_SESSION_ID}';
            }
            
            // Create Stripe checkout session
            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => $lineItems,
                'metadata' => [
                    'order_id' => $order->id,
                    'payment_id' => $payment->id,
                    'user_id' => $user->id,
                ],
                'mode' => 'payment',
                'success_url' => $successUrl,
                'cancel_url' => $cancelUrl,
            ]);
            
            // Update payment with Stripe session ID
            $payment->update([
                'transaction_id' => $session->id
            ]);
            
            return response()->json([
                'sessionId' => $session->id,
                'url' => $session->url
            ]);
        } catch (\Exception $e) {
            Log::error('Frontend Stripe session creation error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Une erreur est survenue lors de la création de la session de paiement.',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}
