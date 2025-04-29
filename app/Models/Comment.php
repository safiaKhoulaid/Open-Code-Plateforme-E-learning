<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'user_id',
        'parent_id',
        'content',
        'is_approved',
        'likes',
        'dislikes'
    ];

    protected $casts = [
        'is_approved' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Relation avec le cours
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    // Relation avec l'utilisateur qui a créé le commentaire
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Relation avec le commentaire parent (pour les réponses)
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    // Relation avec les commentaires enfants (réponses)
    public function replies(): HasMany
    {
        return $this->hasMany(Comment::class, 'parent_id');
    }
} 