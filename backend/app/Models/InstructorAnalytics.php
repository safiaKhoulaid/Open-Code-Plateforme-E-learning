<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InstructorAnalytics extends Model
{
    protected $fillable = [
        'instructor_id',
        'total_students',
        'total_courses',
        'total_revenue',
        'revenue_by_month',
        'revenue_by_content',
        'student_engagement',
        'ratings_summary'
    ];

    protected $casts = [
        'total_students' => 'integer',
        'total_courses' => 'integer',
        'total_revenue' => 'decimal:2',
        'revenue_by_month' => 'array',
        'revenue_by_content' => 'array',
        'student_engagement' => 'array',
        'ratings_summary' => 'array'
    ];

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }
}
