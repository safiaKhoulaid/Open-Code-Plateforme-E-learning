<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Section;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class SectionController extends Controller
{


    public function store(Request $request, Course $course)
    {
        // $this->authorize('update', $course);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'order' => 'required|integer|min:0'
        ]);

        $section = $course->sections()->create($validated);

        // return back()->with('success', 'Section créée avec succès.');
    return response()->json([$section->id],200);
    }

    public function update(Request $request, Course $course, Section $section)
    {
        $this->authorize('update', $course);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'order' => 'required|integer|min:0',
            'is_published' => 'boolean'
        ]);

        $section->update($validated);

        return back()->with('success', 'Section mise à jour avec succès.');
    }

    public function destroy(Course $course, Section $section)
    {
        $this->authorize('update', $course);

        $section->delete();

        return back()->with('success', 'Section supprimée avec succès.');
    }

    public function reorder(Request $request, Course $course)
    {
        $this->authorize('update', $course);

        $validated = $request->validate([
            'sections' => 'required|array',
            'sections.*' => 'exists:sections,id'
        ]);

        foreach ($validated['sections'] as $index => $sectionId) {
            Section::where('id', $sectionId)->update(['order' => $index]);
        }

        return response()->json(['message' => 'Ordre des sections mis à jour avec succès.']);
    }

    public function togglePublish(Course $course, Section $section)
    {
        $this->authorize('update', $course);

        $section->update([
            'is_published' => !$section->is_published
        ]);

        return back()->with('success', $section->is_published ? 'Section publiée avec succès.' : 'Section dépubliée avec succès.');
    }
}
