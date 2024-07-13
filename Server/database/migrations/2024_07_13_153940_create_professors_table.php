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
        Schema::create('professors', function (Blueprint $table) {
            $table->id();
            // $table->string("professor_name");
            $table->string("professor_gender")->nullable();
            $table->string("professor_phone_no");
            $table->string("professor_name_alias")->nullable();
            // $table->string('professor_email')->nullable()->unique();
            $table->unsignedBigInteger('user_id'); // Define foreign key column

            $table->foreign('user_id') // Define foreign key constraint
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade'); // Cascade delete if user is deleted

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('professors');
    }
};
