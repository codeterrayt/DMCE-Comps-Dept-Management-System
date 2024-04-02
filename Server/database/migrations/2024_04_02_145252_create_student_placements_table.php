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
        Schema::create('student_placements', function (Blueprint $table) {
            $table->id();
            $table->string('academic_year');
            $table->boolean('campus_or_off_campus')->default(0);
            $table->string('company_name');
            $table->string('position');
            $table->string('country');
            $table->string('city');
            $table->string('state');
            $table->string('pincode');
            $table->string('package');
            $table->string('domain');
            $table->string('offer_letter')->nullable();
            $table->string('passout_year');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_placements');
    }
};
