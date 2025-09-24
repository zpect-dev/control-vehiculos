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
        Schema::create('auditoria_renglones', function (Blueprint $table) {
            $table->id();
            $table->string('fact_num');
            $table->integer('reng_num');
            $table->string('co_art');
            $table->decimal('total_art', 10, 2);
            $table->decimal('reng_neto', 10, 2);
            $table->string('imagen');
            $table->timestamps();

            $table->foreign('admin_id')->references('id')->on('users');
            $table->foreign('fact_num')->references('fact_num')->on('auditoria_facturas');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('auditoria_renglones');
    }
};
