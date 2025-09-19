/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import FichaSeccionFluidos from '@/components/FichaSeccionFluidos';
import { fluidosPorRevisarFields } from '@/constants/formFields';
import AppLayout from '@/layouts/app-layout';
import { FlashProps, RevisionFluido, RevisionFluidosProps } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function revisionFluidos({ vehiculoId }: RevisionFluidosProps) {
    const diasSemana = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const diasSemanaTexto = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    const { modo, revisionDiaria, vehiculo } = usePage<{
        flash: FlashProps;
        modo: string;
        revisionDiaria?: Record<string, RevisionFluido[]>;
        vehiculo: { tipo: 'CARRO' | 'MOTO'; modelo: string };
    }>().props;

    const tipoVehiculo = vehiculo?.tipo === 'MOTO' ? 'MOTO' : 'CARRO';
    const fluidosBase = fluidosPorRevisarFields[tipoVehiculo];

    const esAdmin = modo === 'admin';
    const diaActual = diasSemana[(new Date().getDay() + 6) % 7];
    const diasVisibles = esAdmin ? diasSemana : [diaActual];
    const [, setValidationError] = useState<string | null>(null);

    const [revisiones] = useState(() => {
        const mapa = diasSemana.reduce((diasAcc: any, dia) => {
            diasAcc[dia] = fluidosBase.reduce((acc: any, fluido) => {
                acc[fluido.id] = { nivel: '', foto: null, realizado: false };
                return acc;
            }, {});
            return diasAcc;
        }, {});

        if (revisionDiaria) {
            Object.entries(revisionDiaria).forEach(([diaTexto, revisionesDelDia]) => {
                const diaKey = diaTexto.toLowerCase();
                if (!mapa[diaKey]) return;
                revisionesDelDia.forEach((rev) => {
                    if (mapa[diaKey][rev.tipo]) {
                        mapa[diaKey][rev.tipo] = {
                            nivel: String(rev.nivel_fluido ?? ''),
                            foto: rev.imagen,
                            realizado: !!rev.revisado,
                        };
                    }
                });
            });
        }

        return mapa;
    });

    const fluidosFields = fluidosBase.flatMap((fluido) => [
        {
            id: fluido.id,
            label: fluido.label,
            type: 'select' as const,
            options: fluido.options,
        },
        {
            id: `${fluido.id}_foto`,
            label: `Foto de ${fluido.label}`,
            type: 'file' as const,
        },
    ]);

    const handleSubmitFluidos = (dia: string, formData: Record<string | number, string | boolean | File | null>) => {
        setValidationError(null);

        const missingImage = fluidosBase.find((fluido) => {
            const nivel = formData[fluido.id];
            const imagen = formData[`${fluido.id}_foto`];
            return nivel && !imagen;
        });

        if (missingImage) {
            setValidationError(`Por favor, sube la imagen para el nivel de ${missingImage.label}.`);
            return;
        }

        const form = new FormData();

        fluidosBase.forEach((fluido, index) => {
            form.append(`fluidos[${index}][tipo]`, fluido.id);
            form.append(`fluidos[${index}][vehiculo_id]`, vehiculoId.toString());
            form.append(`fluidos[${index}][dia]`, dia);

            const nivel = formData[fluido.id];
            const imagen = formData[`${fluido.id}_foto`];
            const revisado = !!nivel || !!imagen ? '1' : '0';

            if (nivel) {
                form.append(`fluidos[${index}][nivel_fluido]`, nivel as string);
            }

            form.append(`fluidos[${index}][revisado]`, revisado);

            if (imagen instanceof File) {
                form.append(`fluidos[${index}][imagen]`, imagen);
            }
        });

        router.post(`/fichaTecnica/${vehiculoId}/revisionFluidos`, form, {
            forceFormData: true,
            onSuccess: () => setValidationError(null),
        });
    };

    return (
        <AppLayout>
            <Head title="Revisión Semanal de Fluidos" />
            <div className="min-h-screen bg-background px-4 py-10 font-sans dark:bg-gray-900">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {esAdmin
                            ? `Revisión Semanal de Fluidos - ${vehiculo?.modelo}`
                            : `Revisión de Fluidos - ${vehiculo?.modelo} - ${diasSemanaTexto[diasSemana.indexOf(diaActual)]}`}
                    </h1>
                </div>

                {diasVisibles.map((dia) => {
                    const expediente = Object.fromEntries(
                        fluidosBase.flatMap((fluido) => {
                            const registro = revisiones[dia][fluido.id];
                            return [
                                [fluido.id, registro.nivel],
                                [`${fluido.id}_foto`, registro.foto ?? null],
                            ];
                        }),
                    );

                    return (
                        <div key={dia} className="py-2">
                            <FichaSeccionFluidos
                                title={`Revisión de Fluidos - ${diasSemanaTexto[diasSemana.indexOf(dia)]}`}
                                fields={fluidosFields}
                                expediente={expediente}
                                onSubmit={(formData) => handleSubmitFluidos(dia, formData)}
                            />
                        </div>
                    );
                })}
            </div>
        </AppLayout>
    );
}
