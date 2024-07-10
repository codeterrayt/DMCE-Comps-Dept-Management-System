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
        Schema::create('student_hackathons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('academic_year');
            $table->string('student_year');
            $table->string('hackathon_title');
            $table->string('hackathon_level');
            $table->string('hackathon_location');
            $table->date('hackathon_from_date');
            $table->date('hackathon_to_date');
            $table->string('hackathon_prize')->nullable();
            $table->string('hackathon_position')->nullable();
            $table->string('description')->nullable();
            $table->string('hackathon_college_name');
            $table->string('hackathon_certificate_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_hackathons');
    }
};
