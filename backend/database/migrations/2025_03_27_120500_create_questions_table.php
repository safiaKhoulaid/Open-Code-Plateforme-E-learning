<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_id')->constrained()->onDelete('cascade');
            $table->text('text');
            $table->enum('type', ['MULTIPLE_CHOICE', 'SINGLE_CHOICE', 'TRUE_FALSE', 'FILL_BLANK', 'MATCHING', 'ESSAY']);
            $table->integer('points');
            $table->json('options')->nullable();
            $table->json('correct_answers');
            $table->text('explanation')->nullable();
            $table->boolean('is_required')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
