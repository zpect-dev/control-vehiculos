<?php

namespace App\Helpers;

use Illuminate\Http\RedirectResponse;

class FlashHelper
{
    /**
     * Ejecuta una acción y retorna un redirect con mensaje flash.
     */
    public static function try(callable $callback, string $successMsg, string $errorMsg = 'Ocurrió un error inesperado.'): RedirectResponse
    {
        try {
            $callback();
            return back()->with('success', $successMsg);
        } catch (\Throwable $e) {
            report($e);
            return back()->with('error', $errorMsg);
        }
    }
}
