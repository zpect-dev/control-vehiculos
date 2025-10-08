/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import FichaSeccion from '@/components/FichaSeccion';
import { fluidosSemanalFields } from '@/constants/formFields';
import AppLayout from '@/layouts/app-layout';
import type { RevisionSemanalProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function RevisionSemanal({ vehiculo, revisionSemanal, inicio, final }: RevisionSemanalProps) {
    const tipoVehiculo = vehiculo.tipo as 'CARRO' | 'MOTO';
    const fields = fluidosSemanalFields[tipoVehiculo];
    const placa = vehiculo.placa;
    const storageKey = `revisionSemanal-${placa}`;

    const [formData, setFormData] = useState<Record<string, any>>({});

    // Precargar datos desde localStorage o desde revisión semanal
    useEffect(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            setFormData(JSON.parse(saved));
        } else if (revisionSemanal) {
            const initial: Record<string, any> = {};
            revisionSemanal.forEach((item: any) => {
                initial[item.tipo] = item.observacion ?? '';
                initial[`${item.tipo}_archivo`] = null; // campo file vacío
                initial[`${item.tipo}_documento`] = item.imagen; // nombre del archivo anterior
            });
            setFormData(initial);
        }
    }, [placa, revisionSemanal]);

    // Guardar cambios en localStorage (excluyendo archivos)
    useEffect(() => {
        const sanitized = { ...formData };
        fields.forEach((field) => {
            if (field.type === 'file' && sanitized[field.id] instanceof File) {
                sanitized[field.id] = null;
            }
        });
        localStorage.setItem(storageKey, JSON.stringify(sanitized));
    }, [formData]);

    const handleFormSubmit = (formType: string, data: Record<string, any>, placa: string) => {
        const semanal: { tipo: string; imagen: File; observacion?: string }[] = [];

        fields.forEach((field) => {
            if (field.type === 'file') {
                const tipo = field.id.replace('_archivo', '');
                const imagen = data[field.id];
                const observacion = data[tipo];

                if (imagen instanceof File) {
                    semanal.push({ tipo, imagen, observacion });
                }
            }
        });

        router.post(
            `/fichaTecnica/${placa}/revisionSemanal`,
            { semanal },
            {
                preserveScroll: true,
                forceFormData: true,
                onSuccess: () => {
                    localStorage.removeItem(storageKey);
                    router.reload({ only: ['revisionSemanal'] });
                },
                onError: (errors) => {
                    console.error('Error al guardar revisión semanal:', errors);
                },
            },
        );
    };

    return (
        <AppLayout>
            <Head title={`Revisión Semanal - ${vehiculo.modelo}`} />
            <div className="min-h-screen bg-background px-4 py-10 font-sans dark:bg-gray-900">
                <div className="mb-5 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Revisión Semanal {vehiculo.modelo}</h1>
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

                    <div className="pb-4">
                        <div className="rounded-lg border bg-gray-100 p-4 shadow-md dark:bg-gray-700">
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
                    </div>

                    <FichaSeccion
                        title="Revisión Semanal"
                        fields={fields}
                        formType="semanal"
                        expediente={formData}
                        onChange={setFormData}
                        onSubmit={(data) => handleFormSubmit('semanal', data, placa)}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
