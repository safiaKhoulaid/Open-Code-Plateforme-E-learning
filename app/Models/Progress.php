<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Progress extends Model
{
    protected $fillable = [
        'user_id',
        'course_id',
        'completed_lessons',
        'last_accessed',
        'completion_percentage',
        'quiz_results',
        'assignment_results',
        'certificate_issued',
        'total_time_spent'
    ];

    protected $casts = [
        'completed_lessons' => 'array',
        'last_accessed' => 'datetime',
        'completion_percentage' => 'decimal:2',
        'quiz_results' => 'array',
        'assignment_results' => 'array',
        'certificate_issued' => 'boolean',
        'total_time_spent' => 'integer'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
