<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileRequest;
use App\Models\profile;
use Exception;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Profiler\Profile as ProfilerProfile;

class ProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {}

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProfileRequest $request, $user_id)
    {
        try {
            $validated = $request->validated();

            if ($request->hasFile('profilPicture')) {
                $path = $request->file('profilPicture')->store('profiles', 'public');
                $validated['profilPicture'] = $path;
            }

            $validated['user_id'] = $user_id;

            $profile = Profile::create($validated);

            return response()->json($profile, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($user_id)
    {
        try {
            $profile = Profile::where('user_id', $user_id)->first();
            return response()->json($profile);
        } catch (Exception $e) {
            return response()->json('error' . $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request) {}

    /**
     * Update the specified resource in storage.
     */
    public function update(ProfileRequest $request, $user_id)
    {
        try {
            $validated = $request->validated();

            if ($request->hasFile('profilPicture')) {
                $path = $request->file('profilPicture')->store('profiles', 'public');
                $validated['profilPicture'] = $path;
            }

            $profile = Profile::where('user_id', $user_id)->first();

            if (!$profile) {
                // Créer un nouveau profil si aucun n'existe
                $validated['user_id'] = $user_id;
                $profile = Profile::create($validated);
            } else {
                // Mettre à jour le profil existant
                $profile->update($validated);
            }

            return response()->json($profile, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($user_id)
    {
        try {
            $profile = Profile::where('user_id', $user_id)->first();
            $profile->delete();
            return response()->json(['message' => 'le profile supprimmer ', 200]);
        } catch (Exception $e) {
            return response()->json($e->getMessage());
        }
    }
}
