/* eslint-disable @typescript-eslint/no-explicit-any */
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Fluidos({ vehiculo }: { vehiculo: any }) {
    console.log('Cargando componente Fluidos...', vehiculo);
    const [weeklyVideo, setWeeklyVideo] = useState<File | null>(null);

    const getShortenedFileName = (fileName: string) => {
        if (!fileName) return '';
        const maxLength = 25;
        if (fileName.length <= maxLength) {
            return fileName;
        }

        // Encuentra el índice de la extensión para mantenerla
        const extensionIndex = fileName.lastIndexOf('.');
        if (extensionIndex === -1 || fileName.length - extensionIndex > 10) {
            // No hay extensión o es muy larga, simplemente acorta el nombre
            return `${fileName.substring(0, maxLength - 3)}...`;
        }

        const namePart = fileName.substring(0, extensionIndex);
        const extensionPart = fileName.substring(extensionIndex);
        const shortenedName = namePart.substring(0, maxLength - extensionPart.length - 3);
        return `${shortenedName}...${extensionPart}`;
    };

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWeeklyVideo(e.target.files?.[0] || null);
    };

    const handleFormSubmit = (e: any) => {
        e.preventDefault();
        const formData = new FormData();

        if (weeklyVideo) {
            formData.append('weekly_video', weeklyVideo);
        }

        router.post('/ruta-de-tu-backend/revisiones-fluidos', formData, {
            onSuccess: () => console.log('Revisiones registradas con éxito.'),
            onError: (errors) => console.error('Error al registrar las revisiones:', errors),
        });
    };

    return (
        <AppLayout>
            <Head title="Revisión Semanal de Fluidos" />
            <div className="min-h-screen bg-background px-4 py-10 font-sans dark:bg-gray-900">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Revisión Semanal de Vehículos</h1>
                </div>

                {/* Card de Detalles del Vehículo y Carga de Video */}
                <div className="mx-auto mb-10 max-w-5xl">
                    <div className="flex flex-col gap-6 rounded-xl bg-gray-100 p-6 shadow-lg md:flex-row dark:bg-gray-800">
                        {/* Tarjeta de Detalles del Vehículo */}
                        <div className="flex-1 rounded-lg bg-white p-4 shadow-md dark:bg-gray-700">
                            <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Detalles del Vehículo</h3>
                            <div className="space-y-2 text-gray-700 dark:text-gray-300">
                                <p>
                                    <span className="font-semibold">Placa:</span> {vehiculo?.placa}
                                </p>
                                <p>
                                    <span className="font-semibold">Modelo:</span> {vehiculo?.modelo}
                                </p>
                                <p>
                                    <span className="font-semibold">Conductor:</span> {vehiculo?.conductor}
                                </p>
                            </div>
                        </div>

                        {/* Sección para Cargar Video */}
                        <div className="flex-1 rounded-lg bg-white p-4 shadow-md dark:bg-gray-700">
                            <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Revisión Semanal (Video)</h3>
                            <div className="flex flex-col items-start space-y-4">
                                <label htmlFor="weekly-video" className="font-semibold text-gray-700 dark:text-gray-300">
                                    Sube tu video de la revisión semanal
                                </label>
                                <input
                                    type="file"
                                    id="weekly-video"
                                    accept="video/*"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-600 dark:text-white"
                                    onChange={handleVideoUpload}
                                />
                                {weeklyVideo && (
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        Video seleccionado: {getShortenedFileName(weeklyVideo.name)}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="flex justify-end pt-6">
                        <button
                            type="submit"
                            className="w-full rounded-full bg-[#49af4e] px-6 py-3 text-base font-semibold text-white shadow-md transition-transform duration-200 hover:scale-105 hover:bg-[#3d9641] focus:ring-2 focus:ring-[#49af4e] focus:ring-offset-2 focus:outline-none md:w-auto"
                        >
                            Guardar Revision
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
