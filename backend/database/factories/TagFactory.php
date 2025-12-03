<?php

namespace Database\Factories;

use App\Models\Tag;
use Illuminate\Database\Eloquent\Factories\Factory;

class TagFactory extends Factory
{
    protected $model = Tag::class;

    public function definition(): array
    {
        return [
            'name' => fake()->unique()->word(),
            'course_count' => fake()->numberBetween(0, 100),
            'popularity' => fake()->numberBetween(0, 1000),
        ];
    }
}
