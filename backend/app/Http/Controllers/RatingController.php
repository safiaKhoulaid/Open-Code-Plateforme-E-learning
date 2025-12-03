<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Course;
use App\Models\Rating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class RatingController extends Controller
{
    public function index()
    {
        $ratings = Rating::with(['user', 'course'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($ratings);
    }

    public function store(Request $request)
    {
    try{
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'stars' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000'
        ]);

      $validated['date'] = now();

        // Vérifier si l'utilisateur a déjà noté ce cours
        $existingRating = Rating::where('user_id', Auth::id())
            ->where('course_id', $validated['course_id'])
            ->first();

        if ($existingRating) {
            return response()->json([
                'message' => 'Vous avez déjà noté ce cours'
            ], 400);
        }

        $rating = Rating::create([
            'user_id' => Auth::id(),
            'course_id' => $validated['course_id'],
            'stars' => $validated['stars'],
            'comment' => $validated['comment'] ?? null,
            'date' => $validated['date']
        ]);

        // Mettre à jour la note moyenne du cours
        $this->updateCourseAverageRating($validated['course_id']);

        return response()->json($rating, 201);}
        catch (Exception $e) {
            return response()->json([
                'message' => 'Une erreur est survenue lors de la création du rating',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, Rating $rating)
    {
        $this->authorize('update', $rating);

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000'
        ]);

        $rating->update($validated);

        // Mettre à jour la note moyenne du cours
        $this->updateCourseAverageRating($rating->course_id);

        return response()->json($rating);
    }

    public function destroy(Rating $rating)
    {
        $this->authorize('delete', $rating);

        $courseId = $rating->course_id;
        $rating->delete();

        // Mettre à jour la note moyenne du cours
        $this->updateCourseAverageRating($courseId);

        return response()->json(null, 204);
    }

    public function getCourseRatings(Course $course)
    {
        $ratings = Rating::with('user')
            ->where('course_id', $course->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($ratings);
    }

    public function getUserRatings()
    {
        $ratings = Rating::with('course')
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($ratings);
    }

    private function updateCourseAverageRating($courseId)
    {
        $averageRating = Rating::where('course_id', $courseId)
            ->avg('stars');

        Course::where('id', $courseId)
            ->update(['average_rating' => $averageRating]);
    }
}
