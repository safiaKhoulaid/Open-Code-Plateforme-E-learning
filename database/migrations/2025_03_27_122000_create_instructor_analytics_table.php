<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('instructor_analytics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('instructor_id')->constrained('teachers')->onDelete('cascade');
            $table->integer('total_students')->default(0);
            $table->integer('total_courses')->default(0);
            $table->decimal('total_revenue', 10, 2)->default(0);
            $table->json('revenue_by_month')->nullable();
            $table->json('revenue_by_content')->nullable();
            $table->json('student_engagement')->nullable();
            $table->json('ratings_summary')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('instructor_analytics');
    }
};
