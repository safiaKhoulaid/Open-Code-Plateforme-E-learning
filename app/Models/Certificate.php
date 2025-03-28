<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Certificate extends Model
{
    protected $fillable = [
        'user_id',
        'course_id',
        'issue_date',
        'expiry_date',
        'title',
        'instructor_name',
        'student_name',
        'course_title',
        'verification_url',
        'pdf_url'
    ];

    protected $casts = [
        'issue_date' => 'datetime',
        'expiry_date' => 'datetime'
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
