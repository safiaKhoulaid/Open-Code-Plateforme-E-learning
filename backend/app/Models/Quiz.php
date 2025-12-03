<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quiz extends Model
{
    protected $fillable = [
        'lesson_id',
        'title',
        'description',
        'time_limit',
        'passing_score',
        'attempts',
        'is_randomized',
        'show_answers',
        'immediate_results'
    ];

    protected $casts = [
        'time_limit' => 'integer',
        'passing_score' => 'integer',
        'attempts' => 'integer',
        'is_randomized' => 'boolean',
        'show_answers' => 'boolean',
        'immediate_results' => 'boolean'
    ];

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }

    public function attempts(): HasMany
    {
        return $this->hasMany(QuizAttempt::class);
    }
}
