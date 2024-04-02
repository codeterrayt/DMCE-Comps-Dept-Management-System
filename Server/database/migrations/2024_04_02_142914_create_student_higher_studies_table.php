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
        Schema::create('student_higher_studies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('student_academic_year');
            $table->string('student_exam_type');
            $table->string('student_score');
            $table->string('university_city');
            $table->string('university_state');
            $table->string('university_country');
            $table->string('university_name');
            $table->string('student_course');
            $table->string('student_admission_letter')->nullable();
            $table->string('student_project_guide');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_higher_studies');
    }
};
