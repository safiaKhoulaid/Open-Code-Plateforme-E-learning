<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Storage;

class EnrollmentController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $enrollments = Auth::user()->enrolledCourses()
            ->with(['course', 'course.instructor'])
            ->paginate(10);

        return view('enrollments.index', compact('enrollments'));
    }

    public function store(Request $request, Course $course)
    {
        $user = Auth::user();

        if ($user->enrolledCourses()->where('course_id', $course->id)->exists()) {
            return back()->with('error', 'Vous êtes déjà inscrit à ce cours.');
        }

        if ($course->price > 0) {
            // Créer une commande
            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => $course->price,
                'discount' => $course->discount ?? 0,
                'tax' => 0, // À calculer selon les règles fiscales
                'final_amount' => $course->price - ($course->discount ?? 0),
                'payment_method' => $request->payment_method,
                'status' => 'PENDING',
                'created_date' => now(),
                'billing_address' => $request->billing_address
            ]);

            // Créer un élément de commande
            $order->items()->create([
                'course_id' => $course->id,
                'price' => $course->price,
                'discount' => $course->discount ?? 0
            ]);

            // Créer un paiement
            $payment = Payment::create([
                'order_id' => $order->id,
                'user_id' => $user->id,
                'amount' => $order->final_amount,
                'currency' => 'EUR',
                'method' => $request->payment_method,
                'status' => 'PENDING',
                'transaction_id' => null,
                'timestamp' => now(),
                'billing_details' => $request->billing_address
            ]);

            // Rediriger vers la page de paiement
            return redirect()->route('payments.process', $payment);
        }

        // Si le cours est gratuit, créer directement l'inscription
        DB::transaction(function () use ($user, $course) {
            $enrollment = $user->enrolledCourses()->attach($course->id, [
                'enrollment_date' => now(),
                'price' => 0,
                'status' => 'ACTIVE'
            ]);

            // Créer un certificat si le cours en propose un
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
        });

        return redirect()->route('courses.show', $course)
            ->with('success', 'Inscription réussie au cours.');
    }

    public function show(Course $course)
    {
        $this->authorize('view', $course);

        $enrollment = Auth::user()->enrolledCourses()
            ->where('course_id', $course->id)
            ->first();

        if (!$enrollment) {
            return back()->with('error', 'Vous n\'êtes pas inscrit à ce cours.');
        }

        return view('enrollments.show', compact('course', 'enrollment'));
    }

    public function destroy(Course $course)
    {
        $user = Auth::user();

        if (!$user->enrolledCourses()->where('course_id', $course->id)->exists()) {
            return back()->with('error', 'Vous n\'êtes pas inscrit à ce cours.');
        }

        $user->enrolledCourses()->detach($course->id);

        return redirect()->route('enrollments.index')
            ->with('success', 'Désinscription réussie du cours.');
    }

    public function certificate(Course $course)
    {
        $this->authorize('view', $course);

        $certificate = $course->certificates()
            ->where('user_id', Auth::id())
            ->first();

        if (!$certificate) {
            return back()->with('error', 'Certificat non disponible.');
        }

        return view('enrollments.certificate', compact('course', 'certificate'));
    }

    public function downloadCertificate(Course $course)
    {
        $this->authorize('view', $course);

        $certificate = $course->certificates()
            ->where('user_id', Auth::id())
            ->first();

        if (!$certificate || !$certificate->pdf_url) {
            return back()->with('error', 'Certificat non disponible.');
        }

        return Storage::disk('public')->download($certificate->pdf_url);
    }
}
