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
        Schema::create('fotos_revision_semanal', function (Blueprint $table) {
            $table->id(); 
            $table->unsignedBigInteger('revision_semanal_id');
            $table->string('imagen');
            $table->string('tipo');
            $table->timestamps();

            $table->foreign('revision_semanal_id')->references('id')->on('revisiones_semanales')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fotos_revision_semanal');
    }
};
