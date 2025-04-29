<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Tag;
use App\Models\TagCourse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TagCourseController extends Controller
{
    public function attachTagsToCourse($courseId, $tagId)
    {
        try {
            // Vérifier si le cours existe
            $course = Course::find($courseId);
            if (!$course) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cours non trouvé'
                ], 404);
            }

            // Vérifier si le tag existe
            $tag = Tag::find($tagId);
            if (!$tag) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tag non trouvé'
                ], 404);
            }

            // Vérifier si la relation existe déjà
            if ($course->tags()->where('tag_id', $tagId)->exists()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Tag déjà attaché au cours',
                    'data' => $course->load('tags')
                ], 200);
            }

            // Attacher le tag au cours
            $course->tags()->attach($tagId);

            return response()->json([
                'success' => true,
                'message' => 'Tag attaché avec succès',
                'data' => $course->load('tags')
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'attachement du tag',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function detachTagsFromCourse(Request $request, $courseId)
    {
        try {
            DB::beginTransaction();

            $course = Course::findOrFail($courseId);

            $validated = $request->validate([
                'tags' => 'required|array',
                'tags.*' => 'exists:tags,id'
            ]);

            // Détacher les tags du cours
            $course->tags()->detach($validated['tags']);

            DB::commit();

            return response()->json([
                'message' => 'Tags détachés avec succès',
                'course' => $course->load('tags')
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors du détachement des tags',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function syncTagsForCourse(Request $request, $courseId)
    {
        try {
            DB::beginTransaction();

            $course = Course::findOrFail($courseId);

            $validated = $request->validate([
                'tags' => 'required|array',
                'tags.*' => 'exists:tags,id'
            ]);

            // Synchroniser les tags du cours (remplace tous les tags existants)
            $course->tags()->sync($validated['tags']);

            DB::commit();

            return response()->json([
                'message' => 'Tags synchronisés avec succès',
                'course' => $course->load('tags')
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors de la synchronisation des tags',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getCourseTags($courseId)
    {
        try {
            $course = Course::findOrFail($courseId);

            return response()->json([
                'tags' => $course->tags
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la récupération des tags',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
