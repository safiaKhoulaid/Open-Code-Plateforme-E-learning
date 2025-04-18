<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'subtitle',
        'description',
        'instructor_id',
        'level',
        'language',
        'image_url',
        'video_url',
        'price',
        'discount',
        'published_date',
        'last_updated',
        'status',
        'requirements',
        'what_you_will_learn',
        'target_audience',
        'average_rating',
        'total_reviews',
        'total_students',
        'has_certificate'
    ];

    protected $casts = [
        'requirements' => 'array',
        'what_you_will_learn' => 'array',
        'target_audience' => 'array',
        'published_date' => 'datetime',
        'last_updated' => 'datetime',
        'price' => 'decimal:2',
        'discount' => 'decimal:2',
        'average_rating' => 'decimal:2',
        'has_certificate' => 'boolean'
    ];
    

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function sections(): HasMany
    {
        return $this->hasMany(Section::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'course_category');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'course_tag');
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function ratings(): HasMany
    {
        return $this->hasMany(Rating::class);
    }

    public function analytics(): HasMany
    {
        return $this->hasMany(CourseAnalytics::class);
    }

    public function certificates(): HasMany
    {
        return $this->hasMany(Certificate::class);
    }
}
