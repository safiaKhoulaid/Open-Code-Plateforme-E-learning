<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Setting extends Model
{
    protected $fillable = [
        'user_id',
        'email_notifications',
        'mobile_notifications',
        'language',
        'timezone',
        'privacy_settings',
        'notification_types'
    ];

    protected $casts = [
        'email_notifications' => 'boolean',
        'mobile_notifications' => 'boolean',
        'privacy_settings' => 'array',
        'notification_types' => 'array'
    ];

    protected $attributes = [
        'email_notifications' => true,
        'mobile_notifications' => true,
        'language' => 'fr',
        'timezone' => 'Europe/Paris',
        'privacy_settings' => '{"profile_visibility":"public","course_progress":"public","show_email":false}'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
