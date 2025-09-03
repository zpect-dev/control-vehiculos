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
        Schema::create('tipo_cli', function (Blueprint $table) {
            $table->string('tip_cli')->primary();
            $table->string('des_tipo');
            $table->string('precio_a');
            $table->string('campo1');
            $table->string('campo2');
            $table->string('campo3');
            $table->string('campo4');
            $table->string('co_us_in');
            $table->dateTime('fe_us_in');
            $table->string('co_us_mo');
            $table->dateTime('fe_us_mo');
            $table->string('co_us_el');
            $table->dateTime('fe_us_el');
            $table->string('revisado');
            $table->string('trasnfe');
            $table->string('co_sucu');
            $table->uuid('rowguid');
            $table->timestamp('row_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tipo_cli');
    }
};
