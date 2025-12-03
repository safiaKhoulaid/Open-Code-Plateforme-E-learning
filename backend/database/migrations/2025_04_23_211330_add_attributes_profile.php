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
            $table->string('name')->nullable();
            $table->string('job')->nullable();
            $table->json('certifications')->nullable();
            $table->json('experiences')->nullable(); // corrigé : "experionces" → "experiences"
            $table->string('phone')->nullable();
            $table->json('education')->nullable();
            $table->json('website')->nullable(); // corrigé : "webSite" → "website"
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropColumn([
                'name',
                'job',
                'certifications',
                'experiences',
                'phone',
                'education',
                'website',
            ]);
        });
    }
};
