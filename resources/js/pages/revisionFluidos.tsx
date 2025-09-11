/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import FichaSeccionFluidos from '@/components/FichaSeccionFluidos';
import FlashMessage from '@/components/FlashMessage';
import { fluidosPorRevisarFields } from '@/constants/formFields';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface RevisionFluidosProps {
    vehiculoId: number | string;
}

interface RevisionFluido {
    id: number;
    vehiculo_id: string;
    user_id: number;
    nivel_fluido: number;
    imagen: string;
    fecha_creacion: string;
    revisado: number;
    fecha_revision: string | null;
    tipo: string;
}

type FlashProps = {
    success?: string;
    [key: string]: any;
};

export default function revisionFluidos({ vehiculoId }: RevisionFluidosProps) {
    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const { flash, modo, revisionDiaria } = usePage<{
        flash: FlashProps;
        modo: string;
        revisionDiaria: RevisionFluido[];
    }>().props;

<<<<<<< HEAD
    const esAdmin = modo === 'admin';
    const diaActual = diasSemana[(new Date().getDay() + 6) % 7];
    const diasVisibles = esAdmin ? diasSemana : [diaActual];
=======
    const diaActual = diasSemana[getDayIndex()];
>>>>>>> a3785076cc2bdd97d7a5454f1f6004afab6ef0e8

    const [revisiones] = useState(() => {
        const mapa = diasSemana.reduce((diasAcc: any, dia) => {
            diasAcc[dia] = fluidosPorRevisarFields.reduce((acc: any, fluido) => {
                acc[fluido.id] = { nivel: '', foto: null, realizado: false };
                return acc;
            }, {});
            return diasAcc;
        }, {});

        if (Array.isArray(revisionDiaria)) {
            revisionDiaria.forEach((rev) => {
                const fecha = new Date(rev.fecha_creacion);
                const diaTexto = diasSemana[(fecha.getDay() + 6) % 7];

                if (mapa[diaTexto] && mapa[diaTexto][rev.tipo]) {
                    mapa[diaTexto][rev.tipo] = {
                        nivel: String(rev.nivel_fluido),
                        foto: rev.imagen ? `/storage/uploads/fotos-diarias/${rev.imagen}` : null,
                        realizado: true,
                    };
                }
            });
        }

        return mapa;
    });

    const fluidosFields = fluidosPorRevisarFields.flatMap((fluido) => [
        {
            id: fluido.id,
            label: fluido.label,
            type: 'select' as const,
            options: [
                { value: '1', label: 'Normal' },
                { value: '0', label: 'Bajo' },
            ],
        },
        {
            id: `${fluido.id}_foto`,
            label: `Foto de ${fluido.label}`,
            type: 'file' as const,
        },
    ]);

    const handleSubmitFluidos = (dia: string, formData: Record<string | number, string | boolean | File | null>) => {
        const form = new FormData();

        fluidosPorRevisarFields.forEach((fluido, index) => {
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
        });
    };

    return (
        <AppLayout>
            <Head title="Revisión Semanal de Fluidos" />
            <div className="min-h-screen bg-background px-4 py-10 font-sans dark:bg-gray-900">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {esAdmin ? 'Revisión Semanal de Fluidos' : `Revisión de Fluidos - ${diaActual}`}
                    </h1>
                    <FlashMessage mensaje={flash?.success} />
                </div>

                {diasVisibles.map((dia) => {
                    const expediente = Object.fromEntries(
                        fluidosPorRevisarFields.flatMap((fluido) => [
                            [fluido.id, revisiones[dia][fluido.id].nivel],
                            [`${fluido.id}_foto`, revisiones[dia][fluido.id].foto],
                        ]),
                    );

                    return (
                        <div key={dia} className="py-2">
                            <FichaSeccionFluidos
                                title={`Revisión de Fluidos - ${dia}`}
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
