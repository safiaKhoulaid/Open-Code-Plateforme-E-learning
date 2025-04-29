<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Course;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    /**
     * Display a listing of the wishlist items for the authenticated user.
     */
    public function index(Request $request): JsonResponse
{
   try{
    // Valider et récupérer l'ID utilisateur
    $validated = $request->validate([
        'user_id' => 'required|numeric',
    ]);


    $userId = $validated['user_id'];

    // Vérifier si l'utilisateur existe
    $user = User::find($userId);

    if (!$user) {
        return response()->json(['message' => 'Utilisateur non trouvé'], 404);
    }

    // Récupérer la wishlist de l'utilisateur
    $wishlistItems = Wishlist::with('course')
        ->where('user_id', $userId)
        ->orderBy('added_at', 'desc')
        ->get();

    return response()->json([
        'wishlist' => $wishlistItems,
    ]);
}
catch(\Illuminate\Database\QueryException $e){
    return response()->json(['message'=> $e->getMessage()],404);
}}


    /**
     * Store a newly created wishlist item in storage.
     */
    public function store(Request $request ): JsonResponse
    {
        $id = $request->input('user_id');
        $user = User::findOrFail($id);

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'course_id' => 'required',
            'has_notifications' => 'boolean',
        ]);



        // Check if the item already exists in the wishlist
        $existingItem = Wishlist::where('user_id', $user->id)
            ->where('course_id', $validated['course_id'])
            ->first();

        if ($existingItem) {
            return response()->json([
                'message' => 'Course already in wishlist',
                'wishlist_item' => $existingItem,
            ], 200);
        }


        // Create new wishlist item
        $wishlistItem = Wishlist::create([
            'user_id' => $user->id,
            'course_id' => $validated['course_id'],
            'has_notifications' => $validated['has_notifications'] ?? true,
            'added_at' => now(),
        ]);

        return response()->json([
            'message' => 'Course added to wishlist',
            'wishlist_item' => $wishlistItem,
        ], 201);
    }

    /**
     * Display the specified wishlist item.
     */
    public function show(string $id): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $wishlistItem = Wishlist::with('course')
            ->where('user_id', $user->id)
            ->where('id', $id)
            ->first();

        if (!$wishlistItem) {
            return response()->json(['message' => 'Wishlist item not found'], 404);
        }

        return response()->json([
            'wishlist_item' => $wishlistItem,
        ]);
    }

    /**
     * Update the specified wishlist item in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $wishlistItem = Wishlist::where('user_id', $user->id)
            ->where('id', $id)
            ->first();

        if (!$wishlistItem) {
            return response()->json(['message' => 'Wishlist item not found'], 404);
        }

        $validated = $request->validate([
            'has_notifications' => 'boolean',
        ]);

        $wishlistItem->update($validated);

        return response()->json([
            'message' => 'Wishlist item updated',
            'wishlist_item' => $wishlistItem,
        ]);
    }

    /**
     * Remove the specified wishlist item from storage.
     */
    public function destroy(Request $request ,string $ide): JsonResponse
    {
        $id = $request->input('user_id');

        $user = User::findOrFail($id);
                if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $wishlistItem = Wishlist::where('user_id', $id)
            ->where('id', $ide)
            ->first();

        if (!$wishlistItem) {
            return response()->json(['message' => 'Wishlist item not found'], 404);
        }

        $wishlistItem->delete();

        return response()->json([
            'message' => 'Wishlist item removed',
        ]);
    }

    /**
     * Toggle a course in the user's wishlist.
     */
    public function toggle(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'course_id' => 'required|exists:courses,id',
            ]);

            $user = User::find($validated['user_id']);

            if (!$user) {
                return response()->json(['message' => 'Utilisateur non trouvé'], 404);
            }

            $existingItem = Wishlist::where('user_id', $user->id)
                ->where('course_id', $validated['course_id'])
                ->first();

            if ($existingItem) {
                // Supprimer de la liste de souhaits
                $existingItem->delete();

                return response()->json([
                    'message' => 'Cours retiré de la liste de souhaits',
                    'in_wishlist' => false,
                ]);
            } else {
                // Ajouter à la liste de souhaits
                $wishlistItem = Wishlist::create([
                    'user_id' => $user->id,
                    'course_id' => $validated['course_id'],
                    'has_notifications' => true,
                    'added_at' => now(),
                ]);

                return response()->json([
                    'message' => 'Cours ajouté à la liste de souhaits',
                    'in_wishlist' => true,
                    'wishlist_item' => $wishlistItem,
                ], 201);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Une erreur est survenue',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle notifications for a wishlist item.
     */
    public function toggleNotifications(string $id): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $wishlistItem = Wishlist::where('user_id', $user->id)
            ->where('id', $id)
            ->first();

        if (!$wishlistItem) {
            return response()->json(['message' => 'Wishlist item not found'], 404);
        }

        $wishlistItem->has_notifications = !$wishlistItem->has_notifications;
        $wishlistItem->save();

        return response()->json([
            'message' => $wishlistItem->has_notifications
                ? 'Notifications enabled for this course'
                : 'Notifications disabled for this course',
            'has_notifications' => $wishlistItem->has_notifications,
        ]);
    }

    /**
     * Clear all items from the user's wishlist.
     */
    public function clear(): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        Wishlist::where('user_id', $user->id)->delete();

        return response()->json([
            'message' => 'Wishlist cleared',
        ]);
    }

    /**
     * Check if a course is in the user's wishlist.
     */
    public function check(string $courseId): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $exists = Wishlist::where('user_id', $user->id)
            ->where('course_id', $courseId)
            ->exists();

        return response()->json([
            'in_wishlist' => $exists,
        ]);
    }
}