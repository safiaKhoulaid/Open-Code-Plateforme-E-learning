<?php

namespace Database\Factories;

use App\Models\ShoppingCart;
use App\Models\User;
use App\Models\Course;
use Illuminate\Database\Eloquent\Factories\Factory;

class ShoppingCartFactory extends Factory
{
    protected $model = ShoppingCart::class;

    public function definition()
    {
        $course = Course::inRandomOrder()->first() ?? Course::factory()->create();
        $price = $course->price;
        $discount = $course->discount ?? 0;

        return [
            'user_id' => User::factory(),
            'course_id' => $course->id,
            'quantity' => $this->faker->numberBetween(1, 3),
            'price' => $price - $discount,
        ];
    }
}
