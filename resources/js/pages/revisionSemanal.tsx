/* eslint-disable @typescript-eslint/no-explicit-any */
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import CardRevisionSemanal from '@/components/CardRevisionSemanal';
import FichaSeccion from '@/components/FichaSeccion';
import { fluidosSemanalFields } from '@/constants/formFields';
import type { RevisionSemanalProps } from '@/types';

export default function RevisionSemanal({
    vehiculo,
    revisionSemanal = null,
    inicio,
    final,
}: RevisionSemanalProps) {
    const tipoVehiculo = vehiculo.tipo as 'CARRO' | 'MOTO';
    const fields = fluidosSemanalFields[tipoVehiculo];
    const placa = vehiculo.placa;

    const handleFormSubmit = (
        formType: string,
        formData: Record<string, any>,
        placa: string
    ) => {
        const semanal: { tipo: string; imagen: File; observacion?: string }[] = [];

        fields.forEach((field) => {
            if (field.type === 'file') {
                const tipo = field.id.replace('_archivo', '');
                const imagen = formData[field.id];
                const observacion = formData[tipo];

                if (imagen instanceof File) {
                    semanal.push({ tipo, imagen, observacion });
                }
            }
        });

        console.log(semanal)

        router.post(`/fichaTecnica/${placa}/revisionSemanal`, { semanal }, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                router.reload({ only: ['revisionSemanal'] });
            },
            onError: (errors) => {
                console.error('Error al guardar revisión semanal:', errors);
            },
        });
    };

    return (
        <AppLayout>
            <Head title={`Revisión Semanal - ${vehiculo.modelo}`} />
            <div className="min-h-screen bg-background px-4 py-10 font-sans dark:bg-gray-900">
                <div className="mb-5 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Revisión Semanal {vehiculo.modelo}
                    </h1>
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
                            <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                                Detalles del Vehículo
                            </h3>
                            <div className="space-y-2 text-gray-700 dark:text-gray-300">
                                <p>
                                    <span className="font-semibold">Placa:</span> {vehiculo.placa}
                                </p>
                                <p>
                                    <span className="font-semibold">Modelo:</span> {vehiculo.modelo}
                                </p>
                                <p>
                                    <span className="font-semibold">Conductor:</span>{' '}
                                    {vehiculo.usuario?.name ?? 'Sin asignar'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {revisionSemanal ? (
                        <CardRevisionSemanal
                            vehiculo={vehiculo}
                            revisionSemanal={revisionSemanal}
                        />
                    ) : (
                        <FichaSeccion
                            title="Revisión Semanal"
                            fields={fields}
                            formType="semanal"
                            expediente={{}}
                            onSubmit={(data) => handleFormSubmit('semanal', data, placa)}
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
