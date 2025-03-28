<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
        
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'profilPicture' => 'nullable|string|max:255',
            'biography' => 'nullable|string|max:1000',
            'linkdebLink' => 'nullable|url|max:255',
            'instagramLink' => 'nullable|url|max:255',
            'skills' => 'nullable|array',
            'skills.*' => 'string|max:100',
            'discordLink' => 'nullable|string|max:255',
        ];
    }
}
