<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;

class AdminRoleSeeder extends Seeder
{
    public function run(): void
    {
        // Crear el rol si no existe
        $adminRole = Role::firstOrCreate(['name' => 'admin']);

        // Buscar el usuario por ID, correo o cualquier criterio
        $adminUser = User::where('email', '29960819')->first();

        if ($adminUser) {
            $adminUser->assignRole($adminRole);
        }
    }
}
