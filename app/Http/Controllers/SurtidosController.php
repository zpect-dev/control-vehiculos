<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Surtido;
use App\Models\User;
use App\Models\Vehiculo;
use App\Services\Gasolina;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Ramsey\Uuid\Uuid;


class SurtidosController extends Controller
{
    public function test(Request $request)
    {
        // $row = (string) Uuid::uuid4();
        // dd($row);
        $profit = new Gasolina;
        $respuesta = $profit->registrarFacturaConRenglon(100, 'Prueba gasolina', 20, 10381528, '9338301', 'Juan Vargas', 19, 40);
        dd($respuesta);
    }

    public function index(Request $request, Vehiculo $vehiculo)
    {
        $vehiculo->load('usuario');

        $registros = Surtido::where('vehiculo_id', $vehiculo->placa)->latest()->paginate(10);

        return Inertia::render('gasolina', [
            'vehiculo' => [
                'placa' => $vehiculo->placa,
                'modelo' => $vehiculo->modelo,
                'usuario' => [
                    'name' => optional($vehiculo->usuario)->name,
                ],
            ],
            'registros' => $registros,
        ]);
    }


    public function store(Request $request, Vehiculo $vehiculo)
    {
        DB::beginTransaction();
        try {
            $validatedData = $request->validate([
                //'tipo_surtido' => 'required|integer|in:1,2,3',
                'cant_litros' => 'required|numeric|min:0.1|max:1000',
                'kilometraje' => 'required|numeric|min:0',
                'observaciones' => 'nullable',
                'precio' => 'required|numeric|min:0'
            ]);
            
            $UltimoSurtido = Surtido::where('vehiculo_id', $vehiculo->placa)->latest()->first();

            $surtido_ideal = $UltimoSurtido ? ($validatedData['kilometraje'] - $UltimoSurtido->kilometraje) * 0.35 : 'N/A';

            $usuario = User::find($vehiculo->user_id);
            $profit = new Gasolina;
            //$fact_num = $profit->registrarFacturaConRenglon($validatedData['kilometraje'], $validatedData['observaciones'], $validatedData['precio'], $vehiculo->placa, $usuario->email, $request->user()->name, $surtido_ideal, $validatedData['cant_litros']);
            $fact_num = $profit->registrarFacturaConRenglon($validatedData['kilometraje'], $validatedData['observaciones'], $validatedData['precio'], '10150838', $usuario->email, $request->user()->name, $surtido_ideal, $validatedData['cant_litros']);
            
            if (!is_numeric($fact_num)) {
                throw new \Exception('No se pudo generar el número de factura');
            }

            Surtido::create([
                'user_id' => $request->user()->id,
                'vehiculo_id' => $vehiculo->placa,
                'fact_num' => $fact_num,
                //'tipo_surtido' => $validatedData['tipo_surtido'],
                'cant_litros' => $validatedData['cant_litros'],
                'kilometraje' => $validatedData['kilometraje'],
                'surtido_ideal' => $surtido_ideal ?? null,
                'observaciones' => $validatedData['observaciones'] ?? null,
                'precio' => $validatedData['precio']
            ]);

            DB::commit();
            return back()->with('success', 'Surtido realizado correctamente');
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Error: ' . $e->getMessage());
        }
    }
}
