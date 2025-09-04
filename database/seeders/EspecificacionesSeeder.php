<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Stringable;

class EspecificacionesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('especificaciones')->insert([
            'especificacion' => 'Marca de aceite',
        ]);
        DB::table('especificaciones')->insert([
            'especificacion' => 'Marca de valvulina',
        ]);
        DB::table('especificaciones')->insert([
            'especificacion' => 'Marca de refrigerante',
        ]);
        DB::table('especificaciones')->insert([
            'especificacion' => 'Computadora bloqueada (Tiene o no tiene inmovilizador)',
        ]);
        DB::table('especificaciones')->insert([
            'especificacion' => 'Tipo de frenos',
        ]);
        DB::table('especificaciones')->insert([
            'especificacion' => 'Tipo de distribucion de motor (Cadena o correa)',
        ]);
        DB::table('especificaciones')->insert([
            'especificacion' => 'Sistema de enfriamiento',
        ]);
        DB::table('especificaciones')->insert([
            'especificacion' => 'Sistema de inyeccion (Carburado o inyeccion)',
        ]);
        DB::table('especificaciones')->insert([
            'especificacion' => 'Cauchos (Marca y medida)',
        ]);
        DB::table('especificaciones')->insert([
            'especificacion' => 'Kilometraje',
        ]);
    }
}
