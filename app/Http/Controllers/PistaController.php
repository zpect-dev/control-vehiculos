<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PistaController extends Controller
{
    public function index()
    {
        $pistas = ActivityLog::latest()->get();
        return Inertia::render('pistas', [
            'pistas' => $pistas
        ]);
    }
}
