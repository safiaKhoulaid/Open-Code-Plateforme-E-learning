<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;

class CourseCategoryController extends Controller
{
    use AuthorizesRequests, ValidatesRequests;

    /**
     * Afficher les catégories d'un cours
     */
    public function index(Course $course): JsonResponse
    {
        try {
            $categories = $course->categories()->with('parent')->get();
            return response()->json($categories);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la récupération des catégories',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Ajouter une catégorie à un cours
     */
    public function store(Request $request, Course $course): JsonResponse
    {
        $this->authorize('update', $course);

        try {
            $validated = $request->validate([
                'category_id' => 'required|exists:categories,id'
            ]);

            if ($course->categories()->where('category_id', $validated['category_id'])->exists()) {
                return response()->json([
                    'message' => 'Cette catégorie est déjà associée au cours'
                ], 400);
            }

            $course->categories()->attach($validated['category_id']);

            return response()->json([
                'message' => 'Catégorie ajoutée avec succès',
                'data' => $course->categories()->find($validated['category_id'])
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de l\'ajout de la catégorie',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mettre à jour les catégories d'un cours
     */
    public function update(Request $request, Course $course): JsonResponse
    {
        $this->authorize('update', $course);

        try {
            $validated = $request->validate([
                'categories' => 'required|array',
                'categories.*' => 'exists:categories,id'
            ]);

            $course->categories()->sync($validated['categories']);

            return response()->json([
                'message' => 'Catégories mises à jour avec succès',
                'data' => $course->categories()->get()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la mise à jour des catégories',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer une catégorie d'un cours
     */
    public function destroy(Course $course, Category $category): JsonResponse
    {
        $this->authorize('update', $course);

        try {
            if (!$course->categories()->where('category_id', $category->id)->exists()) {
                return response()->json([
                    'message' => 'Cette catégorie n\'est pas associée au cours'
                ], 404);
            }

            $course->categories()->detach($category->id);

            return response()->json([
                'message' => 'Catégorie supprimée avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la suppression de la catégorie',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir les cours d'une catégorie
     */
    public function getCourses(Category $category): JsonResponse
    {
        try {
            $courses = $category->courses()
                ->with(['instructor', 'ratings'])
                ->where('status', 'PUBLISHED')
                ->paginate(12);

            return response()->json($courses);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la récupération des cours',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir les sous-catégories d'une catégorie
     */
    public function getSubcategories(Category $category): JsonResponse
    {
        try {
            $subcategories = $category->children()
                ->where('is_active', true)
                ->orderBy('display_order')
                ->get();

            return response()->json($subcategories);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la récupération des sous-catégories',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir les statistiques des catégories d'un cours
     */
    public function getStats(Course $course): JsonResponse
    {
        $this->authorize('viewAnalytics', $course);

        try {
            $stats = $course->categories()
                ->select('categories.id', 'categories.title')
                ->selectRaw('COUNT(DISTINCT enrollments.user_id) as enrolled_students')
                ->selectRaw('AVG(ratings.stars) as average_rating')
                ->leftJoin('enrollments', 'courses.id', '=', 'enrollments.course_id')
                ->leftJoin('ratings', 'courses.id', '=', 'ratings.course_id')
                ->groupBy('categories.id', 'categories.title')
                ->get();

            return response()->json($stats);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la récupération des statistiques',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
