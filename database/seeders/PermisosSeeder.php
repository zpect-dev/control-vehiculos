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
        DB::table('permisos')->insert([
            'permiso' => 'Titulo de vehiculo',
        ]);
        DB::table('permisos')->insert([
            'permiso' => 'Carnet de cirulacion',
        ]);
        DB::table('permisos')->insert([
            'permiso' => 'Seguro rcv',
        ]);
        DB::table('permisos')->insert([
            'permiso' => 'Roct',
        ]);
        DB::table('permisos')->insert([
            'permiso' => 'Permiso de rotulado regional',
        ]);
        DB::table('permisos')->insert([
            'permiso' => 'Permiso de rotulado nacional',
        ]);
        DB::table('permisos')->insert([
            'permiso' => 'Salvoconducto',
        ]);
        DB::table('permisos')->insert([
            'permiso' => 'Permiso de circulacion de alimentos y medicamentos',
        ]);
        DB::table('permisos')->insert([
            'permiso' => 'Trimestres',
        ]);
    }
}
