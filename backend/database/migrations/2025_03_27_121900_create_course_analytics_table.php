<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('course_analytics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->json('enrollments')->nullable();
            $table->decimal('completion_rate', 5, 2)->default(0);
            $table->decimal('average_rating', 3, 2)->default(0);
            $table->json('revenue')->nullable();
            $table->json('views_by_section')->nullable();
            $table->json('dropoff_points')->nullable();
            $table->json('student_demographics')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_analytics');
    }
};
