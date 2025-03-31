<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Course>
 */
class CourseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
          'title' => $this->faker->sentence,
          'subtitle' => $this->faker->sentence,
          'description' => $this->faker->paragraph,
          'instructor_id' => User::factory(),
          'level' => $this->faker->randomElement(['beginner', 'intermediate', 'advanced']),
          'language' => $this->faker->randomElement(['fr', 'en', 'es', 'de', 'it', 'ja', 'zh', 'ar', 'pt', 'ru', 'nl', 'pl', 'tr', 'hi', 'bn', 'th', 'vi', 'ms', 'id', 'ko', 'ru', 'ar', 'es', 'pt', 'fr', 'de', 'it', 'ja', 'zh', 'ar', 'pt', 'ru', 'nl', 'pl', 'tr', 'hi', 'bn', 'th', 'vi', 'ms', 'id', 'ko']),
          'image_url' => $this->faker->imageUrl,

          'price' => $this->faker->randomFloat(2, 0, 100),
          'discount' => $this->faker->randomFloat(2, 0, 100),
          'published_date' => $this->faker->dateTimeBetween('-1 year', 'now'),
          'last_updated' => $this->faker->dateTimeBetween('-1 year', 'now'),
          'status' => $this->faker->randomElement(['DRAFT', 'REVIEW', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED']),
          'requirements' => $this->faker->paragraph,
          'what_you_will_learn' => $this->faker->paragraph,
          'target_audience' => $this->faker->paragraph,
          'average_rating' => $this->faker->randomFloat(2, 0, 5),
          'total_reviews' => $this->faker->numberBetween(0, 1000),
          'total_students' => $this->faker->numberBetween(0, 1000),
          'has_certificate' => $this->faker->boolean,
          'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
          'updated_at' => $this->faker->dateTimeBetween('-1 year', 'now'),

        ];
    }
}
