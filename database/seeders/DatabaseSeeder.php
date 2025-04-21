<?php

namespace Database\Seeders;

use App\Models\Tag;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Section;
use App\Models\Category;
use App\Models\Enrollment;
use App\Models\Certificate;
use App\Models\Resource;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Créer d'abord les leçons nécessaires
        Lesson::factory(10)->create();
        // Puis créer les ressources
        Resource::factory(100)->create();
        // Category::factory(2)->create();
        // Créer quelques utilisateurs
        // User::factory(10)->create();
        // Tag::factory(10)->create();
        // Course::factory(10)->create();
        // Section::factory(10)->create();
        // Enrollment::factory(10)->create();
        // Certificate::factory(10)->create([
        //     'user_id' => 303,
        //     'course_id' => Course::factory(),
        // ]);
        // Enrollment::factory(10)->create([
        //     'student_id' => 303,
        // ]);

        // Créer des catégories spécifiques
        // Category::create([
        //     'title' => 'Catégorie Parente',
        //     'description' => 'Description de la catégorie parente',
        //     'is_active' => true,
        //     'display_order' => 1,
        //     // autres champs nécessaires
        // ]);

        // Category::create([
        //     'title' => 'Programmation',
        //     'description' => 'Cours de programmation',

        //     'is_active' => true,
        //     'display_order' => 2
        // ]);

        // // Créer des tags spécifiques
        // Tag::create([
        //     'name' => 'Laravel',
        //     'course_count' => 0,
        //     'popularity' => 0
        // ]);

        // Tag::create([
        //     'name' => 'PHP',
        //     'course_count' => 0,
        //     'popularity' => 0
        // ]);

        // Créer les tags et les cours
        // $this->call([
        //     TagSeeder::class,
        //     CourseSeeder::class,
        // ]);
    }
}
