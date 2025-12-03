<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Enrollment extends Model
{
    use HasFactory;
    protected $fillable = [
        'student_id',
        'course_id',
        'status',
        'enrolled_at',
        'last_accessed_at',
        'completion_percentage'
    ];

    protected $casts = [
        'enrolled_at' => 'datetime',
        'last_accessed_at' => 'datetime',
        'completion_percentage' => 'float'
    ];

    /**
     * Obtenir l'étudiant associé à cette inscription
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    /**
     * Obtenir le cours associé à cette inscription
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Obtenir la progression associée à cette inscription
     */
    public function progress(): BelongsTo
    {
        return $this->belongsTo(Progress::class, 'course_id', 'course_id')
            ->where('user_id', $this->student_id);
    }

    public function enrolledCourses()
    {
        return $this->belongsToMany(Course::class, 'enrollments', 'student_id', 'course_id')
                    ->withPivot('enrollment_date', 'price', 'payment_id', 'status');
    }
}
