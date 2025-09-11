/* eslint-disable @typescript-eslint/no-explicit-any */
import { router } from '@inertiajs/react';

export default function VehiculoCard({ vehiculo }: { vehiculo: any }) {
    return (
        <div
            className="group flex h-[200px] flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-md transition-transform duration-200 hover:scale-[1.02] dark:border-gray-700 dark:bg-gray-800"
            onClick={() => router.get(`/fichaTecnica/${vehiculo.placa}`)}
        >
            <div>
                <h2 className="text-lg font-semibold text-gray-800 transition-colors group-hover:text-[#49af4e] dark:text-white">
                    {vehiculo.modelo}
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Placa:</span> {vehiculo.placa}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Usuario:</span> {vehiculo.usuario?.name}
                </p>
            </div>

            <div className="mt-4 text-right">
                <span className="inline-block rounded-full bg-[#49af4e]/10 px-3 py-1 text-xs font-semibold text-[#49af4e]">Ver detalles</span>
            </div>
        </div>
    );
}
