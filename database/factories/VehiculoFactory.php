<?php

namespace Database\Factories;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Vehiculo>
 */
class VehiculoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'placa' => 'M-' . rand(100000, 999999),
            'tipo' => rand(0, 1) ? 'CARRO' : 'MOTO',
            'modelo' => fake()->name(),
            'user_id' => rand(1, 2),
        ];
    }
}
