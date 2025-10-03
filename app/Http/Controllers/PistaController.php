<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PistaController extends Controller
{
    public function index()
    {
        $pistas = ActivityLog::all();

        return Inertia::render('nombre_vista', [
            'pistas' => $pistas
        ]);
    }
}
