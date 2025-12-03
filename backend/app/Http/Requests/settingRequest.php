<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class settingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true ;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email_notifications' => 'required|boolean',
            'mobile_notifications' => 'required|boolean',
            'language' => 'required|string|max:255',
            'timezone' => 'required|string|max:255',
            'privacy_settings' => 'required|array',
            'privacy_settings.profile_visibility' => 'required|string|in:public,private',
            'privacy_settings.course_progress' => 'required|string|in:public,private',
            'privacy_settings.show_email' => 'required|boolean',
            'notification_types' => 'required|array',
            'notification_types.*' => 'required|string|in:email,sms,push',
            'notification_types.email' => 'required|boolean',
            'notification_types.sms' => 'required|boolean',
            'notification_types.push' => 'required|boolean',    
        ];
    }
}
