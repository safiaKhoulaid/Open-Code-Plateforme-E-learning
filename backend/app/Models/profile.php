<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Profile extends Model
{
  protected $fillable = [
    'firstName',
    'lastName',
    'profilePicture',
    'biography',
    'linkdebLink',
    'instagramLink',
    'discordLink',
    'skills',
    'user_id',
  ];

  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }
}


