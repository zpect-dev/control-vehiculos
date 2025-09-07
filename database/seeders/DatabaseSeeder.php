<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Vehiculo;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            EspecificacionesSeeder::class,
            PermisosSeeder::class,
            PiezasSeeder::class,
            AccesoriosSeeder::class,
        ]);
        User::factory(10)->create();
        Vehiculo::factory(100)->create();
    }
}
