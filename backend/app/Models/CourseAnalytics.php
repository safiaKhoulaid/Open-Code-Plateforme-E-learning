<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseAnalytics extends Model
{
    protected $fillable = [
        'course_id',
        'enrollments',
        'completion_rate',
        'average_rating',
        'revenue',
        'views_by_section',
        'dropoff_points',
        'student_demographics'
    ];

    protected $casts = [
        'enrollments' => 'array',
        'completion_rate' => 'decimal:2',
        'average_rating' => 'decimal:2',
        'revenue' => 'array',
        'views_by_section' => 'array',
        'dropoff_points' => 'array',
        'student_demographics' => 'array'
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
