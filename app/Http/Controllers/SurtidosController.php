<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Surtido;
use App\Models\User;
use App\Models\Vehiculo;
use App\Services\Gasolina;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SurtidosController extends Controller
{
    public function index(Request $request)
    {
        
        // $columnas = DB::connection('sqlsrv')
        //     ->select("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'factura'");

        // $columnas = array_map(fn($col) => $col->COLUMN_NAME, $columnas);

        // $clientes = DB::connection('sqlsrv')
        //     ->select("SELECT * FROM clientes");

        $columnas = DB::connection('sqlsrv')->select("
            SELECT COLUMN_NAME, COLUMN_DEFAULT
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = 'reng_fac'
        ");

        $defaults = collect($columnas)
            ->mapWithKeys(function ($col) {
                return [$col->COLUMN_NAME => $col->COLUMN_DEFAULT ?? null];
            })
            ->toArray();

        //dd($defaults);

        $profit = new Gasolina;
        //$profit->insertar_factura($validatedData['kilometraje'], $validatedData['observaciones'], $validatedData['precio'], $vehiculo->placa, $usuario->email, $request->user()->id, $surtido_ideal);
        $profit->insertar_factura(100, 'Prueba gasolina', 20, 10381528, '9338301', 'Juan Vargas', 19, 40);

        // while ($existe) {
        //     $nuevo++;
        //     $existe = DB::connection('sqlsrv')
        //         ->table('factura')
        //         ->where('fact_num', $nuevo)
        //         ->exists();
        // }


        // dd($clientes);

        // dd($columnas);
        $profit = new Gasolina;
        $co_ven = $profit->co_ven('16989183');
        $fact_num = $profit->fact_num();

        return Inertia::render('nombre_vista', [
            //'registros' => $registros,
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
        DB::beginTransaction();
        try {
            $validatedData = $request->validate([
                'tipo_surtido' => 'required|integer|in:1,2,3',
                'cant_litros' => 'required|numeric|min:0.1|max:1000',
                'kilometraje'=> 'required|numeric|min:0',
                'observaciones' => 'nullable',
                'precio' => 'required|numeric|min:0'
            ]);

            $UltimoSurtido = Surtido::where('vehiculo_id', $vehiculo->placa)->latest()->first();

            if($UltimoSurtido){
                $surtido_ideal = ($validatedData['kilometraje'] - $UltimoSurtido->kilometraje) * 0.35;
            }

            $usuario = $vehiculo->usuario();

            $profit = new Gasolina;
            $profit->insertar_factura($validatedData['kilometraje'], $validatedData['observaciones'], $validatedData['precio'], $vehiculo->placa, $usuario->email, $request->user()->name, $surtido_ideal, $validatedData['cant_litros']);
            //$profit->insertar_factura(100, 'Gasolina prueba', 20, 00002040, 20597875, 1, 19, 40);

            Surtido::create([
                'user_id' => $request->user()->id,
                'vehiculo_id' => $vehiculo->placa,
                'tipo_surtido' => $validatedData['tipo_surtido'],
                'cant_surtida' => $validatedData['cant_surtida'],
                'kilometraje' => $validatedData['kilometraje_inicial'],
                'surtido_ideal' => $surtido_ideal ?? null,
                'observaciones' => $validatedData['observaciones'],
                'precio' => $validatedData['precio']
            ]);

            DB::commit();
            return back()->with('success', 'Surtido realizado correctamente');

        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Error: '. $e->getMessage());
        }
    }
}
