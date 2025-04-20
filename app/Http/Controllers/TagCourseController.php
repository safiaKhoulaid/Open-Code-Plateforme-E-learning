<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Tag;
use App\Models\TagCourse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TagCourseController extends Controller
{
    public function attachTagsToCourse($tagId, $courseId)
    {
        try {
            $course = Course::findOrFail($courseId);
            $tag = Tag::findOrFail($tagId);
            if($course && $tag) {


            $tagCourse = TagCourse::create([
                'tag_id' => $tagId,
                'course_id' => $courseId,
            ]);

            return response()->json([
                'message' => 'Tags attachés avec succès',

            ], 200);
        }
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors de l\'attachement des tags',
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
