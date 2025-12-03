<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Rating extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'course_id',
        'stars',
        'comment',
        'date',
        'is_verified_purchase',
        'helpful_votes'
    ];

    protected $casts = [
        'stars' => 'decimal:2',
        'date' => 'datetime',
        'is_verified_purchase' => 'boolean',
        'helpful_votes' => 'integer'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function responses(): HasMany
    {
        return $this->hasMany(Response::class);
    }
}
