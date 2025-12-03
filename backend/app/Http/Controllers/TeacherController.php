<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Course;
use App\Models\Rating;
use App\Models\Profile;
use App\Models\Setting;
use App\Models\Notification;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class TeacherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($id)
    {
        $user = User::find($id);
        if($user && $user->role !== "teacher")
        {
         return response()->json(['error' => 'L\'utilisateur n\'est pas un enseignant'], 403);
        }

        $courses = DB::table("courses")->where('instructor_id', $id)->get();
        $students = DB:: table('users as u')
        ->join('enrollments as en','u.id','=','student_id')
        ->join('courses as c','c.id' ,"=","en.course_id")
        ->where('c.instructor_id','=',$id)
        ->get();
        $profile = DB::table('profiles')->where('user_id',$id)->get();

        return response()->json(['courses'=>$courses,'student'=>$students,'profile'=>$profile]);
    }

    /**
     * Retourne toutes les informations pour le dashboard d'un enseignant
     */
    public function dashboard($id)
    {
        try {
            // Vérifier si l'utilisateur est un enseignant
            $user = User::find($id);
            if(!$user || $user->role !== "teacher") {
                return response()->json(['error' => 'L\'utilisateur n\'est pas un enseignant'], 403);
            }

            // Récupérer tous les cours de l'enseignant
            $courses = Course::where('instructor_id', $id)->get();
            $totalCourses = $courses->count();

            // Récupérer le nombre total d'étudiants inscrits à ses cours
            $courseIds = $courses->pluck('id')->toArray();
            $totalStudents = Enrollment::whereIn('course_id', $courseIds)
                                    ->distinct('student_id')
                                    ->count('student_id');

            // Calculer le revenu total (somme des prix des inscriptions)
            $totalRevenue = Enrollment::whereIn('course_id', $courseIds)
                                    ->sum('price');

            // Calculer la note moyenne de tous les cours
            $averageRating = Rating::whereIn('course_id', $courseIds)
                                ->avg('stars') ?? 0;

            // Récupérer le profil
            $profile = Profile::where('user_id', $id)->first();

            // Récupérer les paramètres
            $settings = Setting::where('user_id', $id)->first();

            // Récupérer les derniers étudiants inscrits
            $recentStudents = Enrollment::whereIn('course_id', $courseIds)
                                ->with('student')
                                ->orderBy('enrollment_date', 'desc')
                                ->take(5)
                                ->get();

            // Récupérer les notifications
            $notifications = Notification::where('user_id', $id)
                                ->orderBy('created_at', 'desc')
                                ->take(10)
                                ->get();

            // Récupérer les statistiques détaillées par cours
            $courseStatistics = [];
            foreach($courses as $course) {
                $enrollments = Enrollment::where('course_id', $course->id)->count();
                $revenue = Enrollment::where('course_id', $course->id)->sum('price');
                $rating = Rating::where('course_id', $course->id)->avg('stars') ?? 0;

                $courseStatistics[] = [
                    'id' => $course->id,
                    'title' => $course->title,
                    'image_url' => $course->image_url,
                    'students_count' => $enrollments,
                    'revenue' => $revenue,
                    'rating' => $rating,
                    'status' => $course->status,
                    'created_at' => $course->created_at
                ];
            }

            // Retourner toutes les données dans une réponse JSON structurée
            return response()->json([
                'teacher' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'profile' => $profile
                ],
                'dashboard' => [
                    'total_courses' => $totalCourses,
                    'total_students' => $totalStudents,
                    'total_revenue' => $totalRevenue,
                    'average_rating' => $averageRating
                ],
                'settings' => $settings,
                'courses' => $courseStatistics,
                'recent_students' => $recentStudents,
                'notifications' => $notifications
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(User $teacher)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $teacher)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $teacher)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $teacher)
    {
        //
    }
}
