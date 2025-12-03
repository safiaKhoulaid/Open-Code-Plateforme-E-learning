<?php

namespace Database\Seeders;

use App\Models\Tag;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Rating;
use App\Models\Section;
use App\Models\Category;
use App\Models\Resource;
use App\Models\Wishlist;
use App\Models\Enrollment;
use App\Models\Certificate;
use App\Models\ShoppingCart;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Créer des utilisateurs
        User::factory(10)->create();

        // Créer des catégories
        Category::factory(5)->create();

        // Créer des catégories enfants
        Category::factory(10)->create([
            'parent_id' => fn() => Category::inRandomOrder()->first()->id
        ]);

        // Créer des tags
        Tag::factory(20)->create();

        // Créer des cours
        Course::factory(15)->create();

        // Créer des sections pour les cours
        $courses = Course::all();
        foreach ($courses as $course) {
            Section::factory(rand(3, 6))->create([
                'course_id' => $course->id
            ]);
        }

        // Créer des leçons pour les sections
        $sections = Section::all();
        foreach ($sections as $section) {
            Lesson::factory(rand(2, 5))->create([
                'section_id' => $section->id
            ]);
        }

        // Créer des évaluations pour les cours
        foreach ($courses as $course) {
            Rating::factory(rand(5, 15))->create([
                'course_id' => $course->id,
                'user_id' => fn() => User::inRandomOrder()->first()->id
            ]);
        }

        // Créer des inscriptions aux cours
        $users = User::all();
        foreach ($users as $user) {
            $courseSelection = $courses->random(rand(1, 5));
            foreach ($courseSelection as $course) {
                Enrollment::factory()->create([
                    'user_id' => $user->id,
                    'course_id' => $course->id
                ]);
            }
        }

        // Créer des wishlists
        foreach ($users as $user) {
            $courseSelection = $courses->random(rand(1, 3));
            foreach ($courseSelection as $course) {
                Wishlist::factory()->create([
                    'user_id' => $user->id,
                    'course_id' => $course->id
                ]);
            }
        }

        // Créer des paniers d'achat
        foreach ($users as $user) {
            $courseSelection = $courses->random(rand(1, 3));
            foreach ($courseSelection as $course) {
                ShoppingCart::factory()->create([
                    'user_id' => $user->id,
                    'course_id' => $course->id
                ]);
            }
        }

        // Créer des certificats pour les cours terminés
        foreach ($users as $user) {
            $enrollments = $user->enrollments()->inRandomOrder()->limit(rand(0, 3))->get();
            foreach ($enrollments as $enrollment) {
                Certificate::factory()->create([
                    'user_id' => $user->id,
                    'course_id' => $enrollment->course_id
                ]);
            }
        }

        // Appeler d'autres seeders si nécessaire
        $this->call([
            // TagSeeder::class,
            // CourseSeeder::class,
            // ShoppingCartSeeder::class,
        ]);
    }
}
