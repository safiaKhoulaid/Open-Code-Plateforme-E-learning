<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\User;
use App\Mail\WelcomeEmail;
use App\Notifications\UserBannedNotification;
use App\Notifications\CourseSuspendedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;


class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
    }

    /**
     * Mettre à jour le statut d'un cours
     */
    public function updateCourseStatus(Request $request, Course $course)
    {
        try {
            // Vérifier que l'utilisateur est un admin
            if (!Auth::user() || Auth::user()->role !== 'admin') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Non autorisé'
                ], 403);
            }

            // Valider la requête
            $validated = $request->validate([
                'status' => 'required|string|in:DRAFT,PUBLISHED,ARCHIVED,SUSPENDED'
            ]);

            // Mettre à jour le statut du cours
            $course->update([
                'status' => $validated['status']
            ]);

            // Si le cours est suspendu, notifier l'instructeur
            if ($validated['status'] === 'SUSPENDED') {
                // Vous pouvez ajouter ici la logique pour notifier l'instructeur
                $course->instructor->notify(new CourseSuspendedNotification($course));
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Statut du cours mis à jour avec succès',
                'data' => [
                    'course_id' => $course->id,
                    'title' => $course->title,
                    'status' => $course->status,
                    'updated_at' => $course->updated_at
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la mise à jour du statut du cours',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function approveTeacher(Request $request, $id)
    {
        try {
            // Vérifier que l'utilisateur est un administrateur
            if (!Auth::user() || Auth::user()->role !== 'admin') {
                return response()->json([
                    'message' => 'Unauthorized. Only administrators can approve teachers.'
                ], 403);
            }

            // Récupérer l'enseignant
            $teacher = User::findOrFail($id);

            // Vérifier que l'utilisateur est bien un enseignant
            if ($teacher->role !== 'teacher') {
                return response()->json([
                    'message' => 'User is not a teacher.'
                ], 400);
            }

            // Approuver l'enseignant
            $teacher->is_approved = true;
            $teacher->save();

            // Envoyer un email de confirmation à l'enseignant
            Mail::to($teacher->email)->send(new WelcomeEmail($teacher));

            return response()->json([
                'message' => 'Teacher approved successfully',
                'teacher' => $teacher
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to approve teacher',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupère la liste des enseignants qui attendent une approbation
     */
    public function getPendingTeachers()
    {

        try {
            // Vérifier que l'utilisateur est un administrateur
            if (!Auth::user() || Auth::user()->role !== 'admin') {
                return response()->json([
                    'message' => 'Unauthorized. Only administrators can access this resource.'
                ], 403);
            }

            // Récupérer tous les enseignants non approuvés
            $pendingTeachers = User::where('role', 'teacher')
                ->where('is_approved', false)
                ->with('profile')
                ->get();

            return response()->json([
                'pendingTeachers' => $pendingTeachers
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve pending teachers',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bannir ou débannir un utilisateur
     */
    public function toggleUserBan(Request $request, User $user)
    {
        try {
            // Vérifier que l'utilisateur est un admin
            if (!Auth::user() || Auth::user()->role !== 'admin') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Non autorisé'
                ], 403);
            }

            // Valider la requête
            $validated = $request->validate([
                'is_banned' => 'required|boolean',
                'ban_reason' => 'required_if:is_banned,true|nullable|string|max:255'
            ]);

            // Mettre à jour le statut de l'utilisateur
            $user->update([
                'is_banned' => $validated['is_banned'],
                'ban_reason' => $validated['is_banned'] ? $validated['ban_reason'] : null,
                'banned_at' => $validated['is_banned'] ? now() : null
            ]);

            // Si l'utilisateur est banni, révoquer tous ses tokens d'accès
            if ($validated['is_banned']) {
                $user->tokens()->delete();

                // Notifier l'utilisateur
                $user->notify(new UserBannedNotification($validated['ban_reason']));
            }

            return response()->json([
                'status' => 'success',
                'message' => $validated['is_banned'] ? 'Utilisateur banni avec succès' : 'Utilisateur débanni avec succès',
                'data' => [
                    'user_id' => $user->id,
                    'name' => $user->firstName . ' ' . $user->lastName,
                    'email' => $user->email,
                    'is_banned' => $user->is_banned,
                    'ban_reason' => $user->ban_reason,
                    'banned_at' => $user->banned_at
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la mise à jour du statut de l\'utilisateur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir la liste des utilisateurs bannis
     */
    public function getBannedUsers()
    {
        try {
            // Vérifier que l'utilisateur est un admin
            if (!Auth::user() || Auth::user()->role !== 'admin') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Non autorisé'
                ], 403);
            }

            $bannedUsers = User::where('is_banned', true)
                ->with(['profile'])
                ->orderBy('banned_at', 'desc')
                ->paginate(10);

            return response()->json([
                'status' => 'success',
                'data' => [
                    'users' => $bannedUsers->map(function ($user) {
                        return [
                            'id' => $user->id,
                            'name' => $user->firstName . ' ' . $user->lastName,
                            'email' => $user->email,
                            'ban_reason' => $user->ban_reason,
                            'banned_at' => $user->banned_at,
                            'profile' => $user->profile
                        ];
                    }),
                    'pagination' => [
                        'total' => $bannedUsers->total(),
                        'per_page' => $bannedUsers->perPage(),
                        'current_page' => $bannedUsers->currentPage(),
                        'last_page' => $bannedUsers->lastPage()
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la récupération des utilisateurs bannis',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
