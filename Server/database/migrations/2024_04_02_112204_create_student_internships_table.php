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
        Schema::create('student_internships', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('academic_year')->nullable();
            $table->string('company_name')->nullable();
            $table->integer('duration')->nullable();
            $table->string('domain')->nullable();
            $table->string('description')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('completion_letter_path')->nullable();
            $table->string('certificate_path')->nullable();
            $table->string('offer_letter_path')->nullable();
            $table->string('permission_letter_path')->nullable();
            $table->string('student_year')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_internships');
    }
};
