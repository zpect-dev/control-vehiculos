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
    protected $description = 'Formatea los vehículos desde la tabla clientes';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Formateando vehículos...');

        $vehiculos = DB::table('clientes')
            ->select('co_cli', 'tipo', 'cli_des')
            ->where(function ($query) {
                $query->where('tipo', 'CARRO')
                      ->orWhere('tipo', 'MOTO');
            })
            ->whereNotIn('co_cli', ['00002040', 'PLANTA', 'A27BG3S'])
            ->get();

        foreach ($vehiculos as $vehiculo) {
            $placa = trim($vehiculo->co_cli);
            $tipo = trim($vehiculo->tipo);
            $modelo = trim($vehiculo->cli_des);

            $this->info("Vehículo: {$modelo}");

            $existe = DB::table('vehiculos')->where('placa', $placa)->exists();

            if ($existe) {
                DB::table('vehiculos')->where('placa', $placa)->update([
                    'tipo' => $tipo,
                    'modelo' => $modelo,
                ]);
            } else {
                DB::table('vehiculos')->insert([
                    'placa' => $placa,
                    'tipo' => $tipo,
                    'modelo' => $modelo,
                ]);
            }
        }

        $this->info('Vehículos formateados correctamente.');
    }
}
