/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import AppLayout from '@/layouts/app-layout';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Head, router } from '@inertiajs/react';
import { PanelTopOpen } from 'lucide-react';
import { useState } from 'react';

export default function revisionFluidos({ vehiculoId }) {
    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    const getDayIndex = () => {
        const day = new Date().getDay();
        return (day + 6) % 7;
    };

    const diaActual = diasSemana[getDayIndex()];

    const fluidosPorRevisar = [
        { id: 'aceite', nombre: 'Aceite de Motor' },
        { id: 'caja', nombre: 'Aceite de Caja' },
        { id: 'refrigerante', nombre: 'Refrigerante o Agua' },
        { id: 'direccion', nombre: 'Líquido de Dirección' },
        { id: 'frenos', nombre: 'Liga de Frenos' },
    ];

    const [revisiones, setRevisiones] = useState(
        diasSemana.reduce((diasAcc: any, dia) => {
            diasAcc[dia] = fluidosPorRevisar.reduce((acc: any, fluido) => {
                acc[fluido.id] = {
                    nivel: '',
                    foto: null,
                    realizado: false,
                };
                return acc;
            }, {});
            return diasAcc;
        }, {}),
    );

    const handleInputChange = (dia: string, fluidoId: string, campo: string, valor: any) => {
        setRevisiones((prev: any) => ({
            ...prev,
            [dia]: {
                ...prev[dia],
                [fluidoId]: {
                    ...prev[dia][fluidoId],
                    [campo]: valor,
                },
            },
        }));
    };

    const handleFormSubmit = (e: any) => {
        e.preventDefault();

        const arrayRevisiones = [];

        fluidosPorRevisar.forEach((fluido) => {
            const datos = revisiones[diaActual][fluido.id];
            const revision = {
                tipo: fluido.id,
                vehiculo_id: vehiculoId,
                nivel_fluido: datos.nivel,
                revisado: datos.realizado,
                imagen: datos.foto,
            };

            arrayRevisiones.push(revision);
        });

        router.post(`/fichaTecnica/${vehiculoId}/revisionFluidos`, arrayRevisiones, {
            onSuccess: () => console.log('Revisiones registradas con éxito.'),
            onError: (errors) => console.error('Error al registrar las revisiones:', errors),
        });
    };

    const renderCamposPorDia = () =>
        diasSemana.map((dia) => {
            const isToday = dia === diaActual;
            const cardClasses = `mx-auto w-full max-w-5xl rounded-xl border bg-gray-100 shadow-lg dark:bg-gray-800 transition-opacity ${!isToday ? 'opacity-50' : ''}`;

            return (
                <Disclosure key={dia} as="div" className={cardClasses}>
                    {({ open }) => (
                        <>
                            <DisclosureButton
                                className="flex w-full items-center justify-between px-6 py-4 text-left text-xl font-bold text-gray-800 dark:text-white"
                                disabled={!isToday}
                            >
                                <span>{dia}</span>
                                <PanelTopOpen
                                    className={`h-5 w-5 transform transition-transform duration-200 ${open && isToday ? 'rotate-180' : 'rotate-0'}`}
                                />
                            </DisclosureButton>
                            {isToday && (
                                <DisclosurePanel className="px-6 pt-2 pb-6">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {fluidosPorRevisar.map((fluido) => {
                                            const revision = revisiones[dia][fluido.id];
                                            return (
                                                <div key={fluido.id} className="flex flex-col gap-3">
                                                    <label className="text-sm font-semibold text-muted-foreground">{fluido.nombre}</label>
                                                    <select
                                                        value={revision.nivel}
                                                        onChange={(e) => handleInputChange(dia, fluido.id, 'nivel', e.target.value)}
                                                        className="rounded-md border px-3 py-2 text-sm shadow-sm transition focus:border-[#49af4e] focus:ring-2 focus:ring-[#49af4e] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                    >
                                                        <option value="" selected disabled>
                                                            Selecciona nivel
                                                        </option>
                                                        <option value="1">Normal</option>
                                                        <option value="0">Bajo</option>
                                                    </select>
                                                    <input
                                                        type="file"
                                                        onChange={(e) => handleInputChange(dia, fluido.id, 'foto', e.target.files?.[0] || null)}
                                                        className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[4] focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={revision.realizado}
                                                            onChange={(e) => handleInputChange(dia, fluido.id, 'realizado', e.target.checked)}
                                                            className="h-4 w-4 rounded border-gray-300 text-[#49af4e] focus:ring-[#49af4e]"
                                                        />
                                                        <span className="text-sm text-gray-700 dark:text-gray-300">Revisión realizada</span>
                                                    </div>
                                                    {revision.nivel === '0' && (
                                                        <div className="mt-2 rounded-md border border-yellow-400 bg-yellow-100 px-3 py-2 text-sm text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900">
                                                            Nivel bajo detectado. Verifica si requiere atención.
                                                        </div>
                                                    )}
                                                    {!revision.realizado && (
                                                        <div className="mt-2 rounded-md border border-red-500 bg-red-100 px-3 py-2 text-sm text-red-800 dark:bg-red-200 dark:text-red-900">
                                                            No se ha marcado como revisado.
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </DisclosurePanel>
                            )}
                        </>
                    )}
                </Disclosure>
            );
        });

    return (
        <AppLayout>
            <Head title="Revisión Semanal de Fluidos" />
            <div className="min-h-screen bg-background px-4 py-10 font-sans dark:bg-gray-900">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Revisión Diaria de Fluidos</h1>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-6" encType="multipart/form-data">
                    {renderCamposPorDia()}
                    <div className="flex justify-end pt-6">
                        <button
                            type="submit"
                            className="w-full rounded-full bg-[#49af4e] px-6 py-3 text-base font-semibold text-white shadow-md transition-transform duration-200 hover:scale-105 hover:bg-[#3d9641] focus:ring-2 focus:ring-[#49af4e] focus:ring-offset-2 focus:outline-none md:w-auto"
                        >
                            Guardar Revisiones
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
