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
        Schema::create('secuencias', function (Blueprint $table) {
            $table->id();
            $table->string('fact_num');
            $table->string('vehiculo_id');
            $table->foreignId('user_id')->constrained();
            $table->timestamps();

            $table->foreign('vehiculo_id')->references('placa')->on('vehiculos');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('secuencias');
    }
};
