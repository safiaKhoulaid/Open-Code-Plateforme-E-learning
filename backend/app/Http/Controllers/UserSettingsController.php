<?php

namespace App\Http\Controllers;

use App\Models\UserSettings;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class UserSettingsController extends Controller
{
    use AuthorizesRequests;

    public function show()
    {
        $settings = auth()->user()->settings;
        if (!$settings) {
            $settings = auth()->user()->settings()->create([
                'email_notifications' => true,
                'mobile_notifications' => true,
                'language' => 'fr',
                'timezone' => 'Europe/Paris',
                'privacy_settings' => [
                    'profile_visibility' => 'public',
                    'course_progress' => 'public',
                    'show_email' => false
                ]
            ]);
        }

        return view('settings.show', compact('settings'));
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'email_notifications' => 'boolean',
            'mobile_notifications' => 'boolean',
            'language' => 'required|string|in:fr,en,es,de,it',
            'timezone' => 'required|string|timezone',
            'privacy_settings' => 'array',
            'privacy_settings.profile_visibility' => 'required|string|in:public,private,friends',
            'privacy_settings.course_progress' => 'required|string|in:public,private,friends',
            'privacy_settings.show_email' => 'boolean'
        ]);

        $settings = auth()->user()->settings;
        if (!$settings) {
            $settings = auth()->user()->settings()->create($validated);
        } else {
            $settings->update($validated);
        }

        return back()->with('success', 'Paramètres mis à jour avec succès.');
    }

    public function updateNotificationPreferences(Request $request)
    {
        $validated = $request->validate([
            'email_notifications' => 'boolean',
            'mobile_notifications' => 'boolean',
            'notification_types' => 'array',
            'notification_types.*' => 'boolean'
        ]);

        $settings = auth()->user()->settings;
        if (!$settings) {
            $settings = auth()->user()->settings()->create($validated);
        } else {
            $settings->update($validated);
        }

        return back()->with('success', 'Préférences de notification mises à jour avec succès.');
    }

    public function updatePrivacySettings(Request $request)
    {
        $validated = $request->validate([
            'privacy_settings' => 'array',
            'privacy_settings.profile_visibility' => 'required|string|in:public,private,friends',
            'privacy_settings.course_progress' => 'required|string|in:public,private,friends',
            'privacy_settings.show_email' => 'boolean'
        ]);

        $settings = auth()->user()->settings;
        if (!$settings) {
            $settings = auth()->user()->settings()->create($validated);
        } else {
            $settings->update($validated);
        }

        return back()->with('success', 'Paramètres de confidentialité mis à jour avec succès.');
    }

    public function updateLanguage(Request $request)
    {
        $validated = $request->validate([
            'language' => 'required|string|in:fr,en,es,de,it'
        ]);

        $settings = auth()->user()->settings;
        if (!$settings) {
            $settings = auth()->user()->settings()->create($validated);
        } else {
            $settings->update($validated);
        }

        return back()->with('success', 'Langue mise à jour avec succès.');
    }

    public function updateTimezone(Request $request)
    {
        $validated = $request->validate([
            'timezone' => 'required|string|timezone'
        ]);

        $settings = auth()->user()->settings;
        if (!$settings) {
            $settings = auth()->user()->settings()->create($validated);
        } else {
            $settings->update($validated);
        }

        return back()->with('success', 'Fuseau horaire mis à jour avec succès.');
    }

    public function resetToDefault()
    {
        $settings = auth()->user()->settings;
        if ($settings) {
            $settings->update([
                'email_notifications' => true,
                'mobile_notifications' => true,
                'language' => 'fr',
                'timezone' => 'Europe/Paris',
                'privacy_settings' => [
                    'profile_visibility' => 'public',
                    'course_progress' => 'public',
                    'show_email' => false
                ]
            ]);
        }

        return back()->with('success', 'Paramètres réinitialisés aux valeurs par défaut.');
    }
}
