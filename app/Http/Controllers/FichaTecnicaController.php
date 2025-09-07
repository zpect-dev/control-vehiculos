<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Vehiculo;
use Illuminate\Http\Request;
use App\Services\ConsultaSQL;

class FichaTecnicaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $consultaSQL = new ConsultaSQL();
        $userId = $request->user()->id;
        
        $vehiculos = $consultaSQL->obtenerExpediente($userId, $placa = 'M-109911');
        //dd($vehiculos);
        
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
    public function show(string $id)
    {
        //
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
