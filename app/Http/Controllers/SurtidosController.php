<?php

namespace App\Http\Controllers;

use App\Models\Surtido;
use App\Models\Vehiculo;
use App\Services\Gasolina;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SurtidosController extends Controller
{
    public function index(Request $request)
    {
        $registros = Surtido::latest()->paginate(50);

        return Inertia::render('nombre_vista', [
            'registros' => $registros,
        ]);
    }

    public function show(Request $request, Vehiculo $vehiculo)
    {
        $registros = Surtido::where('vechiculo_id', $vehiculo->placa)->latest()->paginate(50);

        return Inertia::render('nombre_vista', [
            'registros' => $registros
        ]);
    }

    public function store(Request $request, Vehiculo $vehiculo)
    {
        $validatedData = $request->validate([
            'tipo_surtido' => 'required|integer|in:1,2,3',
            'cant_surtida' => 'required|numeric|min:0.1|max:1000',
            'kilometraje_inicial'=> 'required|numeric|min:0',
            'observaciones' => 'nullable',
            'precio' => 'required|numeric|min:0'
        ]);

        $UltimoSurtido = Surtido::where('vehiculo_id', $vehiculo->placa)->latest()->first();

        if(!$UltimoSurtido){
            $gasolina = new Gasolina;
            $UltimoSurtido->kilometraje_final = $validatedData['kilometraje_inicial'];
            $UltimoSurtido->kilometraje_estimado = $gasolina->kilometrajeEstimado($vehiculo->placa);

            //dd($UltimoSurtido->kilometraje_estimado);
            $UltimoSurtido->save();
        }

        $respuesta = Surtido::create([
            'user_id' => $request->user()->id,
            'vehiculo_id' => $vehiculo->placa,
            'tipo_surtido' => $validatedData['tipo_surtido'],
            'cant_surtida' => $validatedData['cant_surtida'],
            'kilometraje_inicial' => $validatedData['kilometraje_inicial'],
            'observaciones' => $validatedData['observaciones'],
            'precio' => $validatedData['precio']
        ]);

        if(!$respuesta){
            return back()->with('error', 'Error al realizar el surtido');
        }

        return back()->with('success', 'Surtido realizado correctamente');
    }

    public function auditoria(Request $request, Vehiculo $vehiculo)
    {

    }
}
