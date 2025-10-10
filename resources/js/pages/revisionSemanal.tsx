/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import FichaSeccion from '@/components/FichaSeccion';
import { cheyenneTritonFields } from '@/constants/cheyenneTritonFields';
import { sparkPeugeotFields } from '@/constants/sparkPeugeotFields';
import AppLayout from '@/layouts/app-layout';
import type { Field } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

type FormularioGrupo = keyof typeof formOptions;

const formOptions: {
    SPARK_PEUGEOT: Record<'CARRO', Field[]>;
    CHEYENNE_TRITON: Record<'CARRO', Field[]>;
} = {
    SPARK_PEUGEOT: sparkPeugeotFields,
    CHEYENNE_TRITON: cheyenneTritonFields,
};

export default function RevisionSemanal() {
    const { vehiculo, revisionSemanal, observacion, inicio, final } = usePage<{
        vehiculo: { tipo: 'CARRO' | 'MOTO'; modelo: string; placa: string };
        revisionSemanal: any[];
        observacion?: { observacion: string };
        inicio: string;
        final: string;
    }>().props;

    const tipoVehiculo = vehiculo.tipo;
    const placa = vehiculo.placa;
    const storageKey = `revisionSemanal-${placa}`;
    const previousFormularioRef = useRef<FormularioGrupo | null>(null);

    const [formularioSeleccionado, setFormularioSeleccionado] = useState<FormularioGrupo | null>(null);
    const [formData, setFormData] = useState<Record<string, any>>({});

    const fields: Field[] = formularioSeleccionado
    
        ? [
              ...formOptions[formularioSeleccionado]['CARRO'],
              {
                  id: 'observacion_general',
                  label: 'Observación general',
                  type: 'textarea',
                  required: false,
              },
          ]
        : [];

    useEffect(() => {
        if (revisionSemanal && formularioSeleccionado) {
            const initial: Record<string, any> = {};

            revisionSemanal.forEach((item: any) => {
                initial[item.tipo] = null;
                initial[`${item.tipo}_documento`] = item.imagen;
            });

            if (observacion?.observacion) {
                initial['observacion_general'] = observacion.observacion;
            }

            setFormData(initial);
        }
    }, [revisionSemanal, observacion, formularioSeleccionado]);

    useEffect(() => {
        const sanitized = { ...formData };
        fields.forEach((field) => {
            if (field.type === 'file' && sanitized[field.id] instanceof File) {
                sanitized[field.id] = null;
            }
        });
        localStorage.setItem(storageKey, JSON.stringify(sanitized));
    }, [formData]);

    useEffect(() => {
        if (formularioSeleccionado && formularioSeleccionado !== previousFormularioRef.current) {
            setFormData({});
            localStorage.removeItem(storageKey);
        }

        previousFormularioRef.current = formularioSeleccionado;
    }, [formularioSeleccionado]);

    const handleFormSubmit = (formType: string, data: Record<string, any>, placa: string) => {
        const semanal: { tipo: string; imagen: File }[] = [];

        fields.forEach((field) => {
            if (field.files && Array.isArray(field.files)) {
                field.files.forEach((fileField) => {
                    const imagen = data[fileField.id];
                    if (imagen instanceof File) {
                        semanal.push({ tipo: fileField.id, imagen });
                    }
                });
            } else if (field.type === 'file') {
                const imagen = data[field.id];
                if (imagen instanceof File) {
                    semanal.push({ tipo: field.id, imagen });
                }
            }
        });

        const observacionGeneral = data['observacion_general'];

        router.post(
            `/fichaTecnica/${placa}/revisionSemanal`,
            { semanal, observacion: observacionGeneral },
            {
                preserveScroll: true,
                forceFormData: true,
                onSuccess: () => {
                    localStorage.removeItem(storageKey);
                    router.reload({ only: ['revisionSemanal'] });
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

                    <div className="mb-6">
                        <label className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200">Selecciona el tipo de formulario:</label>
                        <div className="relative">
                            <select
                                value={formularioSeleccionado ?? ''}
                                onChange={(e) => setFormularioSeleccionado(e.target.value as FormularioGrupo)}
                                className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            >
                                <option value="SPARK_PEUGEOT">Spark / Peugeot</option>
                                <option value="CHEYENNE_TRITON">Cheyenne / Triton</option>
                            </select>
                        </div>
                    </div>

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
            </div>
        </AppLayout>
    );
}
