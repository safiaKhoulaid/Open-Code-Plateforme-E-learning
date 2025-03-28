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
        Schema::table('profiles', function (Blueprint $table) {
            $table->string('biography')->nullable()->change();
            $table->string('linkdebLink')->nullable()->change();
            $table->string('instagramLink')->nullable()->change();
            $table->string('skills')->nullable()->change();
            $table->string('discordLink')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->string('biography')->nullable(false)->change();
            $table->string('linkdebLink')->nullable(false)->change();
            $table->string('instagramLink')->nullable(false)->change();
            $table->string('skills')->nullable(false)->change();
            $table->string('discordLink')->nullable(false)->change();
        });
    }
};
