import CardRevisionSemanal from '@/components/CardRevisionSemanal';
import AppLayout from '@/layouts/app-layout';
import { RevisionSemanalProps } from '@/types';
import { Head } from '@inertiajs/react';

export default function RevisionSemanal({ vehiculo, revisionSemanal = null, inicio, final }: RevisionSemanalProps) {
    return (
        <AppLayout>
            <Head title={`Revisión Semanal - ${vehiculo.modelo}`} />
            <div className="min-h-screen bg-background px-4 py-10 font-sans dark:bg-gray-900">
                <div className="mb-5 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Revisión Semanal - {vehiculo.modelo}</h1>
                </div>

                <div className="mx-auto mb-10 max-w-5xl">
                    <div className="mb-4 flex justify-end gap-4 text-gray-700 dark:text-gray-200">
                        <p>
                            <span className="font-semibold">Desde:</span> {inicio}
                        </p>
                        <p>
                            <span className="font-semibold">Hasta:</span> {final}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Card de Detalles del Vehículo */}
                        <div className="rounded-lg bg-white border p-4 shadow-md dark:bg-gray-700">
                            <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Detalles del Vehículo</h3>
                            <div className="space-y-2 text-gray-700 dark:text-gray-300">
                                <p>
                                    <span className="font-semibold">Placa:</span> {vehiculo.placa}
                                </p>
                                <p>
                                    <span className="font-semibold">Modelo:</span> {vehiculo.modelo}
                                </p>
                                <p>
                                    <span className="font-semibold">Conductor:</span> {vehiculo.usuario?.name ?? 'Sin asignar'}
                                </p>
                            </div>
                        </div>

                        {/* Card de Revisión Semanal */}
                        <CardRevisionSemanal vehiculo={vehiculo} revisionSemanal={revisionSemanal} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
