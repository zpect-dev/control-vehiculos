<?php

namespace App\Http\Controllers;

use App\Models\Vehiculo;
use Illuminate\Http\Request;

class VehiculoController extends Controller
{
    public function edit(Request $request, Vehiculo $vehiculo){

        if (!$request->user()->hasRole('admin')) {
            return redirect('dashboard');
        }

        return view('vehiculos.edit');
    }

    public function update(Request $request, Vehiculo $vehiculo){
        if(!$request->user()->hasRole('admin')){
            return redirect('dashboard');
        }

        
    }
}
