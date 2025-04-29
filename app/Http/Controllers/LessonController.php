<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Section;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'order' => 'required|integer|min:0',
                'content_type' => 'required|string|in:video,document,quiz,pdf',
                'content_url' => 'required_if:content_type,video,pdf|string',
                'duration' => 'required|integer|min:0',
                'is_free' => 'boolean',
                'is_published' => 'boolean'
            ]);

            $lesson = $section->lessons()->create($validated);

            // Gérer l'upload du fichier si présent
            if ($request->hasFile('content_url')) {
                $file = $request->file('content_url');
                $extension = $file->getClientOriginalExtension();
                $filename = 'lesson_' . time() . '_' . Str::random(10) . '.' . $extension;

                // Déterminer le dossier en fonction du type de contenu
                if ($validated['content_type'] === 'video') {
                    $folder = 'lessons/videos';
                    // Vérifier que l'extension est bien une extension vidéo
                    if (!in_array(strtolower($extension), ['mp4', 'mov', 'avi', 'webm'])) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Le fichier doit être une vidéo (mp4, mov, avi, webm)'
                        ], 400);
                    }
                } else {
                    $folder = 'lessons/documents';
                }

                $path = $file->storeAs($folder, $filename, 'public');
                $lesson->content_url = Storage::url($path);
                $lesson->save();
            }

            return response()->json([
                'success' => true,
                'message' => 'Leçon créée avec succès',
                'data' => $lesson
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de la leçon',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function edit(Lesson $lesson)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Course $course, Section $section, Lesson $lesson)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'order' => 'required|integer|min:0',
                'content_type' => 'required|string|in:video,document,quiz,pdf',
                'content_url' => 'required_if:content_type,video,pdf|string',
                'duration' => 'required|integer|min:0',
                'is_free' => 'boolean',
                'is_published' => 'boolean'
            ]);

            // Gérer l'upload du fichier si présent
            if ($request->hasFile('content_url')) {
                $file = $request->file('content_url');
                $extension = $file->getClientOriginalExtension();
                $filename = 'lesson_' . time() . '_' . Str::random(10) . '.' . $extension;

                // Déterminer le dossier en fonction du type de contenu
                if ($validated['content_type'] === 'video') {
                    $folder = 'lessons/videos';
                    // Vérifier que l'extension est bien une extension vidéo
                    if (!in_array(strtolower($extension), ['mp4', 'mov', 'avi', 'webm'])) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Le fichier doit être une vidéo (mp4, mov, avi, webm)'
                        ], 400);
                    }
                } else {
                    $folder = 'lessons/documents';
                }

                $path = $file->storeAs($folder, $filename, 'public');
                $validated['content_url'] = Storage::url($path);
            }

            $lesson->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Leçon mise à jour avec succès',
                'data' => $lesson
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour de la leçon',
                'error' => $e->getMessage()
            ], 500);
        }
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
