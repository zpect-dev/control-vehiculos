import { RevisionSemanalData, VehiculoData } from '@/types';
import { router } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
    vehiculo: VehiculoData;
    revisionSemanal?: RevisionSemanalData | null;
}

export default function CardRevisionSemanal({ vehiculo, revisionSemanal }: Props) {
    const [video, setVideo] = useState<File | null>(null);
    const [kilometraje, setKilometraje] = useState('');
    const [tipoRevision, setTipoRevision] = useState<'inicial' | 'final' | null>(null);

    const today = new Date();
    const day = today.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado

    const puedeSubirInicial = day === 5 || day === 6 || day === 0; // viernes a domingo
    const puedeSubirFinal = day === 1; // lunes

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVideo(e.target.files?.[0] || null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!video || !kilometraje || !tipoRevision) return;

        const formData = new FormData();
        formData.append(tipoRevision === 'inicial' ? 'video_inicial' : 'video_final', video);
        formData.append(tipoRevision === 'inicial' ? 'kilometraje_inicial' : 'kilometraje_final', kilometraje);

        const method = tipoRevision === 'inicial' ? 'post' : 'put';
        const url =
            tipoRevision === 'inicial'
                ? `/fichaTecnica/${vehiculo.placa}/revisionSemanal`
                : `/fichaTecnica/${vehiculo.placa}/revisionSemanal/${revisionSemanal?.id}`;

        router[method](url, formData, {
            onSuccess: () => {
                setVideo(null);
                setKilometraje('');
                setTipoRevision(null);
            },
            onError: (errors) => console.error('Error al registrar revisión:', errors),
            forceFormData: true,
        });
    };

    return (
        <div className="rounded-lg border bg-white p-6 shadow-md dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Revisión Semanal</h3>

            {/* Video inicial */}
            {revisionSemanal?.video_inicial ? (
                <>
                    <video controls src={`/storage/uploads/videos-semanales/${revisionSemanal.video_inicial}`} className="mb-2 w-full" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Kilometraje inicial: {revisionSemanal.kilometraje_inicial}</p>
                </>
            ) : puedeSubirInicial ? (
                <button onClick={() => setTipoRevision('inicial')} className="mt-2 rounded-full bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                    Subir video inicial
                </button>
            ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">El video inicial solo puede subirse entre viernes y domingo.</p>
            )}

            {/* Video final */}
            {revisionSemanal?.video_final ? (
                <>
                    <video controls src={`/storage/uploads/videos-semanales/${revisionSemanal.video_final}`} className="mt-6 w-full" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Kilometraje final: {revisionSemanal.kilometraje_final}</p>
                </>
            ) : puedeSubirFinal && revisionSemanal ? (
                <button onClick={() => setTipoRevision('final')} className="mt-6 rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                    Subir video final
                </button>
            ) : (
                !revisionSemanal && (
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        El video final solo puede subirse los lunes, después de haber registrado el inicial.
                    </p>
                )
            )}

            {/* Formulario de carga */}
            {tipoRevision && (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4" encType="multipart/form-data">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Video</label>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoUpload}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kilometraje</label>
                        <input
                            type="number"
                            value={kilometraje}
                            onChange={(e) => setKilometraje(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            required
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="rounded-full bg-[#49af4e] px-6 py-3 text-base font-semibold text-white shadow-md transition-transform duration-200 hover:scale-105 hover:bg-[#3d9641] focus:ring-2 focus:ring-[#49af4e] focus:ring-offset-2 focus:outline-none"
                        >
                            Guardar {tipoRevision === 'inicial' ? 'video inicial' : 'video final'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
