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
        Schema::create('revisiones_semanales', function (Blueprint $table) {
            $table->id();
            $table->string('vehiculo_id');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('observaciones');
            $table->string('video');
            $table->dateTime('fecha_creacion')->useCurrent();
            $table->boolean('revisado')->default(false);
            $table->dateTime('fecha_revision')->nullable();

            $table->foreign('vehiculo_id')->references('placa')->on('vehiculos')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('revisiones_semanales');
    }
};
