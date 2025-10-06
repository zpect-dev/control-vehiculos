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
        Schema::table('vehiculos', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id_adicional_1')->nullable();
            $table->unsignedBigInteger('user_id_adicional_2')->nullable();
            $table->unsignedBigInteger('user_id_adicional_3')->nullable();

            $table->foreign('user_id_adicional_1')->on('users')->references('id')->onDelete('set null');
            $table->foreign('user_id_adicional_2')->on('users')->references('id')->onDelete('set null');
            $table->foreign('user_id_adicional_3')->on('users')->references('id')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehiculos', function (Blueprint $table) {
            $table->dropForeign(['user_id_adicional_1']);
            $table->dropForeign(['user_id_adicional_2']);
            $table->dropForeign(['user_id_adicional_3']);

            $table->dropColumn(['user_id_adicional_1', 'user_id_adicional_2', 'user_id_adicional_3']);
        });
    }
};
