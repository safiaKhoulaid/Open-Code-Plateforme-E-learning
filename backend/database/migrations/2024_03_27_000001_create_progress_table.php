<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->json('completed_lessons')->nullable();
            $table->foreignId('current_lesson_id')->nullable()->constrained('lessons')->onDelete('set null');
            $table->decimal('progress_percentage', 5, 2)->default(0);
            $table->timestamp('last_activity_at')->nullable();
            $table->timestamps();

            // Un utilisateur ne peut avoir qu'une seule progression par cours
            $table->unique(['user_id', 'course_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('progress');
    }
};
