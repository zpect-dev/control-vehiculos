<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Imports\VehiculosImport;
use Maatwebsite\Excel\Facades\Excel;

class ImportarVehiculos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:iv {archivo=vehiculos.xlsx}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $archivo = storage_path('app/' . $this->argument('archivo'));

        if (!file_exists($archivo)) {
            $this->error("Archivo no encontrado: {$archivo}");
            return 1;
        }

        try {
            Excel::import(new VehiculosImport, $archivo);
            $this->info('Importación completada exitosamente.');
        } catch (\Exception $e) {
            $this->error('Error durante la importación: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
