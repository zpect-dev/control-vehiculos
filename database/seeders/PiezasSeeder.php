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
        $piezas = [
            'Aire acondicionado',
            'Caja de herramientas',
            'Caucho delantero derecho',
            'Caucho delantero izquierdo',
            'Caucho trasero derecho',
            'Caucho trasero izquierdo',
            'Cepillos limpia parabrisas',
            'Cerradura de puertas',
            'Cinturón de seguridad',
            'Conos de seguridad',
            'Cuña',
            'Espejo interior cabina',
            'Espejo retrovisor derecho',
            'Espejo retrovisor izquierdo',
            'Estado de la bateria',
            'Estado de los bornes',
            'Estado de la carroceria',
            'Estado del parachoque',
            'Estado de pintura',
            'Estado de guardapolvo',
            'Estado de recipientes de fluidos',
            'Estado de sistema de enfriamiento',
            'Extintor',
            'Gato',
            'Gomas de puertas',
            'Linterna',
            'Llave de cruz',
            'Luces de cruce delantera',
            'Luces de cruce trasera',
            'Luces de freno',
            'Luces de neblina',
            'Luces de retroceso',
            'Luces delanteras altas',
            'Luces delanteras bajas',
            'Luces intermitentes delanteras',
            'Luces intermitentes traseras',
            'Luces internas',
            'Luces testigo',
            'Luces traseras',
            'Manija abre puertas',
            'Manija eleva vidrios',
            'Nivel de aceite',
            'Nivel de hidraulico caja',
            'Nivel de hidraulico direccion',
            'Nivel de refrigerante',
            'Nivel y estado de liga',
            'Claxon',
            'Caucho de repuesto',
            'Revision de esparragos',
            'Tablero',
            'Tapetes pisos',
            'Tapiceria',
            'Vidrios laterales delanteros',
            'Vidrios laterales traseros',
            'Vidrios traseros',
        ];
        foreach ($piezas as $pieza) {
            DB::table('piezas')->insert([
                'pieza' => strtolower(str_replace(' ', '_', $pieza)),
            ]);
        }
    }
}
