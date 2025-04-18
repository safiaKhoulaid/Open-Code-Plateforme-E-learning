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
                'category_id' => 'required|numeric',
                'instructor_id'=>'required|numeric',

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
}
