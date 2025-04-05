<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\JsonResponse;



class CourseController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'subtitle' => 'nullable|string|max:255',
                'description' => 'required|string',
                'level' => 'required|string',
                'language' => 'required|string',
                'price' => 'required|numeric|min:0',
                'discount' => 'nullable|numeric|min:0',
                'categories' => 'required|array',
                'categories.*' => 'exists:categories,id',
                'tags' => 'nullable|array',
                'tags.*' => 'exists:tags,id',
                'image' => 'nullable|image|max:2048',
                'video' => 'nullable|mimes:mp4,mov,ogg|max:102400',
                'requirements' => 'nullable|array',
                'what_you_will_learn' => 'nullable|array',
                'target_audience' => 'nullable|array',
                'has_certificate' => 'boolean'
            ]);
            // Vérifier si les catégories existent et sont actives
            $categories = Category::whereIn('id', $validated['categories'])
            ->where('is_active', true)
            ->get();


            if ($categories->count() !== count($validated['categories'])) {
                return response()->json([
                    'message' => 'Certaines catégories n\'existent pas ou ne sont pas actives'
                ], 400);
            }

            $course = new Course($validated);
            $course->instructor_id = Auth::id();
            $course->slug = Str::slug($validated['title']);
            $course->status = 'DRAFT';

            if ($request->hasFile('image')) {
                $course->image_url = $request->file('image')->store('courses/images', 'public');
            }

            if ($request->hasFile('video')) {
                $course->video_url = $request->file('video')->store('courses/videos', 'public');
            }

            $course->save();

            // Attacher les catégories et les tags
            $course->categories()->attach($validated['categories']);
            if (isset($validated['tags'])) {
                $course->tags()->attach($validated['tags']);
            }

            return response()->json([
                'message' => 'Cours créé avec succès',
                'data' => $course->load(['categories', 'tags'])
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la création du cours',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function index(): JsonResponse
    {
        $courses = Course::with(['categories', 'tags', 'instructor'])
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        $categories = Category::where('is_active', true)
            ->orderBy('display_order')
            ->get();

        $tags = Tag::orderBy('popularity', 'desc')
            ->take(10)
            ->get();

        return response()->json([
            'data' => [
                'courses' => $courses,
                'categories' => $categories,
                'tags' => $tags
            ],
            'message' => 'Données récupérées avec succès'
        ]);
    }
}
