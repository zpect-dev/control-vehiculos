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
        Schema::create('auditoria_facturas', function (Blueprint $table) {
            $table->id();
            $table->string('fact_num');
            $table->string('vehiculo_id');
            $table->foreignId('user_id')->constrained();
            $table->unsignedBigInteger('admin_id')->nullable();
            $table->text('observaciones_res')->nullable();
            $table->text('observaciones_admin')->nullable();
            $table->boolean('aprobado')->default(false);
            $table->boolean('cubre')->default(false);
            $table->timestamps();

            $table->foreign('vehiculo_id')->references('placa')->on('vehiculos');
            $table->foreign('admin_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('auditoria_facturas');
    }
};
