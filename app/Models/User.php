<?php

namespace App\Models;

use App\Models\Course;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Symfony\Component\HttpKernel\Profiler\Profile;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable  implements MustVerifyEmail
{

    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'firstName',
        'lastName',
        'email',
        'password',
        'lastLogin',
        'isActive',
        'settings',
        'role',
        'remember_token',
        'is_approved'
    ];

    protected $casts = [
        'lastLogin' => 'datetime',
        'isActive' => 'boolean',
        'settings' => 'array',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];


    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function profile(): HasOne
    {
        return $this->hasOne(Profile::class);
    }

    public function settings(): HasOne
    {
        return $this->hasOne(UserSettings::class);
    }

    public function enrolledCourses()
    {
        return $this->belongsToMany(Course::class, 'course_enrollments', 'user_id', 'course_id')
            ->withTimestamps();
    }

    public function teachingCourses(): HasMany
    {
        return $this->hasMany(Course::class, 'instructor_id');
    }

    public function progress(): HasMany
    {
        return $this->hasMany(Progress::class);
    }

    public function certificates()
    {
        return $this->hasMany(Certificate::class);
    }

    public function ratings(): HasMany
    {
        return $this->hasMany(Rating::class);
    }

    public function responses(): HasMany
    {
        return $this->hasMany(Response::class);
    }

    public function shoppingCart(): HasOne
    {
        return $this->hasOne(ShoppingCart::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function instructorAnalytics(): HasOne
    {
        return $this->hasOne(InstructorAnalytics::class, 'instructor_id');
    }

    public function quizAttempts(): HasMany
    {
        return $this->hasMany(QuizAttempt::class, 'student_id');
    }
}
