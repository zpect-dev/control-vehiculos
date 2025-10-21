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
    const { vehiculo, revisionSemanal, observacion, tipoFormularioCargado, inicio, final } = usePage<{
        vehiculo: { tipo: 'CARRO' | 'MOTO'; modelo: string; placa: string };
        revisionSemanal: any[];
        observacion?: { observacion: string };
        tipoFormularioCargado: number | null;
        inicio: string;
        final: string;
    }>().props;

    const formularioYaCargado = revisionSemanal.length > 0;
    const tipoVehiculo = vehiculo.tipo;
    const placa = vehiculo.placa;

    const [formularioSeleccionado, setFormularioSeleccionado] = useState<FormularioGrupo | null>(null);
    const [formData, setFormData] = useState<Record<string, any>>({});

    // Asignar automáticamente "MOTO" si el vehículo es tipo moto
    useEffect(() => {
        if (tipoVehiculo === 'MOTO') {
            setFormularioSeleccionado('MOTO');
        }
    }, [tipoVehiculo]);

    // Cargar datos si ya hay revisión registrada
    useEffect(() => {
        if (revisionSemanal.length > 0) {
            const initial: Record<string, any> = {};

             revisionSemanal.forEach((item) => {
            initial[item.tipo] = item.imagen; // ✅ clave directa, sin "_documento"
        });

            if (observacion?.observacion) {
                initial['observacion_general'] = observacion.observacion;
            }

            setFormData(initial);

            // Detectar tipo de formulario cargado y fijarlo automáticamente
            if (!formularioSeleccionado && tipoFormularioCargado) {
                setFormularioSeleccionado(
                    tipoFormularioCargado === 1
                        ? 'SPARK_PEUGEOT'
                        : tipoFormularioCargado === 2
                          ? 'CHEYENNE_TRITON'
                          : tipoFormularioCargado === 3
                            ? 'MOTO'
                            : null,
                );
            }
        }
    }, [revisionSemanal, observacion, formularioSeleccionado, tipoFormularioCargado, tipoVehiculo]);

    // Determinar campos según formulario seleccionado
    const baseFields: Field[] =
        formularioSeleccionado === 'MOTO'
            ? fluidosSemanalFields['MOTO']
            : formularioSeleccionado === 'SPARK_PEUGEOT'
              ? sparkPeugeotFields['CARRO']
              : formularioSeleccionado === 'CHEYENNE_TRITON'
                ? cheyenneTritonFields['CARRO']
                : [];

    const hasObservacion = baseFields.some((f) => f.id === 'observacion_general');

    const fields: Field[] = hasObservacion
        ? baseFields
        : [...baseFields, { id: 'observacion_general', label: 'Observación general', type: 'textarea', required: false }];

    const handleFormSubmit = (formType: string, data: Record<string, any>, placa: string) => {
        const semanal: { tipo: string; imagen: File }[] = [];
        const tipoFormulario = formularioSeleccionado === 'SPARK_PEUGEOT' ? 1 : formularioSeleccionado === 'CHEYENNE_TRITON' ? 2 : formularioSeleccionado === 'MOTO' ? 3 : null;

        fields.forEach((field) => {
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
                onSuccess: () => router.reload({ only: ['revisionSemanal'] }),
            },
        );
    };
console.log(revisionSemanal)
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

                    {formularioYaCargado ? (
                        <FichaSeccion
                            title={`Revisión registrada (${formularioSeleccionado ?? tipoVehiculo})`}
                            fields={fields}
                            formType="semanal"
                            expediente={formData}
                            onChange={() => {}}
                            onSubmit={(data) => handleFormSubmit('semanal', data, placa)}
                        />
                    ) : (
                        <div>
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

                            {formularioSeleccionado && (
                                <FichaSeccion
                                    title={`Revisión Semanal ${formularioSeleccionado}`}
                                    fields={fields}
                                    formType="semanal"
                                    expediente={formData}
                                    onChange={setFormData}
                                    onSubmit={(data) => handleFormSubmit('semanal', data, placa)}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
