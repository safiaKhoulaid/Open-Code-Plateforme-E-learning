<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Course;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class EnrollmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [

            'student_id' => User::factory(),
            'course_id' => Course::factory(),
            'enrollment_date' => fake()->dateTimeBetween('-1 year', 'now'),
            'expiry_date' => fake()->optional()->dateTimeBetween('now', '+2 years'),
            'price' => fake()->randomFloat(2, 10, 1000),
            'payment_id' => fake()->uuid(),
            'status' => fake()->randomElement(['ACTIVE', 'COMPLETED', 'EXPIRED', 'REFUNDED', 'CANCELLED'])

        ];
    }
}
