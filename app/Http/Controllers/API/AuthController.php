<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use App\Mail\WelcomeEmail;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use illuminate\support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'firstName' => 'required|string',
                'lastName' => 'required|string',
                'email' => 'required|email|unique:users',
                'password' => 'required|string|min:6',
                'role' => 'required|string|in:admin,student,teacher'
            ]);

            $isApproved = ($validated['role'] == 'student');

            $user = User::create([
                'firstName' => $validated['firstName'],
                'lastName' => $validated['lastName'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
                'is_approved' => $isApproved

            ]);


            Mail::to($user->email)->send(new WelcomeEmail($user));

            // if ($validated['role'] === 'teacher') {

            //     Mail::to('admin@example.com')->send(new NewTeacherRegistration($user));
            // }

            return response()->json([
                'user' => $user,
                'message' => $isApproved
                    ? 'User created successfully. You can now log in.'
                    : 'User created successfully. Your account requires admin approval before you can log in.'
            ], 201);


        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->validator->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'User registration failed!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
{
    $validated = $request->validate([
        'email' => 'required|email',
        'password' => 'required|string'
    ]);

    if (!Auth::attempt($validated)) {
        return response()->json([
            'message' => 'Invalid credentials'
        ], 401);
    }

    $user = Auth::user();
    if ($user->is_approved === false) {
        // Déconnecter l'utilisateur puisqu'il s'est connecté mais n'est pas approuvé
        Auth::logout();

        return response()->json([
            'message' => 'Your account is pending approval. Please contact the administrator.'
        ], 403);
    }
    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'user' => $user,
        'token' => $token
    ], 200);
}

public function logout(Request $request)
{
    $request->user()->currentAccessToken()->delete();

    return response()->json([
        'message' => 'Logged out successfully'
    ], 200);
}


public function forgotPassword(Request $request)
{
    // Valider l'email fourni
    $request->validate([
        'email' => 'required|email|exists:users,email',
    ]);

    try {
        // Envoyer le lien de réinitialisation de mot de passe
        $status = Password::sendResetLink(
            $request->only('email')
        );

        // Vérifier le statut et renvoyer la réponse appropriée
        if ($status === Password::RESET_LINK_SENT) {
            return response()->json(['message' => 'Password reset link sent to your email'], 200);
        }

        // Si le lien de réinitialisation ne peut pas être envoyé
        return response()->json(['message' => 'Unable to send reset link'], 400);

    } catch (\Exception $e) {
        // En cas d'erreur, retourner un message générique
        return response()->json(['message' => 'Error occurred while sending reset link', 'error' => $e->getMessage()], 500);
    }
}


public function resetPassword(Request $request)
{
    $request->validate([
        'token' => 'required',
        'email' => 'required|email',
        'password' => 'required|min:6|confirmed',
    ]);

    try {
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                $user->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Password reset successfully'], 200);
        }

        return response()->json(['message' => 'Unable to reset password'], 400);

    } catch (\Exception $e) {
        return response()->json(['message' => 'Error occurred while resetting password'], 500);
    }
}
public function getUser(Request $request)
{
    return response()->json([
        'user' => $request->user()
    ]);
}
}
