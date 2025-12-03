<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Lesson>
 */
class LessonFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'section_id' => \App\Models\Section::factory(),
            'title' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'content_type' => fake()->randomElement(['text', 'video', 'audio', 'image', 'pdf', 'link']),
            'content_url' => fake()->url(),
            'order' => fake()->numberBetween(0, 100),
            'is_published' => fake()->boolean(),
            'duration' => fake()->numberBetween(5, 120)
        ];
    }
}
