<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::with(['instructor', 'categories', 'tags'])
            ->where('status', 'PUBLISHED')
            ->paginate(12);

        return view('courses.index', compact('courses'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::where('is_active', true)->get();
        $tags = Tag::all();
        return view('courses.create', compact('categories', 'tags'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'required|string',
            'level' => 'required|string',
            'language' => 'required|string',
            'price' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'categories' => 'required|array',
            'categories.*' => 'exists:categories,id',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
            'image' => 'required|image|max:2048',
            'video' => 'nullable|mimes:mp4,mov,ogg|max:102400',
            'requirements' => 'nullable|array',
            'what_you_will_learn' => 'nullable|array',
            'target_audience' => 'nullable|array',
            'has_certificate' => 'boolean'
        ]);

        $course = new Course($validated);
        $course->instructor_id = auth()->id();
        $course->slug = Str::slug($validated['title']);
        $course->status = 'DRAFT';

        if ($request->hasFile('image')) {
            $course->image_url = $request->file('image')->store('courses/images', 'public');
        }

        if ($request->hasFile('video')) {
            $course->video_url = $request->file('video')->store('courses/videos', 'public');
        }

        $course->save();

        $course->categories()->attach($request->categories);
        if ($request->has('tags')) {
            $course->tags()->attach($request->tags);
        }

        return redirect()->route('courses.edit', $course)
            ->with('success', 'Cours créé avec succès.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Course $course)
    {
        $course->load(['instructor', 'sections.lessons', 'categories', 'tags', 'ratings']);
        return view('courses.show', compact('course'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Course $course)
    {
        $this->authorize('update', $course);

        $categories = Category::where('is_active', true)->get();
        $tags = Tag::all();
        $course->load(['categories', 'tags']);

        return view('courses.edit', compact('course', 'categories', 'tags'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Course $course)
    {
        $this->authorize('update', $course);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'required|string',
            'level' => 'required|string',
            'language' => 'required|string',
            'price' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'categories' => 'required|array',
            'categories.*' => 'exists:categories,id',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
            'image' => 'nullable|image|max:2048',
            'video' => 'nullable|mimes:mp4,mov,ogg|max:102400',
            'requirements' => 'nullable|array',
            'what_you_will_learn' => 'nullable|array',
            'target_audience' => 'nullable|array',
            'has_certificate' => 'boolean'
        ]);

        if ($request->hasFile('image')) {
            if ($course->image_url) {
                Storage::disk('public')->delete($course->image_url);
            }
            $validated['image_url'] = $request->file('image')->store('courses/images', 'public');
        }

        if ($request->hasFile('video')) {
            if ($course->video_url) {
                Storage::disk('public')->delete($course->video_url);
            }
            $validated['video_url'] = $request->file('video')->store('courses/videos', 'public');
        }

        $course->update($validated);

        $course->categories()->sync($request->categories);
        $course->tags()->sync($request->tags ?? []);

        return redirect()->route('courses.edit', $course)
            ->with('success', 'Cours mis à jour avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course)
    {
        $this->authorize('delete', $course);

        if ($course->image_url) {
            Storage::disk('public')->delete($course->image_url);
        }
        if ($course->video_url) {
            Storage::disk('public')->delete($course->video_url);
        }

        $course->delete();

        return redirect()->route('courses.index')
            ->with('success', 'Cours supprimé avec succès.');
    }

    public function publish(Course $course)
    {
        $this->authorize('update', $course);

        $course->update([
            'status' => 'PUBLISHED',
            'published_date' => now()
        ]);

        return redirect()->route('courses.edit', $course)
            ->with('success', 'Cours publié avec succès.');
    }

    public function unpublish(Course $course)
    {
        $this->authorize('update', $course);

        $course->update([
            'status' => 'UNPUBLISHED'
        ]);

        return redirect()->route('courses.edit', $course)
            ->with('success', 'Cours dépublié avec succès.');
    }

    public function enroll(Course $course)
    {
        $user = auth()->user();

        if ($user->enrolledCourses()->where('course_id', $course->id)->exists()) {
            return back()->with('error', 'Vous êtes déjà inscrit à ce cours.');
        }

        $enrollment = $user->enrolledCourses()->attach($course->id, [
            'enrollment_date' => now(),
            'price' => $course->price,
            'status' => 'ACTIVE'
        ]);

        return redirect()->route('courses.show', $course)
            ->with('success', 'Inscription réussie au cours.');
    }

    public function unenroll(Course $course)
    {
        $user = auth()->user();

        if (!$user->enrolledCourses()->where('course_id', $course->id)->exists()) {
            return back()->with('error', 'Vous n\'êtes pas inscrit à ce cours.');
        }

        $user->enrolledCourses()->detach($course->id);

        return redirect()->route('courses.index')
            ->with('success', 'Désinscription réussie du cours.');
    }

    public function rate(Request $request, Course $course)
    {
        $validated = $request->validate([
            'stars' => 'required|numeric|min:1|max:5',
            'comment' => 'required|string|min:10'
        ]);

        $rating = $course->ratings()->create([
            'user_id' => auth()->id(),
            'stars' => $validated['stars'],
            'comment' => $validated['comment'],
            'date' => now(),
            'is_verified_purchase' => true
        ]);

        // Mettre à jour la note moyenne du cours
        $course->update([
            'average_rating' => $course->ratings()->avg('stars'),
            'total_reviews' => $course->ratings()->count()
        ]);

        return back()->with('success', 'Évaluation ajoutée avec succès.');
    }

    public function analytics(Course $course)
    {
        $this->authorize('viewAnalytics', $course);

        $analytics = $course->analytics()->first();
        if (!$analytics) {
            $analytics = $course->analytics()->create([
                'enrollments' => [],
                'completion_rate' => 0,
                'average_rating' => 0,
                'revenue' => [],
                'views_by_section' => [],
                'dropoff_points' => [],
                'student_demographics' => []
            ]);
        }

        return view('courses.analytics', compact('course', 'analytics'));
    }
}
