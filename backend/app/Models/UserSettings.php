<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserSettings extends Model
{
    protected $fillable = [
        'user_id',
        'email_notifications',
        'mobile_notifications',
        'language',
        'timezone',
        'privacy_settings'
    ];

    protected $casts = [
        'email_notifications' => 'boolean',
        'mobile_notifications' => 'boolean',
        'privacy_settings' => 'array'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
