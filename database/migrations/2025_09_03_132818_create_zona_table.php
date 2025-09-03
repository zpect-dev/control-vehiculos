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
        Schema::create('zona', function (Blueprint $table) {
            $table->string('co_zon')->primary();
            $table->string('zon_des');
            $table->string('dis_cen');
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
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('zona');
    }
};
