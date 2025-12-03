<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Response extends Model
{
    protected $fillable = [
        'rating_id',
        'user_id',
        'text',
        'date',
        'is_instructor'
    ];

    protected $casts = [
        'date' => 'datetime',
        'is_instructor' => 'boolean'
    ];

    public function rating(): BelongsTo
    {
        return $this->belongsTo(Rating::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
