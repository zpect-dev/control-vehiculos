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
            $table->unsignedBigInteger('observacion_id')->nullable();
            $table->boolean('revisado')->default(0);
            $table->timestamps();

            $table->foreign('observacion_id')->references('id')->on('observaciones')->onUpdate('cascade')->onDelete('cascade');
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
