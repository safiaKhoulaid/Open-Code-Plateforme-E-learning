<?php

namespace App\Http\Controllers;

use App\Models\ShoppingCart;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Exception;

class ShoppingCartController extends Controller
{
    /**
     * Afficher le panier de l'utilisateur
     */
    public function index()
    {
        try {
            $cartItems = ShoppingCart::with('course')
                ->where('user_id', Auth::id())
                ->get();

            $total = $cartItems->sum(function ($item) {
                $price = $item->course->price;
                $discount = $item->course->discount ?? 0;
                return ($price - $discount) * $item->quantity;
            });

            return response()->json([
                'items' => $cartItems,
                'total' => $total,
                'count' => $cartItems->sum('quantity')
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la récupération du panier',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Ajouter un cours au panier
     */
    public function addToCart(Request $request)
    {
        try {
            $validated = $request->validate([
                'course_id' => 'required|exists:courses,id',
                'quantity' => 'integer|min:1|nullable'
            ]);

            $course = Course::findOrFail($validated['course_id']);

            // Vérifier si le cours est déjà dans le panier
            $cartItem = ShoppingCart::where('user_id', Auth::id())
                ->where('course_id', $validated['course_id'])
                ->first();

            if ($cartItem) {
                // Mettre à jour la quantité
                $cartItem->quantity += $validated['quantity'] ?? 1;
                $cartItem->save();
            } else {
                // Créer un nouvel élément
                $cartItem = ShoppingCart::create([
                    'user_id' => Auth::id(),
                    'course_id' => $validated['course_id'],
                    'quantity' => $validated['quantity'] ?? 1,
                    'price' => $course->price - ($course->discount ?? 0)
                ]);
            }

            return response()->json([
                'message' => 'Cours ajouté au panier avec succès',
                'item' => $cartItem->load('course')
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de l\'ajout au panier',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mettre à jour la quantité d'un cours dans le panier
     */
    public function updateCart(Request $request)
    {
        try {
            $validated = $request->validate([
                'course_id' => 'required|exists:courses,id',
                'quantity' => 'required|integer|min:1'
            ]);

            $cartItem = ShoppingCart::where('user_id', Auth::id())
                ->where('course_id', $validated['course_id'])
                ->first();

            if (!$cartItem) {
                return response()->json([
                    'message' => 'Cours non trouvé dans le panier'
                ], 404);
            }

            $cartItem->quantity = $validated['quantity'];
            $cartItem->save();

            return response()->json([
                'message' => 'Panier mis à jour avec succès',
                'item' => $cartItem->load('course')
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la mise à jour du panier',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer un cours du panier
     */
    public function removeFromCart(Request $request)
    {
        try {
            $validated = $request->validate([
                'course_id' => 'required|exists:courses,id'
            ]);

            $deleted = ShoppingCart::where('user_id', Auth::id())
                ->where('course_id', $validated['course_id'])
                ->delete();

            if (!$deleted) {
                return response()->json([
                    'message' => 'Cours non trouvé dans le panier'
                ], 404);
            }

            return response()->json([
                'message' => 'Cours retiré du panier avec succès'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la suppression du panier',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Vider le panier
     */
    public function clearCart()
    {
        try {
            ShoppingCart::where('user_id', Auth::id())->delete();

            return response()->json([
                'message' => 'Panier vidé avec succès'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Erreur lors du vidage du panier',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Vérifier si un cours est dans le panier
     */
    public function checkCourseInCart($courseId)
    {
        try {
            $exists = ShoppingCart::where('user_id', Auth::id())
                ->where('course_id', $courseId)
                ->exists();

            return response()->json([
                'in_cart' => $exists
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la vérification du panier',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir le total du panier
     */
    public function getCartTotal()
    {
        try {
            $cartItems = ShoppingCart::with('course')
                ->where('user_id', Auth::id())
                ->get();

            $total = $cartItems->sum(function ($item) {
                $price = $item->course->price;
                $discount = $item->course->discount ?? 0;
                return ($price - $discount) * $item->quantity;
            });

            return response()->json([
                'total' => $total
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Erreur lors du calcul du total',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir le nombre d'articles dans le panier
     */
    public function getCartCount()
    {
        try {
            $count = ShoppingCart::where('user_id', Auth::id())
                ->sum('quantity');

            return response()->json([
                'count' => $count
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Erreur lors du comptage des articles',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
