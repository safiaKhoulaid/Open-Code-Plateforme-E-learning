<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use App\Models\Course;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function index()
    {
        $tags = Tag::withCount('courses')
            ->orderBy('popularity', 'desc')
            ->paginate(20);

        return view('tags.index', compact('tags'));
    }

    public function store(Request $request)
{
    try {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
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

        return redirect()->route('tags.index')
            ->with('success', 'Tag mis à jour avec succès.');
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
}

