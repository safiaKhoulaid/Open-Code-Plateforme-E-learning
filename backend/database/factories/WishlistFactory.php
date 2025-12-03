<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Course;
use App\Models\Wishlist;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Wishlist>
 */
class WishlistFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Wishlist::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'course_id' => Course::factory(),
            'has_notifications' => $this->faker->boolean(80), // 80% chance of having notifications enabled
            'added_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }

    /**
     * Indicate that the wishlist item has notifications disabled.
     *
     * @return $this
     */
    public function withoutNotifications(): static
    {
        return $this->state(fn (array $attributes) => [
            'has_notifications' => false,
        ]);
    }

    /**
     * Indicate that the wishlist item was added recently.
     *
     * @return $this
     */
    public function recentlyAdded(): static
    {
        return $this->state(fn (array $attributes) => [
            'added_at' => $this->faker->dateTimeBetween('-1 week', 'now'),
        ]);
    }
}