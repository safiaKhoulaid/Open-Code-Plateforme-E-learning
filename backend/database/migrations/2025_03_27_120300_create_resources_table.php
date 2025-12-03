<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('resources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->enum('type', ['PDF', 'DOC', 'VIDEO', 'AUDIO', 'LINK', 'CODE', 'ZIP']);
            $table->string('file_url');
            $table->decimal('file_size', 10, 2)->comment('File size in MB');
            $table->boolean('is_downloadable')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resources');
    }
};
