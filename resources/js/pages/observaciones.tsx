import ObservacionCard from '@/components/ObservacionesCard';
import AppLayout from '@/layouts/app-layout';
import { PagePropsObs } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import React from 'react';

export default function Observaciones() {
    const { vehiculo, observaciones, isAdmin } = usePage<PagePropsObs>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        observacion: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/observaciones/${vehiculo.placa}/save`, {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const resolverObservacion = (id: number) => {
        console.log('Marcando como resuelta la observación con ID:', id);

        router.patch(
            `/observaciones/${vehiculo.placa}/${id}/edit`,
            {
                resuelto: true,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    console.log('Observación marcada como resuelta con éxito');
                    router.reload({ only: ['observaciones'] });
                },
                onError: (error) => {
                    console.error('Error al resolver observación:', error);
                },
            },
        );
    };

    return (
        <AppLayout>
            <Head title={`Observaciones del Vehículo ${vehiculo.placa}`} />

            <div className="min-h-screen px-4 py-10 font-sans dark:bg-gray-900">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                        Observaciones del Vehículo {vehiculo.modelo} ({vehiculo.placa})
                    </h1>
                </div>

                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden border bg-gray-100 p-6 shadow-xl sm:rounded-lg dark:bg-gray-900">
                        <h2 className="mb-4 text-2xl font-bold">Agregar Observación</h2>

                        <form onSubmit={handleSubmit} className="mb-6">
                            <div className="mb-4">
                                <label htmlFor="observacion" className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
                                    Observación
                                </label>
                                <textarea
                                    id="observacion"
                                    value={data.observacion}
                                    onChange={(e) => setData('observacion', e.target.value)}
                                    className={`w-full rounded border px-3 py-2 shadow focus:outline-none ${
                                        errors.observacion ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    rows={3}
                                    maxLength={300}
                                    required
                                />
                                <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                    <span>{data.observacion.length}/300 caracteres</span>
                                    {errors.observacion && <span className="text-red-500">{errors.observacion}</span>}
                                </div>
                            </div>
                            <div className="flex items-center justify-end">
                                <button
                                    type="submit"
                                    className="mt-4 rounded-md bg-[#1a9888] px-4 py-2 text-sm font-semibold text-white hover:bg-[#188576]"
                                    disabled={processing}
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>

                        <h2 className="mb-4 text-2xl font-bold">Historial de Observaciones</h2>

                        {observaciones.length > 0 ? (
                            <div className="space-y-4">
                                {observaciones.map((obs) => (
                                    <ObservacionCard key={obs.id} observacion={obs} isAdmin={isAdmin} onResolver={resolverObservacion} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-10 text-center text-gray-500">No hay observaciones registradas para este vehículo.</div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
