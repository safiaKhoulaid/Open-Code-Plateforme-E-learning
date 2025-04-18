<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    /**
     * Show the form for creating a new resource.
     */


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'email_notifications' => 'nullable|boolean|default:true',
            'mobile_notifications' => 'nullable|boolean|default:true',
            'language' => 'nullable|string|max:255|default:en',
            'timezone' => 'nullable|string|max:255|default:UTC',
            'privacy_settings' => 'nullable|array',

        ]);
        dd($validated);

        $setting = Setting::create($validated);

        return response()->json([
            'message' => 'Setting created successfully',
            'data' => $setting
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Setting $setting)
    {
        return response()->json([
            'data' => $setting
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Setting $setting)
    {
        return response()->json([
            'data' => $setting
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Setting $setting)
    {
        $validated = $request->validate([
            'key' => 'required|string|max:255|unique:settings,key,' . $setting->id,
            'value' => 'required|string',
            'type' => 'required|string|in:GENERAL,PAYMENT,EMAIL,SOCIAL,SYSTEM',
            'description' => 'nullable|string'
        ]);

        $setting->update($validated);

        return response()->json([
            'message' => 'Setting updated successfully',
            'data' => $setting
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Setting $setting)
    {
        $setting->delete();

        return response()->json([
            'message' => 'Setting deleted successfully'
        ]);
    }

    /**
     * Get settings by type
     */
    public function getByType($type)
    {
        $settings = Setting::where('type', $type)->get();

        return response()->json([
            'data' => $settings
        ]);
    }

    /**
     * Get setting by key
     */
    public function getByKey($key)
    {
        $setting = Setting::where('key', $key)->firstOrFail();

        return response()->json([
            'data' => $setting
        ]);
    }

    /**
     * Bulk update settings
     */
    public function bulkUpdate(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.id' => 'required|exists:settings,id',
            'settings.*.value' => 'required|string'
        ]);

        foreach ($validated['settings'] as $settingData) {
            Setting::where('id', $settingData['id'])
                  ->update(['value' => $settingData['value']]);
        }

        return response()->json([
            'message' => 'Settings updated successfully'
        ]);
    }

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Setting $setting)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Setting $setting)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Setting $setting)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Setting $setting)
    {
        //
    }
}
