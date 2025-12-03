<?php

namespace Database\Factories;

use App\Models\Rating;
use App\Models\User;
use App\Models\Course;
use Illuminate\Database\Eloquent\Factories\Factory;

class RatingFactory extends Factory
{
    protected $model = Rating::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'course_id' => Course::factory(),
            'stars' => $this->faker->numberBetween(1, 5),
            'comment' => $this->faker->optional()->paragraph,
            'date' => $this->faker->dateTimeBetween('-1 year', 'now'),
            
        ];
    }
}
