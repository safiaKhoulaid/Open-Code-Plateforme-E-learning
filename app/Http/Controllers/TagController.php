<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use App\Models\Course;
use Illuminate\Http\Request;

class TagController extends Controller
{
    /**
     * Constructeur avec middleware d'authentification
     */
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index()
    {
        $tags = Tag::withCount('courses')
            ->orderBy('popularity', 'desc')
            ->paginate(20);

        return response()->json($tags);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'string|nullable',
            ]);

            // Vérifie si un tag avec ce nom existe déjà
            $existingTag = Tag::where('name', $validated['name'])->first();

            if ($existingTag) {
                return response()->json([
                    'tag' => $existingTag,
                    'message' => 'Tag déjà existant.'
                ], 200);
            }

            // Sinon, on le crée
            $tag = Tag::create($validated);

            return response()->json([
                'tag' => $tag,
                'message' => 'Tag créé avec succès.'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Tag $tag)
    {
        $courses = $tag->courses()
            ->with(['instructor', 'ratings'])
            ->where('status', 'PUBLISHED')
            ->paginate(12);

        return view('tags.show', compact('tag', 'courses'));
    }

    public function update(Request $request, Tag $tag)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:tags,name,' . $tag->id
        ]);

        $tag->update($validated);

        return response()->json(['message' => 'Tag mis à jour avec succès.']);
    }

    public function destroy(Tag $tag)
    {
        $tag->delete();

        return redirect()->route('tags.index')
            ->with('success', 'Tag supprimé avec succès.');
    }

    public function search(Request $request)
    {
        $query = $request->input('query');

        $tags = Tag::where('name', 'like', "%{$query}%")
            ->withCount('courses')
            ->orderBy('popularity', 'desc')
            ->take(10)
            ->get();

        return response()->json($tags);
    }

    public function getPopularTags()
    {
        $tags = Tag::withCount('courses')
            ->orderBy('popularity', 'desc')
            ->take(10)
            ->get();

        return response()->json($tags);
    }

    public function getRelatedTags(Tag $tag)
    {
        $relatedTags = Tag::whereHas('courses', function ($query) use ($tag) {
            $query->whereIn('id', $tag->courses->pluck('id'));
        })
        ->where('id', '!=', $tag->id)
        ->withCount('courses')
        ->orderBy('popularity', 'desc')
        ->take(5)
        ->get();

        return response()->json($relatedTags);
    }

    public function updatePopularity(Tag $tag)
    {
        $courseCount = $tag->courses()->count();
        $tag->update([
            'course_count' => $courseCount,
            'popularity' => $courseCount
        ]);

        return response()->json(['message' => 'Popularité du tag mise à jour avec succès.']);
    }

    public function bulkUpdate(Request $request)
    {
        $validated = $request->validate([
            'tags' => 'required|array',
            'tags.*.id' => 'required|exists:tags,id',
            'tags.*.name' => 'required|string|max:255'
        ]);

        foreach ($validated['tags'] as $tagData) {
            Tag::where('id', $tagData['id'])->update([
                'name' => $tagData['name']
            ]);
        }

        return response()->json(['message' => 'Tags mis à jour avec succès.']);
    }

    public function merge(Request $request, Tag $tag)
    {
        $validated = $request->validate([
            'target_tag_id' => 'required|exists:tags,id'
        ]);

        $targetTag = Tag::findOrFail($validated['target_tag_id']);

        // Déplacer tous les cours vers le tag cible
        $tag->courses()->updateExistingPivot($targetTag->id, [
            'course_id' => $targetTag->id
        ]);

        // Supprimer le tag source
        $tag->delete();

        // Mettre à jour la popularité du tag cible
        $this->updatePopularity($targetTag);

        return redirect()->route('tags.index')
            ->with('success', 'Tags fusionnés avec succès.');
    }

    /**
     * Récupérer les tags d'un cours
     */
    public function getCourseTags(Course $course)
    {
        try {
            $tags = $course->tags()->get();

            return response()->json([
                'status' => 'success',
                'data' => $tags
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la récupération des tags',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Attacher des tags à un cours
     */
    public function attachTags(Request $request, Course $course)
    {
        try {
            $validated = $request->validate([
                'tags' => 'required|array',
                'tags.*' => 'exists:tags,id'
            ]);

            $course->tags()->attach($validated['tags']);

            // Mettre à jour la popularité des tags
            foreach ($validated['tags'] as $tagId) {
                $tag = Tag::find($tagId);
                $this->updatePopularity($tag);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Tags attachés avec succès',
                'data' => $course->tags()->get()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de l\'attachement des tags',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Détacher un tag d'un cours
     */
    public function detach(Course $course, Tag $tag)
    {
        try {
            $course->tags()->detach($tag->id);

            // Mettre à jour la popularité du tag
            $this->updatePopularity($tag);

            return response()->json([
                'status' => 'success',
                'message' => 'Tag détaché avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors du détachement du tag',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Synchroniser les tags d'un cours
     */
    public function syncTags(Request $request, Course $course)
    {
        try {
            $validated = $request->validate([
                'tags' => 'required|array',
                'tags.*' => 'required|integer|exists:tags,id'
            ]);

            $course->tags()->sync($validated['tags']);

            // Mettre à jour la popularité de tous les tags
            Tag::whereIn('id', $validated['tags'])->get()->each(function ($tag) {
                $this->updatePopularity($tag);
            });

            return response()->json([
                'status' => 'success',
                'message' => 'Tags synchronisés avec succès',
                'data' => $course->tags()->get()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la synchronisation des tags',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

