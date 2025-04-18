<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Section;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LessonController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Course $course, Section $section)
    {


        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'order' => 'required|integer|min:0',
            'content_type' => 'required|string|in:video,document,quiz,pdf',
            'content_url' => 'required_if:content_type,video|nullable|file',
            'duration' => 'required|integer|min:0',
            'is_free' => 'boolean',
            'is_published' => 'boolean'
        ]);

        if ($request->hasFile('content_file')) {
            $validated['content_url'] = $request->file('content_file')->store('lessons/content', 'public');
        }

        $lesson = $section->lessons()->create($validated);

        return response()->json($lesson, 200, ['Access-Control-Allow-Origin' => '*']);
    }

    /**
     * Display the specified r
    public function show(Lesson $lesson)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Lesson $lesson)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Course $course, Section $section, Lesson $lesson)
    {
        $this->authorize('update', $course);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'order' => 'required|integer|min:0',
            'content_type' => 'required|string|in:VIDEO,DOCUMENT,QUIZ',
            'content_url' => 'required_if:content_type,VIDEO|nullable|url',
            'duration' => 'required|integer|min:0',
            'is_free' => 'boolean',
            'is_published' => 'boolean'
        ]);

        if ($request->hasFile('content_file')) {
            if ($lesson->content_url) {
                Storage::disk('public')->delete($lesson->content_url);
            }
            $validated['content_url'] = $request->file('content_file')->store('lessons/content', 'public');
        }

        $lesson->update($validated);

        return back()->with('success', 'Leçon mise à jour avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course, Section $section, Lesson $lesson)
    {
        $this->authorize('update', $course);

        if ($lesson->content_url) {
            Storage::disk('public')->delete($lesson->content_url);
        }

        $lesson->delete();

        return back()->with('success', 'Leçon supprimée avec succès.');
    }

    public function reorder(Request $request, Course $course, Section $section)
    {
        $this->authorize('update', $course);

        $validated = $request->validate([
            'lessons' => 'required|array',
            'lessons.*' => 'exists:lessons,id'
        ]);

        foreach ($validated['lessons'] as $index => $lessonId) {
            Lesson::where('id', $lessonId)->update(['order' => $index]);
        }

        return response()->json(['message' => 'Ordre des leçons mis à jour avec succès.']);
    }

    public function togglePublish(Course $course, Section $section, Lesson $lesson)
    {
        $this->authorize('update', $course);

        $lesson->update([
            'is_published' => !$lesson->is_published
        ]);

        return back()->with('success', $lesson->is_published ? 'Leçon publiée avec succès.' : 'Leçon dépubliée avec succès.');
    }

    public function toggleFree(Course $course, Section $section, Lesson $lesson)
    {
        $this->authorize('update', $course);

        $lesson->update([
            'is_free' => !$lesson->is_free
        ]);

        return back()->with('success', $lesson->is_free ? 'Leçon marquée comme gratuite.' : 'Leçon marquée comme payante.');
    }

    public function watch(Course $course, Section $section, Lesson $lesson)
    {
        $this->authorize('view', $course);

        $lesson->load(['resources', 'quizzes']);
        return view('lessons.watch', compact('course', 'section', 'lesson'));
    }

    public function complete(Course $course, Section $section, Lesson $lesson)
    {
        $this->authorize('view', $course);

        $progress = auth()->user()->progress()->where('course_id', $course->id)->first();
        if (!$progress) {
            $progress = auth()->user()->progress()->create([
                'course_id' => $course->id,
                'completed_lessons' => [],
                'completion_percentage' => 0
            ]);
        }

        $completedLessons = $progress->completed_lessons;
        if (!in_array($lesson->id, $completedLessons)) {
            $completedLessons[] = $lesson->id;
            $progress->update([
                'completed_lessons' => $completedLessons,
                'completion_percentage' => (count($completedLessons) / $course->lessons()->count()) * 100
            ]);
        }

        return response()->json(['message' => 'Leçon marquée comme complétée.']);
    }
}
