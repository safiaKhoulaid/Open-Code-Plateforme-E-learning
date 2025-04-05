<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $instructors = User::where('role', 'instructor')->get();
        $categories = Category::all();

        foreach ($instructors as $instructor) {
            Course::factory()
                ->count(rand(1, 5))
                ->create([
                    'instructor_id' => $instructor->id,
                    'slug' => fn (array $attributes) => Str::slug($attributes['title'])
                ])
                ->each(function ($course) use ($categories) {
                    // Attacher 1 à 3 catégories aléatoires à chaque cours
                    $course->categories()->attach(
                        $categories->random(rand(1, 3))->pluck('id')->toArray()
                    );
                });
        }
    }
}
