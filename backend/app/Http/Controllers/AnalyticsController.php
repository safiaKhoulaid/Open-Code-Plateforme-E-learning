<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseAnalytics;
use App\Models\InstructorAnalytics;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function courseAnalytics(Course $course)
    {
        $this->authorize('viewAnalytics', $course);

        $analytics = $course->analytics()->first();
        if (!$analytics) {
            $analytics = $this->generateCourseAnalytics($course);
        }

        return view('analytics.course', compact('course', 'analytics'));
    }

    public function instructorAnalytics()
    {
        $this->authorize('viewInstructorAnalytics', auth()->user());

        $analytics = auth()->user()->instructorAnalytics()->first();
        if (!$analytics) {
            $analytics = $this->generateInstructorAnalytics(auth()->user());
        }

        return view('analytics.instructor', compact('analytics'));
    }

    private function generateCourseAnalytics(Course $course)
    {
        // Calculer les inscriptions par mois
        $enrollments = $course->enrollments()
            ->select(DB::raw('DATE_FORMAT(enrollment_date, "%Y-%m") as month'), DB::raw('count(*) as count'))
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->pluck('count', 'month')
            ->toArray();

        // Calculer le taux de complétion
        $totalStudents = $course->enrollments()->count();
        $completedStudents = $course->progress()
            ->where('completion_percentage', '>=', 100)
            ->count();
        $completionRate = $totalStudents > 0 ? ($completedStudents / $totalStudents) * 100 : 0;

        // Calculer les vues par section
        $viewsBySection = $course->sections()
            ->withCount('lessons')
            ->get()
            ->map(function ($section) {
                return [
                    'section_id' => $section->id,
                    'title' => $section->title,
                    'views' => $section->lessons->sum('views'),
                    'completion_rate' => $section->lessons->avg('completion_rate')
                ];
            })
            ->toArray();

        // Calculer les points d'abandon
        $dropoffPoints = $course->sections()
            ->with(['lessons' => function ($query) {
                $query->orderBy('order');
            }])
            ->get()
            ->map(function ($section) {
                return [
                    'section_id' => $section->id,
                    'title' => $section->title,
                    'dropoff_rate' => $this->calculateDropoffRate($section)
                ];
            })
            ->toArray();

        // Calculer les démographies des étudiants
        $studentDemographics = [
            'by_country' => $course->enrollments()
                ->join('users', 'enrollments.student_id', '=', 'users.id')
                ->select('users.country', DB::raw('count(*) as count'))
                ->groupBy('users.country')
                ->get()
                ->pluck('count', 'country')
                ->toArray(),
            'by_language' => $course->enrollments()
                ->join('users', 'enrollments.student_id', '=', 'users.id')
                ->select('users.language', DB::raw('count(*) as count'))
                ->groupBy('users.language')
                ->get()
                ->pluck('count', 'language')
                ->toArray()
        ];

        return $course->analytics()->create([
            'enrollments' => $enrollments,
            'completion_rate' => $completionRate,
            'average_rating' => $course->average_rating,
            'revenue' => [
                'total' => $course->enrollments()->sum('price'),
                'by_month' => $this->calculateRevenueByMonth($course)
            ],
            'views_by_section' => $viewsBySection,
            'dropoff_points' => $dropoffPoints,
            'student_demographics' => $studentDemographics
        ]);
    }

    private function generateInstructorAnalytics($instructor)
    {
        $courses = $instructor->teachingCourses()->with('enrollments')->get();

        $totalStudents = $courses->sum(function ($course) {
            return $course->enrollments->count();
        });

        $totalRevenue = $courses->sum(function ($course) {
            return $course->enrollments->sum('price');
        });

        $revenueByMonth = $this->calculateInstructorRevenueByMonth($instructor);
        $revenueByContent = $this->calculateInstructorRevenueByContent($instructor);
        $studentEngagement = $this->calculateStudentEngagement($instructor);
        $ratingsSummary = $this->calculateRatingsSummary($instructor);

        return $instructor->instructorAnalytics()->create([
            'total_students' => $totalStudents,
            'total_courses' => $courses->count(),
            'total_revenue' => $totalRevenue,
            'revenue_by_month' => $revenueByMonth,
            'revenue_by_content' => $revenueByContent,
            'student_engagement' => $studentEngagement,
            'ratings_summary' => $ratingsSummary
        ]);
    }

    private function calculateDropoffRate($section)
    {
        $totalStudents = $section->course->enrollments->count();
        if ($totalStudents === 0) return 0;

        $completedStudents = $section->lessons->sum(function ($lesson) {
            return $lesson->progress()->where('completion_percentage', 100)->count();
        });

        return (($totalStudents - $completedStudents) / $totalStudents) * 100;
    }

    private function calculateRevenueByMonth(Course $course)
    {
        return $course->enrollments()
            ->select(DB::raw('DATE_FORMAT(enrollment_date, "%Y-%m") as month'), DB::raw('sum(price) as revenue'))
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->pluck('revenue', 'month')
            ->toArray();
    }

    private function calculateInstructorRevenueByMonth($instructor)
    {
        return $instructor->teachingCourses()
            ->join('enrollments', 'courses.id', '=', 'enrollments.course_id')
            ->select(DB::raw('DATE_FORMAT(enrollments.enrollment_date, "%Y-%m") as month'), DB::raw('sum(enrollments.price) as revenue'))
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->pluck('revenue', 'month')
            ->toArray();
    }

    private function calculateInstructorRevenueByContent($instructor)
    {
        return $instructor->teachingCourses()
            ->select('courses.id', 'courses.title', DB::raw('sum(enrollments.price) as revenue'))
            ->join('enrollments', 'courses.id', '=', 'enrollments.course_id')
            ->groupBy('courses.id', 'courses.title')
            ->get()
            ->map(function ($course) {
                return [
                    'course_id' => $course->id,
                    'title' => $course->title,
                    'revenue' => $course->revenue
                ];
            })
            ->toArray();
    }

    private function calculateStudentEngagement($instructor)
    {
        $courses = $instructor->teachingCourses()->with(['enrollments', 'progress'])->get();

        return [
            'average_completion_rate' => $courses->avg(function ($course) {
                return $course->progress->avg('completion_percentage');
            }),
            'average_time_spent' => $courses->avg(function ($course) {
                return $course->progress->avg('total_time_spent');
            }),
            'engagement_by_course' => $courses->map(function ($course) {
                return [
                    'course_id' => $course->id,
                    'title' => $course->title,
                    'completion_rate' => $course->progress->avg('completion_percentage'),
                    'average_time_spent' => $course->progress->avg('total_time_spent')
                ];
            })->toArray()
        ];
    }

    private function calculateRatingsSummary($instructor)
    {
        $courses = $instructor->teachingCourses()->with('ratings')->get();

        return [
            'average_rating' => $courses->avg(function ($course) {
                return $course->ratings->avg('stars');
            }),
            'total_reviews' => $courses->sum(function ($course) {
                return $course->ratings->count();
            }),
            'ratings_distribution' => [
                '5_stars' => $courses->sum(function ($course) {
                    return $course->ratings->where('stars', 5)->count();
                }),
                '4_stars' => $courses->sum(function ($course) {
                    return $course->ratings->where('stars', 4)->count();
                }),
                '3_stars' => $courses->sum(function ($course) {
                    return $course->ratings->where('stars', 3)->count();
                }),
                '2_stars' => $courses->sum(function ($course) {
                    return $course->ratings->where('stars', 2)->count();
                }),
                '1_star' => $courses->sum(function ($course) {
                    return $course->ratings->where('stars', 1)->count();
                })
            ]
        ];
    }
}
