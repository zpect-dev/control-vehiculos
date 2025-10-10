/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import FichaSeccion from '@/components/FichaSeccion';
import { cheyenneTritonFields } from '@/constants/cheyenneTritonFields';
import { fluidosSemanalFields } from '@/constants/fluidosSemanalFields';
import { sparkPeugeotFields } from '@/constants/sparkPeugeotFields';
import AppLayout from '@/layouts/app-layout';
import type { Field, RevisionSemanalProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type FormularioGrupo = 'CARRO' | keyof typeof formOptions;

const formOptions: {
    SPARK_PEUGEOT: Record<'CARRO', Field[]>;
    CHEYENNE_TRITON: Record<'CARRO', Field[]>;
} = {
    SPARK_PEUGEOT: sparkPeugeotFields,
    CHEYENNE_TRITON: cheyenneTritonFields,
};

export default function RevisionSemanal({ vehiculo, revisionSemanal, inicio, final }: RevisionSemanalProps) {
    const tipoVehiculo = vehiculo.tipo as 'CARRO' | 'MOTO';
    const placa = vehiculo.placa;
    const storageKey = `revisionSemanal-${placa}`;

    const [formularioSeleccionado, setFormularioSeleccionado] = useState<FormularioGrupo | null>(null);
    const [formData, setFormData] = useState<Record<string, any>>({});

    // Determinar los fields según selección o tipo de vehículo
    const fields: Field[] =
        formularioSeleccionado !== null
            ? formularioSeleccionado === 'CARRO'
                ? fluidosSemanalFields[tipoVehiculo]
                : formOptions[formularioSeleccionado]['CARRO']
            : fluidosSemanalFields[tipoVehiculo];

    useEffect(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            setFormData(JSON.parse(saved));
        } else if (revisionSemanal) {
            const initial: Record<string, any> = {};
            revisionSemanal.forEach((item: any) => {
                initial[item.tipo] = item.observacion ?? '';
                initial[`${item.tipo}_archivo`] = null;
                initial[`${item.tipo}_documento`] = item.imagen;
            });
            setFormData(initial);
        }
    }, [placa, revisionSemanal]);

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
        if (formularioSeleccionado !== null) {
            setFormData({});
            localStorage.removeItem(storageKey);
        }
    }, [formularioSeleccionado]);

    const handleFormSubmit = (formType: string, data: Record<string, any>, placa: string) => {
        const semanal: { tipo: string; imagen: File }[] = [];

        fields.forEach((field) => {
            // Archivos agrupados
            if (field.files && Array.isArray(field.files)) {
                field.files.forEach((fileField) => {
                    const imagen = data[fileField.id];
                    if (imagen instanceof File) {
                        semanal.push({
                            tipo: fileField.id,
                            imagen,
                        });
                    }
                });
            }

            // Archivos individuales
            else if (field.type === 'file') {
                const imagen = data[field.id];
                if (imagen instanceof File) {
                    semanal.push({
                        tipo: field.id,
                        imagen,
                    });
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

                    {tipoVehiculo === 'CARRO' && (
                        <div className="mb-6">
                            <label className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200">
                                Selecciona el tipo de formulario:
                            </label>
                            <div className="relative">
                                <select
                                    value={formularioSeleccionado ?? ''}
                                    onChange={(e) => setFormularioSeleccionado(e.target.value as FormularioGrupo)}
                                    className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                >
                                    <option value="">Usar formulario por tipo de vehículo</option>
                                    <option value="CARRO">Carro (Formulario base)</option>
                                    <option value="SPARK_PEUGEOT">Spark / Peugeot</option>
                                    <option value="CHEYENNE_TRITON">Cheyenne / Triton</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <FichaSeccion
                        title={`Revisión Semanal ${formularioSeleccionado ?? tipoVehiculo}`}
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
