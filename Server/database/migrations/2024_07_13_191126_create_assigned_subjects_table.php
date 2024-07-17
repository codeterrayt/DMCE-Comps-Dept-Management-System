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
        Schema::create('assigned_subjects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            $table->unsignedBigInteger('subject_id');
            $table->foreign('subject_id')->references('id')->on('subjects')->onDelete('cascade');

            $table->boolean('pr_th')->default(0);
            $table->string('batch');
            $table->string('sub_batch')->nullable();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assigned_subjects');
    }
};
