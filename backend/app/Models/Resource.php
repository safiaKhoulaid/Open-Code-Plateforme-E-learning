<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Resource extends Model
{
    use HasFactory;
    protected $fillable = [
        'lesson_id',
        'title',
        'type',
        'file_url',
        'file_size',
        'is_downloadable'
    ];

    protected $casts = [
        'file_size' => 'decimal:2',
        'is_downloadable' => 'boolean'
    ];

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }
}
