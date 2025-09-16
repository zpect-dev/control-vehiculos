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
        Schema::create('historial_asignaciones', function (Blueprint $table) {
            $table->id();
            $table->string('vehiculo_id');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('admin_id');
            $table->integer('kilometraje');
            $table->string('foto_kilometraje');
            $table->dateTime('fecha_asignacion')->useCurrent();

            $table->foreign('vehiculo_id')->references('placa')->on('vehiculos')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('admin_id')->references('id')->on('users')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historial_asignaciones');
    }
};
