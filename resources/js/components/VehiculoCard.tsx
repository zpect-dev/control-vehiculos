import { Vehiculo } from '@/types';
import { router } from '@inertiajs/react';

export default function VehiculoCard({ vehiculo }: { vehiculo: Vehiculo }) {
    const { observaciones_no_resueltas = 0 } = vehiculo;

    return (
        <div
            className="group flex h-[220px] flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-md transition duration-200 hover:shadow-lg hover:ring-2 hover:ring-[#49af4e] dark:border-gray-700 dark:bg-gray-800"
            onClick={() => router.get(`/fichaTecnica/${vehiculo.placa}`)}
        >
            <div className="flex items-center gap-4">
                {vehiculo.imagen_url && (
                    <img src={vehiculo.imagen_url} alt={`Vehículo ${vehiculo.modelo}`} className="h-16 w-16 rounded-md object-cover shadow-sm" />
                )}
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 group-hover:text-[#49af4e] dark:text-white">{vehiculo.modelo}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">Placa:</span> {vehiculo.placa}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">Usuario:</span> {vehiculo.usuario?.name || 'Sin asignar'}
                    </p>

                    {observaciones_no_resueltas > 0 && (
                        <div className="mt-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.get(`/fichaTecnica/${vehiculo.placa}/observaciones`);
                                }}
                                className="inline-block rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-700 hover:underline dark:bg-purple-800 dark:text-purple-300"
                            >
                                {observaciones_no_resueltas} observación
                                {observaciones_no_resueltas > 1 ? 'es' : ''} pendiente
                                {observaciones_no_resueltas > 1 ? 's' : ''}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 text-right">
                <span className="inline-block rounded-full bg-[#49af4e]/10 px-3 py-1 text-xs font-semibold text-[#49af4e]">Ver detalles</span>
            </div>
        </div>
    );
}
