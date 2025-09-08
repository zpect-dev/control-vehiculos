<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RevisionDiariaController extends Controller
{
    public function index()
    {
        return inertia('revisionFluidos');
    }

    public function store(Request $request, string $placa)
    {
        
    }
}
