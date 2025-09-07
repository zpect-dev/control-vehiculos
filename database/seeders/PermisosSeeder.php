<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermisosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permisos = [
            'Titulo de vehiculo',
            'Carnet de cirulacion',
            'Seguro rcv',
            'Roct',
            'Permiso de rotulado regional',
            'Permiso de rotulado nacional',
            'Salvoconducto',
            'Permiso de circulacion de alimentos y medicamentos',
            'Trimestres',
        ];
        foreach ($permisos as $permiso) {
            DB::table('permisos')->insert([
                'permiso' => strtolower(str_replace(' ', '_', $permiso)),
            ]);
        }
    }
}
