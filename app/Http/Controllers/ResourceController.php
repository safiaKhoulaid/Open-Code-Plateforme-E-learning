<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Section;
use App\Models\Lesson;
use App\Models\Resource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ResourceController extends Controller
{
    public function store(Request $request, Course $course, Section $section, Lesson $lesson)
    {
      

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|in:PDF,DOCUMENT,VIDEO,AUDIO,LINK',
            'file' => 'required_if:type,PDF,DOCUMENT,VIDEO,AUDIO|nullable|file|max:102400',
            'file_url' => 'required_if:type,LINK|nullable|url',
            'is_downloadable' => 'boolean'
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $validated['file_url'] = $file->store('resources', 'public');
            $validated['file_size'] = $file->getSize();
        }

        $resource = $lesson->resources()->create($validated);

        return back()->with('success', 'Ressource créée avec succès.');
    }

    public function update(Request $request, Course $course, Section $section, Lesson $lesson, Resource $resource)
    {
        $this->authorize('update', $course);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|in:PDF,DOCUMENT,VIDEO,AUDIO,LINK',
            'file' => 'nullable|file|max:102400',
            'file_url' => 'required_if:type,LINK|nullable|url',
            'is_downloadable' => 'boolean'
        ]);

        if ($request->hasFile('file')) {
            if ($resource->file_url) {
                Storage::disk('public')->delete($resource->file_url);
            }
            $file = $request->file('file');
            $validated['file_url'] = $file->store('resources', 'public');
            $validated['file_size'] = $file->getSize();
        }

        $resource->update($validated);

        return back()->with('success', 'Ressource mise à jour avec succès.');
    }

    public function destroy(Course $course, Section $section, Lesson $lesson, Resource $resource)
    {
        $this->authorize('update', $course);

        if ($resource->file_url) {
            Storage::disk('public')->delete($resource->file_url);
        }

        $resource->delete();

        return back()->with('success', 'Ressource supprimée avec succès.');
    }

    public function download(Course $course, Section $section, Lesson $lesson, Resource $resource)
    {
        $this->authorize('view', $course);

        if (!$resource->is_downloadable) {
            return back()->with('error', 'Cette ressource n\'est pas téléchargeable.');
        }

        return Storage::disk('public')->download($resource->file_url);
    }

    public function preview(Course $course, Section $section, Lesson $lesson, Resource $resource)
    {
        $this->authorize('view', $course);

        return view('resources.preview', compact('course', 'section', 'lesson', 'resource'));
    }
}
