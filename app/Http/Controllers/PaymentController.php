<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Order;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
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
        $course = $order->items->first()->course;

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

        // Créer l'inscription
        DB::transaction(function () use ($order, $course) {
            $enrollment = $order->user->enrolledCourses()->attach($course->id, [
                'enrollment_date' => now(),
                'price' => $course->price,
                'payment_id' => $order->payment->id,
                'status' => 'ACTIVE'
            ]);

            // Créer un certificat si le cours en propose un
            if ($course->has_certificate) {
                $course->certificates()->create([
                    'user_id' => $order->user_id,
                    'issue_date' => now(),
                    'title' => $course->title,
                    'instructor_name' => $course->instructor->name,
                    'student_name' => $order->user->name,
                    'course_title' => $course->title
                ]);
            }

            // Créer une facture
            $order->invoice()->create([
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

        return redirect()->route('courses.show', $course)
            ->with('success', 'Paiement réussi. Vous êtes maintenant inscrit au cours.');
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

        return redirect()->route('courses.show', $order->items->first()->course)
            ->with('error', 'Le paiement a été annulé.');
    }

    public function webhook(Request $request)
    {
        // Vérifier la signature du webhook
        $signature = $request->header('X-Payment-Signature');
        if (!$this->verifyWebhookSignature($request, $signature)) {
            return response()->json(['error' => 'Signature invalide'], 400);
        }

        $event = $request->input('event');
        $data = $request->input('data');

        switch ($event) {
            case 'payment.succeeded':
                $payment = Payment::where('transaction_id', $data['transaction_id'])->first();
                if ($payment) {
                    $this->handleSuccessfulPayment($payment);
                }
                break;

            case 'payment.failed':
                $payment = Payment::where('transaction_id', $data['transaction_id'])->first();
                if ($payment) {
                    $this->handleFailedPayment($payment);
                }
                break;

            case 'payment.refunded':
                $payment = Payment::where('transaction_id', $data['transaction_id'])->first();
                if ($payment) {
                    $this->handleRefundedPayment($payment);
                }
                break;
        }

        return response()->json(['status' => 'success']);
    }

    private function handleSuccessfulPayment(Payment $payment)
    {
        $order = $payment->order;
        $course = $order->items->first()->course;

        DB::transaction(function () use ($payment, $order, $course) {
            $payment->update([
                'status' => 'COMPLETED',
                'timestamp' => now()
            ]);

            $order->update([
                'status' => 'COMPLETED'
            ]);

            $order->user->enrolledCourses()->attach($course->id, [
                'enrollment_date' => now(),
                'price' => $course->price,
                'payment_id' => $payment->id,
                'status' => 'ACTIVE'
            ]);

            if ($course->has_certificate) {
                $course->certificates()->create([
                    'user_id' => $order->user_id,
                    'issue_date' => now(),
                    'title' => $course->title,
                    'instructor_name' => $course->instructor->name,
                    'student_name' => $order->user->name,
                    'course_title' => $course->title
                ]);
            }

            $order->invoice()->create([
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
    }

    private function handleFailedPayment(Payment $payment)
    {
        $order = $payment->order;

        DB::transaction(function () use ($payment, $order) {
            $payment->update([
                'status' => 'FAILED',
                'timestamp' => now()
            ]);

            $order->update([
                'status' => 'FAILED'
            ]);
        });
    }

    private function handleRefundedPayment(Payment $payment)
    {
        $order = $payment->order;
        $course = $order->items->first()->course;

        DB::transaction(function () use ($payment, $order, $course) {
            $payment->update([
                'status' => 'REFUNDED',
                'timestamp' => now()
            ]);

            $order->update([
                'status' => 'REFUNDED'
            ]);

            // Supprimer l'inscription
            $order->user->enrolledCourses()->detach($course->id);

            // Supprimer le certificat
            $course->certificates()
                ->where('user_id', $order->user_id)
                ->delete();

            // Mettre à jour la facture
            $order->invoice()->update([
                'status' => 'REFUNDED'
            ]);
        });
    }

    private function verifyWebhookSignature(Request $request, $signature)
    {
        // Implémenter la vérification de la signature selon le fournisseur de paiement
        return true;
    }
}
