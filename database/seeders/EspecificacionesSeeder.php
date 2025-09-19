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
        $especificaciones = [
            'Marca de aceite',
            'Marca de valvulina',
            'Marca de refrigerante',
            'Computadora bloqueada',
            'Tipo de frenos',
            'Tipo de distribucion de motor',
            'Sistema de enfriamiento',
            'Sistema de inyeccion',
            'Cauchos',
            'Kilometraje',
            'Tipo de motor',
            'Cilindrada',
        ];
        foreach ($especificaciones as $especificacion) {
            DB::table('especificaciones')->insert([
                'especificacion' => strtolower(str_replace(' ', '_', $especificacion)),
            ]);
        }
    }
}
