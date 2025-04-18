<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Certificate>
 */
class CertificateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'course_id' => \App\Models\Course::factory(),
            'issue_date' => fake()->dateTimeBetween('-1 year', 'now'),
            'expiry_date' => fake()->optional()->dateTimeBetween('now', '+2 years'),
            'title' => fake()->sentence(),
            'instructor_name' => fake()->name(),
            'student_name' => fake()->name(),
            'course_title' => fake()->sentence(),
            'verification_url' => fake()->url(),
            'pdf_url' => fake()->url(),
            'skills' => fake()->randomElements(['skill1', 'skill2', 'skill3'], 2),
        ];
    }
}
