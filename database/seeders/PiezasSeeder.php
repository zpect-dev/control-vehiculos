<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PiezasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('piezas')->insert([
            'pieza' => 'Aire acondicionado',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Caja de herramientas',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Caucho delantero derecho',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Caucho delantero izquierdo',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Caucho trasero derecho',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Caucho trasero izquierdo',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Cepillos limpia parabrisas',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Cerradura de puertas',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Cinturón de seguridad',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Conos de seguridad',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Cuña',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Espejo interior cabina',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Espejo retrovisor derecho',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Espejo retrovisor izquierdo',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Estado de la bateria',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Estado de los bornes',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Estado de la carroceria',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Estado del parachoque',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Estado de pintura',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Estado de guardapolvo',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Estado de recipientes de fluidos',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Estado de sistema de enfriamiento',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Extintor',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Gato',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Gomas de puertas',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Linterna',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Llave de cruz',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Luces de cruce delantera',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Luces de cruce trasera',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Luces de freno',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Luces de neblina',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Luces de retroceso',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Luces delanteras altas',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Luces delanteras bajas',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Luces intermitentes delanteras',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Luces intermitentes traseras',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Luces internas',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Luces testigo',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Luces traseras',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Manija abre puertas',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Manija eleva vidrios',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Nivel de aceite',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Nivel de hidraulico caja',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Nivel de hidraulico direccion',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Nivel de refrigerante',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Nivel y estado de liga',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Claxon',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Caucho de repuesto',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Revision de esparragos',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Tablero',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Tapetes pisos',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Tapiceria',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Vidrios laterales delanteros',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Vidrios laterales traseros',
        ]);
        DB::table('piezas')->insert([
            'pieza' => 'Vidrios traseros',
        ]);
    }
}
