<?php

use App\Http\Controllers\GeneralController;
use App\Http\Controllers\SemanalController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('general', [GeneralController::class, 'index'])->name('general');
    Route::post('general', [GeneralController::class, 'store'])->name('general.store');

    Route::get('diario', function () {
        return Inertia::render('diario');
    })->name('diario');

    Route::get('fluidos', function () {
        return Inertia::render('fluidos');
    })->name('fluidos');

    Route::get('semanal', [SemanalController::class, 'index'])->name('semanal');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
