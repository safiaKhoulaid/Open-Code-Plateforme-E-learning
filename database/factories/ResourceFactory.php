<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Lesson;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class ResourceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'lesson_id' => Lesson::factory(),
            'title' => $this->faker->sentence,
            'type' => $this->faker->randomElement(['PDF', 'DOC', 'VIDEO', 'AUDIO', 'LINK', 'CODE', 'ZIP']),
            'file_url' => $this->faker->url,
            'file_size' => $this->faker->randomFloat(1, 10, 2),
            'is_downloadable' => $this->faker->boolean,
        ];
    }
}
