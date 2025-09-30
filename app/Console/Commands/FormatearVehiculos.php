<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class FormatearVehiculos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:fv';

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
        $this->info('Formateando vehículos...');

        $vehiculos = DB::table('clientes')->select('co_cli', 'tipo', 'cli_des')->where('tipo', 'CARRO')->orWhere('tipo', 'MOTO')->get();
        
        foreach($vehiculos as $vehiculo){
            $this->info("Vehículo: {$vehiculo->cli_des}");
            DB::table('vehiculos')->createOrUpdate([
                'placa' => trim($vehiculo->co_cli),
                'tipo' => trim($vehiculo->tipo),
                'modelo' => trim($vehiculo->cli_des)
            ]);
        }
    }
}
