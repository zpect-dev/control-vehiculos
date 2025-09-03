<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClientesTable extends Migration
{
    public function up()
    {
        Schema::create('clientes', function (Blueprint $table) {
            $table->string('co_cli')->primary();
            $table->string('tipo');
            $table->string('cli_des');
            $table->text('direc1');
            $table->string('direc2');
            $table->string('telefonos');
            $table->string('fax');
            $table->boolean('inactivo');
            $table->text('comentario');
            $table->string('respons');
            $table->dateTime('fecha_reg');
            $table->integer('puntaje');
            $table->float('saldo');
            $table->float('saldo_ini');
            $table->integer('fac_ult_ve');
            $table->dateTime('fec_ult_ve');
            $table->decimal('net_ult_ve');
            $table->decimal('mont_cre');
            $table->integer('plaz_pag');
            $table->decimal('desc_ppago');
            $table->string('co_zon');
            $table->string('co_seg');
            $table->string('co_ven');
            $table->decimal('desc_glob');
            $table->string('horar_caja');
            $table->string('frecu_vist');
            $table->boolean('lunes');
            $table->boolean('martes');
            $table->boolean('miercoles');
            $table->boolean('jueves');
            $table->boolean('viernes');
            $table->boolean('sabado');
            $table->boolean('domingo');
            $table->text('dir_ent2');
            $table->string('tipo_iva');
            $table->decimal('iva');
            $table->string('rif');
            $table->boolean('contribu');
            $table->text('dis_cen');
            $table->string('nit');
            $table->string('email');
            $table->string('co_ingr');
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
            $table->boolean('juridico');
            $table->decimal('tipo_adi');
            $table->string('matriz');
            $table->integer('co_tab');
            $table->string('tipo_per');
            $table->string('serialp');
            $table->boolean('valido');
            $table->timestamp('row_id')->nullable();
            $table->string('estado');
            $table->integer('Id');
            $table->string('co_pais');
            $table->string('ciudad');
            $table->string('zip');
            $table->string('login');
            $table->string('password');
            $table->string('website');
            $table->string('salestax');
            $table->boolean('sincredito');
            $table->float('porc_esp');
            $table->boolean('contribu_e');

            $table->foreign('co_zon')->references('co_zon')->on('zona')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('co_seg')->references('co_seg')->on('segmento')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('co_ven')->references('co_ven')->on('vendedor')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('co_ingr')->references('co_ingr')->on('cta_ingr')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('tipo')->references('tip_cli')->on('tipo_cli')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('clientes');
    }
}