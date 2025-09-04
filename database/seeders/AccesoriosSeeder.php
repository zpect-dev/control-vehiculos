<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AccesoriosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('accesorios')->insert([
            'accesorio' => 'Caja de herramientas',
        ]);
        DB::table('accesorios')->insert([
            'accesorio' => 'Conos de seguridad',
        ]);
        DB::table('accesorios')->insert([
            'accesorio' => 'Cuña',
        ]);
        DB::table('accesorios')->insert([
            'accesorio' => 'Extintor',
        ]);
        DB::table('accesorios')->insert([
            'accesorio' => 'Gato',
        ]);
        DB::table('accesorios')->insert([
            'accesorio' => 'Llave de cruz',
        ]);
    }
}
