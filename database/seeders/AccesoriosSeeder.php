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
        $accesorios = [
            'Caja de herramientas',
            'Conos de seguridad',
            'Cuña',
            'Extintor',
            'Gato',
            'Llave de cruz',
        ];
        foreach ($accesorios as $accesorio) {
            DB::table('accesorios')->insert([
                'accesorio' => strtolower(str_replace(' ', '_', $accesorio)),
            ]);
        }
    }
}
