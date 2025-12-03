<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

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
        $title = $this->faker->sentence();
        return [
          'title' => $title,
          'subtitle' => $this->faker->sentence(),
          'description' => $this->faker->paragraphs(3, true),
          'slug' => Str::slug($title),
          'instructor_id' => User::factory(),
          'level' => $this->faker->randomElement(['beginner', 'intermediate', 'advanced']),
          'language' => $this->faker->randomElement(['fr', 'en', 'es', 'de', 'it', 'ja', 'zh', 'ar', 'pt', 'ru', 'nl', 'pl', 'tr', 'hi', 'bn', 'th', 'vi', 'ms', 'id', 'ko', 'ru', 'ar', 'es', 'pt', 'fr', 'de', 'it', 'ja', 'zh', 'ar', 'pt', 'ru', 'nl', 'pl', 'tr', 'hi', 'bn', 'th', 'vi', 'ms', 'id', 'ko']),
          'image_url' => $this->faker->imageUrl(640, 480, 'education'),
          'video_url' => null,
          'price' => $this->faker->randomFloat(2, 10, 200),
          'discount' => $this->faker->optional(0.3)->randomFloat(2, 5, 50),
          'published_date' => $this->faker->dateTimeBetween('-1 year', 'now'),
          'last_updated' => $this->faker->dateTimeBetween('-1 month', 'now'),
          'status' => $this->faker->randomElement(['DRAFT', 'REVIEW', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED']),
          'requirements' => $this->faker->paragraphs(2, true),
          'what_you_will_learn' => $this->faker->paragraphs(3, true),
          'target_audience' => $this->faker->paragraphs(2, true),
          'average_rating' => $this->faker->randomFloat(1, 1, 5),
          'total_reviews' => $this->faker->numberBetween(0, 1000),
          'total_students' => $this->faker->numberBetween(0, 5000),
          'has_certificate' => $this->faker->boolean(),
          'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
          'updated_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
