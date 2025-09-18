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
        Schema::table('users', function (Blueprint $table) {
            $table->string('zona')->nullable();
            $table->string('foto_cedula')->nullable();
            $table->date('vencimiento_cedula')->nullable();
            $table->string('foto_licencia')->nullable();
            $table->date('vencimiento_licencia')->nullable();
            $table->string('foto_certificado_medico')->nullable();
            $table->date('vencimiento_certificado_medico')->nullable();
            $table->string('foto_seguro_civil')->nullable();
            $table->date('vencimiento_seguro_civil')->nullable();
            $table->string('foto_carnet_circulacion')->nullable();
            $table->date('vencimiento_carnet_circulacion')->nullable();
            $table->string('foto_solvencia')->nullable();
            $table->date('vencimiento_solvencia')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('zona');
            $table->dropColumn('foto_cedula');
            $table->dropColumn('vencimiento_cedula');
            $table->dropColumn('foto_licencia');
            $table->dropColumn('vencimiento_licencia');
            $table->dropColumn('foto_certificado_medico');
            $table->dropColumn('vencimiento_certificado_medico');
            $table->dropColumn('foto_seguro_civil');
            $table->dropColumn('vencimiento_seguro_civil');
            $table->dropColumn('foto_carnet_circulacion');
            $table->dropColumn('vencimiento_carnet_circulacion');
            $table->dropColumn('foto_solvencia');
            $table->dropColumn('vencimiento_solvencia');
        });
    }
};
