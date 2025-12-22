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
        Schema::create('correct_answers', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique()->index();
            $table->integer('question_id')->unsigned(); 
            $table->foreign('question_id')->references('id')->on('questions')->onDelete('cascade');
            $table->integer('answer_option_id')->unsigned(); 
            $table->foreign('answer_option_id')->references('id')->on('answer_options')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('correct_answers');
    }
};
