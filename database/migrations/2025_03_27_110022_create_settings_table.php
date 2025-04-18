<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('settings')) {
            Schema::create('settings', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->boolean('email_notifications')->default(true);
                $table->boolean('mobile_notifications')->default(true);
                $table->string('language')->default('fr');
                $table->string('timezone')->default('Europe/Paris');
                $table->json('privacy_settings')->default(json_encode([
                    'profile_visibility' => 'public',
                    'course_progress' => 'public',
                    'show_email' => false
                ]));
                $table->json('notification_types')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};