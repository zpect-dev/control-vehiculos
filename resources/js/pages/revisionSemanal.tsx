/* eslint-disable @typescript-eslint/no-explicit-any */
import FichaSeccion from '@/components/FichaSeccion';
import { cheyenneTritonFields } from '@/constants/cheyenneTritonFields';
import { fluidosSemanalFields } from '@/constants/fluidosSemanalFields';
import { sparkPeugeotFields } from '@/constants/sparkPeugeotFields';
import AppLayout from '@/layouts/app-layout';
import type { Field } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type FormularioGrupo = 'SPARK_PEUGEOT' | 'CHEYENNE_TRITON' | 'MOTO';

export default function RevisionSemanal() {
    const { vehiculo, revisiones, inicio, final } = usePage<{
        vehiculo: { tipo: 'CARRO' | 'MOTO'; modelo: string; placa: string };
        revisiones: {
            id: number;
            tipo_formulario: number;
            observacion?: { observacion: string };
            imagenes: { tipo: string; imagen: string }[];
            created_at: string;
        }[];
        inicio: string;
        final: string;
    }>().props;

    const tipoVehiculo = vehiculo.tipo;
    const placa = vehiculo.placa;

    const [formularioSeleccionado, setFormularioSeleccionado] = useState<FormularioGrupo | null>(null);
    const [formData, setFormData] = useState<Record<string, any>>({});

    useEffect(() => {
        if (tipoVehiculo === 'MOTO') {
            setFormularioSeleccionado('MOTO');
        }
    }, [tipoVehiculo]);

    const handleFormSubmit = (formType: string, data: Record<string, any>, placa: string) => {
        const semanal: { tipo: string; imagen: File }[] = [];
        const tipoFormulario = formularioSeleccionado === 'SPARK_PEUGEOT' ? 1 : formularioSeleccionado === 'CHEYENNE_TRITON' ? 2 : formularioSeleccionado === 'MOTO' ? 3 : null;

        const baseFields: Field[] =
            formularioSeleccionado === 'MOTO'
                ? fluidosSemanalFields['MOTO']
                : formularioSeleccionado === 'SPARK_PEUGEOT'
                ? sparkPeugeotFields['CARRO']
                : cheyenneTritonFields['CARRO'];

        baseFields.forEach((field) => {
            if (field.type === 'file') {
                const imagen = data[field.id];
                if (imagen instanceof File) {
                    semanal.push({ tipo: field.id, imagen });
                }
            }
        });

        const observacionGeneral = data['observacion_general'];

        router.post(
            `/fichaTecnica/${placa}/revisionSemanal`,
            {
                tipo_formulario: tipoFormulario,
                semanal,
                observacion: observacionGeneral,
            },
            {
                preserveScroll: true,
                forceFormData: true,
                onSuccess: () => router.reload({ only: ['revisiones'] }),
            },
        );
    };

    const renderFichaFromRevision = (revision: any, index: number) => {
        const tipoFormulario =
            revision.tipo_formulario === 1
                ? 'SPARK_PEUGEOT'
                : revision.tipo_formulario === 2
                ? 'CHEYENNE_TRITON'
                : 'MOTO';

        const baseFields: Field[] =
            tipoFormulario === 'MOTO'
                ? fluidosSemanalFields['MOTO']
                : tipoFormulario === 'SPARK_PEUGEOT'
                ? sparkPeugeotFields['CARRO']
                : cheyenneTritonFields['CARRO'];

        const hasObservacion = baseFields.some((f) => f.id === 'observacion_general');
        const fields: Field[] = hasObservacion
            ? baseFields
            : [...baseFields, { id: 'observacion_general', label: 'Observación general', type: 'textarea', required: false }];

        const expediente: Record<string, any> = {};
        revision.imagenes.forEach((img: any) => {
            expediente[img.tipo] = img.imagen;
        });
        if (revision.observacion?.observacion) {
            expediente['observacion_general'] = revision.observacion.observacion;
        }

        return (
            <FichaSeccion
                key={revision.id}
                title={`Revisión #${index + 1} (${tipoFormulario}) - ${new Date(revision.created_at).toLocaleDateString()}`}
                fields={fields}
                formType="semanal"
                expediente={expediente}
                onChange={() => {}}
                onSubmit={() => {}}
            />
        );
    };

    const renderFormularioNuevo = () => {
        const baseFields: Field[] =
            formularioSeleccionado === 'MOTO'
                ? fluidosSemanalFields['MOTO']
                : formularioSeleccionado === 'SPARK_PEUGEOT'
                ? sparkPeugeotFields['CARRO']
                : cheyenneTritonFields['CARRO'];

        const hasObservacion = baseFields.some((f) => f.id === 'observacion_general');
        const fields: Field[] = hasObservacion
            ? baseFields
            : [...baseFields, { id: 'observacion_general', label: 'Observación general', type: 'textarea', required: false }];

        return (
            <FichaSeccion
                title={`Nueva Revisión Semanal (${formularioSeleccionado})`}
                fields={fields}
                formType="semanal"
                expediente={formData}
                onChange={setFormData}
                onSubmit={(data) => handleFormSubmit('semanal', data, placa)}
            />
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

                    {revisiones.length > 0 && (
                        <div className="mb-10 space-y-8">
                            {revisiones.map((revision, index) => renderFichaFromRevision(revision, index))}
                        </div>
                    )}

                    <div className="mt-10 border-t pt-10">
                        <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Registrar nueva revisión</h2>

                        {tipoVehiculo === 'CARRO' && (
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200">
                                    Selecciona el tipo de formulario:
                                </label>
                                <select
                                    value={formularioSeleccionado ?? ''}
                                    onChange={(e) => setFormularioSeleccionado(e.target.value as FormularioGrupo)}
                                    className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                >
                                    <option value="">Selecciona una opción</option>
                                    <option value="SPARK_PEUGEOT">Spark / Peugeot</option>
                                    <option value="CHEYENNE_TRITON">Cheyenne / Triton</option>
                                </select>
                            </div>
                        )}

                        {formularioSeleccionado && renderFormularioNuevo()}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
