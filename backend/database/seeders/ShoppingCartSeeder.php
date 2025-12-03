<?php

namespace Database\Seeders;

use App\Models\ShoppingCart;
use App\Models\User;
use App\Models\Course;
use Illuminate\Database\Seeder;

class ShoppingCartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer quelques utilisateurs et cours
        $users = User::take(5)->get();
        $courses = Course::take(10)->get();

        if ($users->isEmpty() || $courses->isEmpty()) {
            return;
        }

        foreach ($users as $user) {
            // Ajouter 1 à 3 cours au panier de chaque utilisateur
            $cartCourses = $courses->random(rand(1, 3));

            foreach ($cartCourses as $course) {
                $price = $course->price;
                $discount = $course->discount ?? 0;

                ShoppingCart::create([
                    'user_id' => $user->id,
                    'course_id' => $course->id,
                    'quantity' => rand(1, 2),
                    'price' => $price - $discount
                ]);
            }
        }
    }
}
