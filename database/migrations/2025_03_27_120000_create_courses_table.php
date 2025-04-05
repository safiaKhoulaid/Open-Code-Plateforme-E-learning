<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->text('description');
            $table->string('slug')->unique();
            $table->foreignId('instructor_id')->constrained('users','id')->onDelete('cascade');
            $table->enum('level', ['beginner', 'intermediate', 'advanced']);
            $table->enum('language',['fr', 'en', 'es', 'de', 'it', 'ja', 'zh', 'ar', 'pt', 'ru', 'nl', 'pl', 'tr', 'hi', 'bn', 'th', 'vi', 'ms', 'id', 'ko', 'ru', 'ar', 'es', 'pt', 'fr', 'de', 'it', 'ja', 'zh', 'ar', 'pt', 'ru', 'nl', 'pl', 'tr', 'hi', 'bn', 'th', 'vi', 'ms', 'id', 'ko']);
            $table->string('image_url')->nullable();
            $table->string('video_url')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('discount', 5, 2)->nullable();
            $table->timestamp('published_date')->nullable();
            $table->timestamp('last_updated')->nullable();
            $table->enum('status', ['DRAFT', 'REVIEW', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED'])->default('DRAFT');
            $table->json('requirements')->nullable();
            $table->json('what_you_will_learn')->nullable();
            $table->json('target_audience')->nullable();
            $table->decimal('average_rating', 3, 2)->default(0);
            $table->integer('total_reviews')->default(0);
            $table->integer('total_students')->default(0);
            $table->boolean('has_certificate')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
