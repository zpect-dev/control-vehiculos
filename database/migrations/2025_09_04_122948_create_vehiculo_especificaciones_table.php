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
        Schema::create('vehiculo_especificaciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('vehiculo_id');
            $table->foreignId('especificacion_id')->constrained('especificaciones')->onDelete('cascade');
            $table->string('estado');
            $table->dateTime('fecha_verificacion')->useCurrent();

            $table->foreign('vehiculo_id')->references('placa')->on('vehiculos')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehiculo_especificaciones');
    }
};
