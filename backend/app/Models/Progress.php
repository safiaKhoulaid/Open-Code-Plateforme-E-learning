<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Progress extends Model
{
    use HasFactory;

    protected $table = 'progress';

    protected $fillable = [
        'user_id',
        'course_id',
        'completed_lessons',
        'current_lesson_id',
        'progress_percentage',
        'last_activity_at'
    ];

    protected $casts = [
        'completed_lessons' => 'array',
        'progress_percentage' => 'float',
        'last_activity_at' => 'datetime'
    ];

    /**
     * Obtenir l'utilisateur associé à cette progression
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Obtenir le cours associé à cette progression
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Obtenir la leçon actuelle
     */
    public function currentLesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class, 'current_lesson_id');
    }

    /**
     * Mettre à jour le pourcentage de progression
     */
    public function updateProgressPercentage()
    {
        $totalLessons = $this->course->sections->sum(function($section) {
            return $section->lessons->count();
        });

        if ($totalLessons > 0) {
            $this->progress_percentage = (count($this->completed_lessons) / $totalLessons) * 100;
            $this->save();
        }
    }
}
