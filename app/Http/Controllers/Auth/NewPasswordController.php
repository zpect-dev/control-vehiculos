<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class NewPasswordController extends Controller
{
    public function index()
    {
        return Inertia::render('auth/recuperar');
    }

    public function actualizar(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|numeric:' . User::class,
            'password' => ['required', Rules\Password::defaults()],
        ], [
            'email.required' => 'La cédula es obligatoria.',
            'email.numeric' => 'La cédula debe contener solo números.',
            'password.required' => 'La contraseña es obligatoria.',
        ]);

        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        Auth::login($user);

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
