<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Models\Section;

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
                'category_id' => 'required|numeric',
                'instructor_id' => 'required|numeric',
                'content_url' => 'nullable|string',  // Changed to just string
                // 'tags' => 'nullable|array',
                // 'tags.*' => 'exists:tags,id',
                'image' => 'nullable|image|max:2048',
                'video' => 'nullable|mimes:mp4,mov,ogg|max:102400',
                'requirements' => 'nullable|array',
                'what_you_will_learn' => 'nullable|array',
                'target_audience' => 'nullable|array',
                'has_certificate' => 'boolean'
            ]);

            // Vérifier si les catégories existent et sont actives
            $category = Category::find($validated['category_id']);
            if (!$category || !$category->is_active) {
                return response()->json(['message' => 'La catégorie spécifiée n\'existe pas ou n\'est pas active'], 404);
            }

            $validated['slug'] = Str::slug($validated['title']);

            $course = new Course($validated);
            $course->status = 'DRAFT';

            if ($request->hasFile('image')) {
                $course->image_url = $request->file('image')->store('courses/images', 'public');
            }

            if ($request->hasFile('video')) {
                $course->video_url = $request->file('video')->store('courses/videos', 'public');
            }

            // Accept content_url as a string path instead of file upload
            if ($request->has('content_url')) {
                $course->content_url = $request->input('content_url');
            }

            $course->save();

            // Attacher les catégories et les tags

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
        // Récupérer les cours avec toutes leurs relations
        $courses = Course::with([
            'categories',
            'tags',
            'instructor',
            'sections' => function ($query) {
                $query->orderBy('order')
                      ->with(['lessons' => function ($query) {
                          $query->orderBy('order');
                      }]);
            }
        ])
        ->orderBy('created_at', 'desc')
        ->paginate(12);

        // Récupérer les catégories et tags (pour filtres)
        $categories = Category::where('is_active', true)
            ->orderBy('display_order')
            ->get();

        $tags = Tag::orderBy('popularity', 'desc')
            ->take(10)
            ->get();

        return response()->json([
            'courses' => $courses, // Retourne toute la pagination avec relations
            'categories' => $categories,
            'tags' => $tags,
            'message' => 'Données récupérées avec succès'
        ]);
    }

    public function show($id): JsonResponse
    {
        try {
            $course = Course::with([
                'categories',
                'tags',
                'instructor',
                'sections' => function ($query) {
                    $query->orderBy('order')
                          ->with(['lessons' => function ($query) {
                              $query->orderBy('order');
                          }]);
                }
            ])->findOrFail($id);

            return response()->json([
                'data' => $course,
                'message' => 'Course retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Course not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $course = Course::findOrFail($id);
            $course->delete();

            return response()->json([
                'message' => 'Course deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Course not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function storeLesson(Request $request, Course $course, Section $section)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content_type' => 'required|string',
            'duration' => 'required|integer|min:0',
            'order' => 'required|integer|min:0',
            'content_url' => 'nullable|file|mimes:pdf,mp4,mov,ogg|max:102400'
        ]);

        $lesson = $section->lessons()->create($validated);

        if ($request->hasFile('content_url')) {
            $lesson->content_url = $request->file('content_url')->store('lessons/content', 'public');
            $lesson->save();
        }

        return response()->json($lesson, 201);
    }
}
