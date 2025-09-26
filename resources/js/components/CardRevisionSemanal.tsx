import { RevisionSemanalData, VehiculoData } from '@/types';
import { router } from '@inertiajs/react';
import { CircleCheck } from 'lucide-react';
import { useState } from 'react';

interface Props {
    vehiculo: VehiculoData;
    revisionSemanal?: RevisionSemanalData | null;
    revisionAnteriorFinalExiste: boolean;
}

export default function CardRevisionSemanal({ vehiculo, revisionSemanal, revisionAnteriorFinalExiste }: Props) {
    const [video, setVideo] = useState<File | null>(null);
    const [kilometraje, setKilometraje] = useState('');
    const [tipoRevision, setTipoRevision] = useState<'inicial' | 'final' | null>(null);

    const today = new Date();
    const day = today.getDay();

    const puedeSubirInicial = day === 1 && revisionAnteriorFinalExiste && !revisionSemanal?.video_inicial;

    const puedeSubirFinal = (day === 5 || day === 6 || day === 0) && !!revisionSemanal?.video_inicial && !revisionSemanal?.video_final;

    const ambosCompletados = !!revisionSemanal?.video_inicial && !!revisionSemanal?.video_final;

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVideo(e.target.files?.[0] || null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!video || !kilometraje || !tipoRevision) return;

        const formData = new FormData();
        formData.append(tipoRevision === 'inicial' ? 'video_inicial' : 'video_final', video);
        formData.append(tipoRevision === 'inicial' ? 'kilometraje_inicial' : 'kilometraje_final', kilometraje);
        if (tipoRevision === 'final') {
            formData.append('_method', 'PATCH');
        }

        const url =
            tipoRevision === 'inicial'
                ? `/fichaTecnica/${vehiculo.placa}/revisionSemanal`
                : `/fichaTecnica/${vehiculo.placa}/revisionSemanal/${revisionSemanal?.id}`;

        router.post(url, formData, {
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
        <div className="rounded-lg border bg-gray-100 p-6 shadow-md dark:bg-gray-800">
            <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">Revisión Semanal</h3>

            {/* Estado visual */}
            {ambosCompletados && (
                <div className="mb-4 flex items-center gap-2 text-[#49af4e] dark:text-[#4eb953]">
                    <CircleCheck />
                    <span>Semana completada</span>
                </div>
            )}

            {/* Revisión Inicial */}
            <div className="mb-6">
                <h4 className="text-md mb-2 font-semibold text-gray-800 dark:text-white">Video de los Lunes</h4>
                {revisionSemanal?.video_inicial ? (
                    <>
                        <video controls src={revisionSemanal.video_inicial} className="mb-2 w-full rounded-md" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Kilometraje: {revisionSemanal.kilometraje_inicial}</p>
                    </>
                ) : puedeSubirInicial ? (
                    <button
                        onClick={() => setTipoRevision('inicial')}
                        className="flex items-center gap-2 rounded-full bg-[#49af4e] px-4 py-2 text-white hover:bg-green-700"
                    >
                        Subir video
                    </button>
                ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Solo disponible los lunes si se completó la revisión final anterior.</p>
                )}
            </div>

            {/* Revisión Final */}
            <div>
                <h4 className="text-md mb-2 font-semibold text-gray-800 dark:text-white">Video de los Fines de Semana</h4>
                {revisionSemanal?.video_final ? (
                    <>
                        <video controls src={revisionSemanal.video_final} className="mb-2 w-full rounded-md" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Kilometraje: {revisionSemanal.kilometraje_final}</p>
                    </>
                ) : puedeSubirFinal ? (
                    <button
                        onClick={() => setTipoRevision('final')}
                        className="flex items-center gap-2 rounded-full bg-[#49af4e] px-4 py-2 text-white hover:bg-green-700"
                    >
                        Subir video
                    </button>
                ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Solo disponible de viernes a domingo si ya se subió el video inicial.</p>
                )}
            </div>

            {/* Formulario */}
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
