<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Section;
use App\Models\Lesson;
use App\Models\Quiz;
use App\Models\Question;
use App\Models\QuizAttempt;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    public function store(Request $request, Course $course, Section $section, Lesson $lesson)
    {
        $this->authorize('update', $course);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'time_limit' => 'required|integer|min:0',
            'passing_score' => 'required|integer|min:0|max:100',
            'attempts' => 'required|integer|min:1',
            'is_randomized' => 'boolean',
            'show_answers' => 'boolean',
            'immediate_results' => 'boolean',
            'questions' => 'required|array',
            'questions.*.text' => 'required|string',
            'questions.*.type' => 'required|string|in:MULTIPLE_CHOICE,SINGLE_CHOICE,TRUE_FALSE',
            'questions.*.points' => 'required|integer|min:1',
            'questions.*.options' => 'required|array',
            'questions.*.correct_answers' => 'required|array',
            'questions.*.explanation' => 'nullable|string',
            'questions.*.is_required' => 'boolean'
        ]);

        $quiz = $lesson->quizzes()->create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'time_limit' => $validated['time_limit'],
            'passing_score' => $validated['passing_score'],
            'attempts' => $validated['attempts'],
            'is_randomized' => $validated['is_randomized'],
            'show_answers' => $validated['show_answers'],
            'immediate_results' => $validated['immediate_results']
        ]);

        foreach ($validated['questions'] as $questionData) {
            $quiz->questions()->create($questionData);
        }

        return back()->with('success', 'Quiz créé avec succès.');
    }

    public function update(Request $request, Course $course, Section $section, Lesson $lesson, Quiz $quiz)
    {
        $this->authorize('update', $course);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'time_limit' => 'required|integer|min:0',
            'passing_score' => 'required|integer|min:0|max:100',
            'attempts' => 'required|integer|min:1',
            'is_randomized' => 'boolean',
            'show_answers' => 'boolean',
            'immediate_results' => 'boolean',
            'questions' => 'required|array',
            'questions.*.id' => 'nullable|exists:questions,id',
            'questions.*.text' => 'required|string',
            'questions.*.type' => 'required|string|in:MULTIPLE_CHOICE,SINGLE_CHOICE,TRUE_FALSE',
            'questions.*.points' => 'required|integer|min:1',
            'questions.*.options' => 'required|array',
            'questions.*.correct_answers' => 'required|array',
            'questions.*.explanation' => 'nullable|string',
            'questions.*.is_required' => 'boolean'
        ]);

        $quiz->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'time_limit' => $validated['time_limit'],
            'passing_score' => $validated['passing_score'],
            'attempts' => $validated['attempts'],
            'is_randomized' => $validated['is_randomized'],
            'show_answers' => $validated['show_answers'],
            'immediate_results' => $validated['immediate_results']
        ]);

        // Mettre à jour les questions existantes et créer les nouvelles
        $existingQuestionIds = collect($validated['questions'])->pluck('id')->filter();
        $quiz->questions()->whereNotIn('id', $existingQuestionIds)->delete();

        foreach ($validated['questions'] as $questionData) {
            if (isset($questionData['id'])) {
                $quiz->questions()->where('id', $questionData['id'])->update($questionData);
            } else {
                $quiz->questions()->create($questionData);
            }
        }

        return back()->with('success', 'Quiz mis à jour avec succès.');
    }

    public function destroy(Course $course, Section $section, Lesson $lesson, Quiz $quiz)
    {
        $this->authorize('update', $course);

        $quiz->delete();

        return back()->with('success', 'Quiz supprimé avec succès.');
    }

    public function take(Course $course, Section $section, Lesson $lesson, Quiz $quiz)
    {
        $this->authorize('view', $course);

        $user = auth()->user();
        $attempts = $user->quizAttempts()->where('quiz_id', $quiz->id)->count();

        if ($attempts >= $quiz->attempts) {
            return back()->with('error', 'Vous avez atteint le nombre maximum de tentatives pour ce quiz.');
        }

        $questions = $quiz->is_randomized ? $quiz->questions()->inRandomOrder()->get() : $quiz->questions;

        return view('quizzes.take', compact('course', 'section', 'lesson', 'quiz', 'questions'));
    }

    public function submit(Request $request, Course $course, Section $section, Lesson $lesson, Quiz $quiz)
    {
        $this->authorize('view', $course);

        $validated = $request->validate([
            'answers' => 'required|array',
            'answers.*' => 'required|array'
        ]);

        $user = auth()->user();
        $questions = $quiz->questions;
        $score = 0;
        $totalPoints = $questions->sum('points');

        foreach ($questions as $question) {
            if (isset($validated['answers'][$question->id])) {
                $userAnswer = $validated['answers'][$question->id];
                $correctAnswer = $question->correct_answers;

                if ($question->type === 'TRUE_FALSE') {
                    if ($userAnswer === $correctAnswer) {
                        $score += $question->points;
                    }
                } else {
                    if (count(array_intersect($userAnswer, $correctAnswer)) === count($correctAnswer)) {
                        $score += $question->points;
                    }
                }
            }
        }

        $percentage = ($score / $totalPoints) * 100;
        $passed = $percentage >= $quiz->passing_score;

        $attempt = $user->quizAttempts()->create([
            'quiz_id' => $quiz->id,
            'start_time' => now(),
            'end_time' => now(),
            'answers' => $validated['answers'],
            'status' => $passed ? 'PASSED' : 'FAILED',
            'score' => $score,
            'time_spent' => 0 // À implémenter si nécessaire
        ]);

        if ($quiz->immediate_results) {
            return redirect()->route('quizzes.results', [$course, $section, $lesson, $quiz, $attempt])
                ->with('success', $passed ? 'Félicitations ! Vous avez réussi le quiz.' : 'Dommage, vous n\'avez pas réussi le quiz.');
        }

        return redirect()->route('lessons.watch', [$course, $section, $lesson])
            ->with('success', 'Vos réponses ont été enregistrées.');
    }

    public function results(Course $course, Section $section, Lesson $lesson, Quiz $quiz, QuizAttempt $attempt)
    {
        $this->authorize('view', $course);

        $questions = $quiz->questions;
        $answers = $attempt->answers;

        return view('quizzes.results', compact('course', 'section', 'lesson', 'quiz', 'attempt', 'questions', 'answers'));
    }
}
