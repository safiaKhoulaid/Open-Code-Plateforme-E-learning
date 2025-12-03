<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Progress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Storage;

class EnrollmentController extends Controller
{
    use AuthorizesRequests;

    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * Inscrire un utilisateur à un cours après l'achat
     */
    public function store(Request $request, Course $course)
    {
        try {
            // Vérifier si l'utilisateur est déjà inscrit
            $existingEnrollment = Enrollment::where('student_id', Auth::id())
                ->where('course_id', $course->id)
                ->first();

            if ($existingEnrollment) {
                return response()->json([
                    'message' => 'Vous êtes déjà inscrit à ce cours'
                ], 400);
            }

            // Créer l'inscription
            $enrollment = Enrollment::create([
                'student_id' => Auth::id(),
                'course_id' => $course->id,
                'status' => 'active',
                'enrolled_at' => now(),
                'last_accessed_at' => now(),
                'completion_percentage' => 0
            ]);

            // Créer une entrée de progression pour l'utilisateur
            Progress::create([
                'user_id' => Auth::id(),
                'course_id' => $course->id,
                'completed_lessons' => [],
                'current_lesson_id' => null,
                'progress_percentage' => 0,
                'last_activity_at' => now()
            ]);

            return response()->json([
                'message' => 'Inscription au cours réussie',
                'data' => $enrollment->load('course', 'student')
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de l\'inscription au cours',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir toutes les inscriptions de l'utilisateur connecté
     */
    public function index()
    {
        try {
            $enrollments = Enrollment::where('student_id', Auth::id())
                ->with(['course' => function($query) {
                    $query->with(['instructor', 'sections.lessons']);
                }])
                ->orderBy('enrolled_at', 'desc')
                ->get();

            return response()->json([
                'message' => 'Liste des inscriptions récupérée avec succès',
                'data' => $enrollments
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la récupération des inscriptions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir les détails d'une inscription spécifique
     */
    public function show(Enrollment $enrollment)
    {
        try {
            // Vérifier si l'inscription appartient à l'utilisateur connecté
            if ($enrollment->student_id !== Auth::id()) {
                return response()->json([
                    'message' => 'Non autorisé'
                ], 403);
            }

            $enrollment->load([
                'course' => function($query) {
                    $query->with(['instructor', 'sections.lessons']);
                },
                'progress'
            ]);

            return response()->json([
                'message' => 'Détails de l\'inscription récupérés avec succès',
                'data' => $enrollment
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la récupération des détails de l\'inscription',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mettre à jour le statut d'une inscription
     */
    public function update(Request $request, Enrollment $enrollment)
    {
        try {
            // Vérifier si l'inscription appartient à l'utilisateur connecté
            if ($enrollment->student_id !== Auth::id()) {
                return response()->json([
                    'message' => 'Non autorisé'
                ], 403);
            }

            $validated = $request->validate([
                'status' => 'required|in:active,completed,paused,cancelled'
            ]);

            $enrollment->update([
                'status' => $validated['status'],
                'last_accessed_at' => now()
            ]);

            return response()->json([
                'message' => 'Statut de l\'inscription mis à jour avec succès',
                'data' => $enrollment
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la mise à jour du statut de l\'inscription',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer une inscription
     */
    public function destroy(Enrollment $enrollment)
    {
        try {
            // Vérifier si l'inscription appartient à l'utilisateur connecté
            if ($enrollment->student_id !== Auth::id()) {
                return response()->json([
                    'message' => 'Non autorisé'
                ], 403);
            }

            $enrollment->delete();

            return response()->json([
                'message' => 'Inscription supprimée avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la suppression de l\'inscription',
                'error' => $e->getMessage()
            ], 500);
        }
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

    /**
     * Créer une inscription automatiquement après le paiement
     */
    public function enrollAfterPayment(Payment $payment)
    {
        try {
            DB::beginTransaction();

            // Vérifier si le paiement est réussi
            if ($payment->status !== 'COMPLETED') {
                throw new \Exception('Le paiement n\'est pas complété');
            }

            // Récupérer la commande et le cours
            $order = $payment->order;
            $orderItem = $order->items->first(); // Supposons qu'il n'y a qu'un cours par commande
            $course = Course::findOrFail($orderItem->course_id);

            // Vérifier si l'utilisateur est déjà inscrit
            $existingEnrollment = Enrollment::where('student_id', $payment->user_id)
                ->where('course_id', $course->id)
                ->first();

            if ($existingEnrollment) {
                throw new \Exception('L\'utilisateur est déjà inscrit à ce cours');
            }

            // Créer l'inscription
            $enrollment = Enrollment::create([
                'student_id' => $payment->user_id,
                'course_id' => $course->id,
                'status' => 'active',
                'enrolled_at' => now(),
                'last_accessed_at' => now(),
                'completion_percentage' => 0
            ]);

            // Créer une entrée de progression
            Progress::create([
                'user_id' => $payment->user_id,
                'course_id' => $course->id,
                'completed_lessons' => [],
                'current_lesson_id' => null,
                'progress_percentage' => 0,
                'last_activity_at' => now()
            ]);

            // Si le cours offre un certificat, le créer
            if ($course->has_certificate) {
                $course->certificates()->create([
                    'user_id' => $payment->user_id,
                    'issue_date' => null, // Sera mis à jour une fois le cours terminé
                    'completion_date' => null,
                    'status' => 'pending'
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Inscription créée avec succès après paiement',
                'data' => $enrollment->load('course', 'student')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors de la création de l\'inscription après paiement',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
