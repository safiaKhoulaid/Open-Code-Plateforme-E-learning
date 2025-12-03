<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Course;
use App\Models\Profile;
use App\Models\Setting;
use App\Models\Certificate;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\JsonResponse;

class DashboardStudentController extends Controller
{
    public function index(): JsonResponse
    {
        $userId = Auth::user()->id;
        Log::info('Récupération des données du tableau de bord pour l\'utilisateur: ' . $userId);

        $profile = Profile::where('user_id', $userId)->first();
        Log::info('Profil trouvé: ' . ($profile ? 'Oui' : 'Non'));

        $settings = Setting::where('user_id', $userId)->first();
        Log::info('Paramètres trouvés: ' . ($settings ? 'Oui' : 'Non'));

        $certificates = Certificate::with('course')
            ->where('user_id', $userId)
            ->get();
        Log::info('Nombre de certificats trouvés: ' . $certificates->count());

        $courses = Course::with('enrollments')
            ->whereHas('enrollments', function ($query) use ($userId) {
                $query->where('student_id', $userId);
            })
            ->get();
        Log::info('Nombre de cours trouvés: ' . $courses->count());

        $totalLessons = 0;
        $completedLessons = 0;
        foreach ($courses as $course) {
            foreach ($course->enrollments as $enrollment) {
                if ($enrollment->student_id == $userId) {
                    $totalLessons += $course->sections()->sum('lessons_count');
                    $completedLessons += $enrollment->completed_lessons_count;
                }
            }
        }
        $progress = $totalLessons > 0 ? ($completedLessons / $totalLessons) * 100 : 0;
        $wishlists = Wishlist::with('course')
        ->where('user_id', $userId)
        ->get();
        $response = [
            'data' => [
                'profile' => $profile,
                'settings' => $settings,
                'certificates' => $certificates,
                'courses' => $courses,
               ' progress'=>$progress,
                'wishlists' => $wishlists
            ],
            'message' => 'Données du tableau de bord récupérées avec succès'
        ];

        Log::info('Réponse envoyée: ' . json_encode($response));

        return response()->json($response);
    }
}
