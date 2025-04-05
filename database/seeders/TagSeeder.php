<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    public function run(): void
    {
        // Tags populaires pour les cours de programmation
        $tags = [
            'Laravel',
            'PHP',
            'JavaScript',
            'React',
            'Vue.js',
            'Node.js',
            'Python',
            'Django',
            'Flask',
            'SQL',
            'MySQL',
            'PostgreSQL',
            'MongoDB',
            'Docker',
            'Git',
            'AWS',
            'DevOps',
            'UI/UX',
            'Design',
            'Marketing'
        ];

        foreach ($tags as $tag) {
            Tag::create([
                'name' => $tag,
                'course_count' => fake()->numberBetween(0, 100),
                'popularity' => fake()->numberBetween(0, 1000),
            ]);
        }
    }
}
