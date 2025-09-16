<?php

namespace App\Http\Controllers;

use App\Models\Vehiculo;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class VehiculoController extends Controller
{
    public function edit(Request $request, Vehiculo $vehiculo)
    {
        return view('vehiculos.edit');
    }

    public function update(Request $request, Vehiculo $vehiculo){
        $validatedData = $request->validate([
            'placa' => ['sometimes', 'required', 'string', Rule::unique('vehiculos')->ignore($vehiculo)],
            'tipo' => 'sometimes|required|string|in:CARRO,MOTO',
            'modelo' => 'sometimes|required|string',
            'ubicacion' => 'sometimes|required|string'
        ]);

        $vehiculo->update($validatedData);

        return back()->with('flash', 'Vehiculo actualizado correctamente');
    }
}
