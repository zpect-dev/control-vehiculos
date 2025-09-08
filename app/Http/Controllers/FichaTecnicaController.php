<?php

namespace App\Http\Controllers;

use App\Models\Vehiculo;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Services\ConsultaSQL;

class FichaTecnicaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $vehiculos = Vehiculo::where('user_id', $userId)->get();

        return Inertia::render('fichaTecnica', [
            'vehiculos' => $vehiculos
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $placa)
    {
        $consultaSQL = new ConsultaSQL();
        $userId = $request->user()->id;
        
        $vehiculo = $consultaSQL->obtenerExpediente($userId, $placa);

        return Inertia::render('fichaTecnica', [
            'vehiculo' => $vehiculo
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
