/* eslint-disable @typescript-eslint/no-explicit-any */
// components/VehiculoCard.tsx
import { router } from '@inertiajs/react';

export default function VehiculoCard({ vehiculo }: { vehiculo: any }) {
    return (
        <div
            className="cursor-pointer rounded-xl border bg-white p-4 shadow transition hover:scale-[1.02]"
            onClick={() => router.get(`/fichaTecnica/${vehiculo.placa}`)}
        >
            <h2 className="text-xl font-bold text-gray-800">{vehiculo.modelo}</h2>
            <p className="text-sm text-gray-600">Placa: {vehiculo.placa}</p>
            <p className="text-sm text-gray-600">Usuario: {vehiculo.usuario?.name}</p>
        </div>
    );
}
