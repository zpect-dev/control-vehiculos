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
        Schema::create('surtidos', function (Blueprint $table) {
            $table->id();
            $table->string('vehiculo_id');
            $table->foreignId('user_id')->constrained()->onUpdate('cascade')->onDelete('cascade');
            $table->decimal('cant_litros', 8, 2);
            $table->bigInteger('kilometraje');
            $table->decimal('surtido_ideal', 8, 2)->nullable();
            $table->text('observaciones')->nullable();
            $table->decimal('precio', 10, 2);
            $table->timestamps();

            $table->foreign('vehiculo_id')->references('placa')->on('vehiculos')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('surtidos');
    }
};
