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
        Schema::create('vendedor', function (Blueprint $table) {
            $table->string('co_ven')->primary();
            $table->string('tipo');
            $table->string('ven_des');
            $table->string('dis_cen');
            $table->string('cedula');
            $table->string('direc1');
            $table->string('direc2');
            $table->string('telefonos');
            $table->dateTime('fecha_reg');
            $table->integer('condic');
            $table->float('comision');
            $table->string('comen');
            $table->integer('fun_cob');
            $table->integer('fun_ven');
            $table->float('comisionv');
            $table->integer('fac_ult_ve');
            $table->dateTime('fec_ult_ve');
            $table->float('net_ult_ve');
            $table->string('cli_ult_ve');
            $table->string('cta_contab');
            $table->string('campo1');
            $table->string('campo2');
            $table->string('campo3');
            $table->string('campo4');
            $table->string('campo5');
            $table->string('campo6');
            $table->string('campo7');
            $table->string('campo8');
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
            $table->string('login');
            $table->string('password');
            $table->string('email');
            $table->string('PSW_M');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendedor');
    }
};
