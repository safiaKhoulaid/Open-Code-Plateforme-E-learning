<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->json('completed_lessons')->nullable();
            $table->timestamp('last_accessed')->nullable();
            $table->decimal('completion_percentage', 5, 2)->default(0);
            $table->json('quiz_results')->nullable();
            $table->json('assignment_results')->nullable();
            $table->boolean('certificate_issued')->default(false);
            $table->integer('total_time_spent')->default(0)->comment('Total time spent in minutes');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('progress');
    }
};
