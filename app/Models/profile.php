<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class profile extends Model
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

  public function user (){
    return $this->belongTo(User::class,'users');
}
}


