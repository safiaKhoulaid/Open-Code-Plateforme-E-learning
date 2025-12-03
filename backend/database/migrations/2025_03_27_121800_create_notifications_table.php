<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('message');
            $table->enum('type', ['COURSE_UPDATE', 'NEW_MESSAGE', 'ASSIGNMENT_FEEDBACK', 'ENROLLMENT', 'PROMOTION', 'SYSTEM']);
            $table->timestamp('timestamp');
            $table->boolean('is_read')->default(false);
            $table->string('action_url')->nullable();
            $table->string('icon')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
