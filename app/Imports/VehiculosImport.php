<?php

namespace App\Imports;

use App\Models\Vehiculo;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class VehiculosImport implements ToModel, WithHeadingRow
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        return Vehiculo::updateOrCreate(
            ['placa' => $row['placa']],
            [
                'modelo'    => $row['modelo'],
                'ubicacion' => $row['ubicacion'],
                'tipo'      => $row['tipo'],
            ]
        );
    }
}
