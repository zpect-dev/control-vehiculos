<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\FichaTecnicaController;
use App\Http\Controllers\RevisionSemanalController;

Route::get('/', function () {
    return Auth::check()
        ? redirect()->route('fichaTecnica')
        : Inertia::render('auth/login');
})->name('home');

// Rutas protegidas

Route::middleware(['auth', 'verified'])->group(function () {

    // FichaTecnica
    Route::get('fichaTecnica', [FichaTecnicaController::class, 'index'])->name('fichaTecnica');
    Route::post('fichaTecnica', [FichaTecnicaController::class, 'store'])->name('fichaTecnica.store');

    // RevisionFluidos
    Route::get('revisionFluidos', function () {
        return Inertia::render('revisionFluidos');
    })->name('revisionFluidos');

    // RevisionSemanal
    Route::get('revisionSemanal', [RevisionSemanalController::class, 'index'])->name('revisionSemanal');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
