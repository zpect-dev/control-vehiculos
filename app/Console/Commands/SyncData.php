<?php

namespace App\Console\Commands;

use App\Services\SqlserverService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SyncData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sync-data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sincronizar datos de profit a control_vehiculos';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $sqlserverConnection = new SqlserverService();
        $conn = $sqlserverConnection->connect();

        $tablas = [
            'vendedor',
            'tipo_cli',
            'zona',
            'segmento',
            'cta_ingr',
            'clientes',
        ];

        foreach ($tablas as $tabla) {
            $pks = $sqlserverConnection->getPrimaryKeys($conn, $tabla);
            $sql = "SELECT * FROM {$tabla}";
            $stmt = sqlsrv_query($conn, $sql);

            if($stmt === false) {
                die(print_r(sqlsrv_errors(), true));
            }

            $registros = 0;

            while($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
                $registros++;
                foreach ($row as &$value) {
                    if (is_string($value)) {
                        $value = mb_convert_encoding($value, 'UTF-8', 'ISO-8859-1');
                    }
                }
                $where = [];
                foreach ($pks as $pk) {
                    $where[$pk] = $row[$pk] ?? null;
                }

                unset($row['row_id']);
                DB::connection('mysql')->table($tabla)->updateOrInsert(
                    $where,
                    $row
                );
            }
            $this->info("Registros procesados en {$tabla}: {$registros}");

            sqlsrv_free_stmt($stmt);
        }
        $sqlserverConnection->close($conn);
        $this->info('Sincronización completada exitosamente.');
    }
}