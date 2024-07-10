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
        Schema::create('student_extra_cus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('academic_year');
            $table->string('student_year');
            $table->string('ecc_certificate_path')->nullable();
            $table->string('description')->nullable();
            $table->string('ecc_domain');
            $table->string('college_name');
            $table->string('ecc_level');
            $table->string('ecc_location');
            $table->date('ecc_date');
            $table->string('prize')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_extra_cus');
    }
};
