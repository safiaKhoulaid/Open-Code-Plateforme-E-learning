<?php

use App\Models\User;
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
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users','id')->onDelete('cascade');
            $table->string('firstName');
            $table->string('lastName');
            $table->string('profilPicture');
            $table->string('biography');
            $table->string('linkdebLink');
            $table->string('instagramLink');
            $table->string('skills');
            $table->string('discordLink');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }

};
