<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\ShoppingCart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ShoppingCartController extends Controller
{
    public function index()
    {
        $cart = auth()->user()->shoppingCart()->with('items.course')->first();
        if (!$cart) {
            $cart = auth()->user()->shoppingCart()->create([
                'subtotal' => 0,
                'discount' => 0,
                'tax' => 0,
                'total' => 0,
                'last_updated' => now()
            ]);
        }

        return response()->json([$cart]);
    }

    public function add(Request $request, Course $course)
    {
        $cart = auth()->user()->shoppingCart()->first();
        if (!$cart) {
            $cart = auth()->user()->shoppingCart()->create([
                'subtotal' => 0,
                'discount' => 0,
                'tax' => 0,
                'total' => 0,
                'last_updated' => now()
            ]);
        }

        // Vérifier si le cours est déjà dans le panier
        if ($cart->items()->where('course_id', $course->id)->exists()) {
            return back()->with('error', 'Ce cours est déjà dans votre panier.');
        }

        // Vérifier si l'utilisateur est déjà inscrit au cours
        if (auth()->user()->enrolledCourses()->where('course_id', $course->id)->exists()) {
            return back()->with('error', 'Vous êtes déjà inscrit à ce cours.');
        }

        // Ajouter le cours au panier
        $cart->items()->create([
            'course_id' => $course->id,
            'price' => $course->price,
            'discount' => $course->discount ?? 0,
            'added_date' => now()
        ]);

        $this->updateCartTotals($cart);

        return back()->with('success', 'Cours ajouté au panier avec succès.');
    }

    public function remove(Course $course)
    {
        $cart = auth()->user()->shoppingCart()->first();
        if (!$cart) {
            return back()->with('error', 'Votre panier est vide.');
        }

        $cart->items()->where('course_id', $course->id)->delete();
        $this->updateCartTotals($cart);

        return back()->with('success', 'Cours retiré du panier avec succès.');
    }

    public function update(Request $request)
    {
        $cart = auth()->user()->shoppingCart()->first();
        if (!$cart) {
            return back()->with('error', 'Votre panier est vide.');
        }

        $validated = $request->validate([
            'coupon_code' => 'nullable|string|exists:coupons,code'
        ]);

        if ($request->has('coupon_code')) {
            $coupon = Coupon::where('code', $validated['coupon_code'])->first();
            if ($coupon->isValid()) {
                $cart->update([
                    'coupon_code' => $coupon->code,
                    'discount' => $coupon->calculateDiscount($cart->subtotal)
                ]);
                $this->updateCartTotals($cart);
                return back()->with('success', 'Code promo appliqué avec succès.');
            }
            return back()->with('error', 'Code promo invalide ou expiré.');
        }

        return back();
    }

    public function checkout(Request $request)
    {
        $cart = auth()->user()->shoppingCart()->with('items.course')->first();
        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')
                ->with('error', 'Votre panier est vide.');
        }

        // Créer une commande
        $order = Order::create([
            'user_id' => auth()->id(),
            'total_amount' => $cart->subtotal,
            'discount' => $cart->discount,
            'tax' => $cart->tax,
            'final_amount' => $cart->total,
            'payment_method' => $request->payment_method,
            'status' => 'PENDING',
            'created_date' => now(),
            'billing_address' => $request->billing_address
        ]);

        // Créer les éléments de la commande
        foreach ($cart->items as $item) {
            $order->items()->create([
                'course_id' => $item->course_id,
                'price' => $item->price,
                'discount' => $item->discount
            ]);
        }

        // Créer un paiement
        $payment = Payment::create([
            'order_id' => $order->id,
            'user_id' => auth()->id(),
            'amount' => $order->final_amount,
            'currency' => 'EUR',
            'method' => $request->payment_method,
            'status' => 'PENDING',
            'transaction_id' => null,
            'timestamp' => now(),
            'billing_details' => $request->billing_address
        ]);

        // Vider le panier
        $cart->items()->delete();
        $cart->update([
            'subtotal' => 0,
            'discount' => 0,
            'tax' => 0,
            'total' => 0,
            'coupon_code' => null,
            'last_updated' => now()
        ]);

        return redirect()->route('payments.process', $payment);
    }

    private function updateCartTotals(ShoppingCart $cart)
    {
        $subtotal = $cart->items->sum(function ($item) {
            return $item->price - $item->discount;
        });

        $tax = $subtotal * 0.20; // TVA 20%
        $total = $subtotal + $tax - $cart->discount;

        $cart->update([
            'subtotal' => $subtotal,
            'tax' => $tax,
            'total' => $total,
            'last_updated' => now()
        ]);
    }
}
