import FlashMessage from '@/components/FlashMessage';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function PanelObservaciones({ vehiculoId, observacionesGuardadas = [], usuario }) {
    const [comentario, setComentario] = useState('');
    const [adjunto, setAdjunto] = useState<File | null>(null);
    const [flashMessage, setFlashMessage] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!comentario.trim()) {
            setFlashMessage('La observación no puede estar vacía.');
            return;
        }

        const formData = new FormData();
        formData.append('vehiculo_id', vehiculoId.toString());
        formData.append('usuario_id', usuario.id);
        formData.append('comentario', comentario);
        if (adjunto) formData.append('adjunto', adjunto);

        router.post(`/vehiculos/${vehiculoId}/observaciones`, formData, {
            forceFormData: true,
            onSuccess: () => {
                setComentario('');
                setAdjunto(null);
                setFlashMessage('Observación registrada con éxito.');
            },
            onError: () => setFlashMessage('Error al registrar la observación.'),
        });
    };

    return (
        <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Observaciones del Usuario</h2>
            <FlashMessage mensaje={flashMessage} isError={flashMessage?.includes('Error')} />

            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Escribe tu observación aquí..."
                    className="w-full rounded-md border px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
                />

                <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => setAdjunto(e.target.files?.[0] || null)}
                    className="w-full rounded-md border px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
                />

                <button type="submit" className="rounded-md bg-[#1a9888] px-4 py-2 text-sm font-semibold text-white hover:bg-[#188576]">
                    Guardar Observación
                </button>
            </form>

            <div className="mt-8 space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Historial de Observaciones</h3>
                {observacionesGuardadas.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No hay observaciones registradas aún.</p>
                ) : (
                    <ul className="space-y-3">
                        {observacionesGuardadas.map((obs, index) => (
                            <li key={index} className="rounded-md border p-4 dark:border-gray-600 dark:bg-gray-700">
                                <p className="text-sm text-gray-700 dark:text-gray-200">
                                    <span className="font-semibold">Fecha:</span> {obs.fecha}
                                </p>
                                <p className="mt-1 text-sm text-gray-800 dark:text-white">{obs.comentario}</p>
                                {obs.adjunto && (
                                    <a
                                        href={obs.adjunto}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 inline-block text-sm text-blue-600 underline dark:text-blue-400"
                                    >
                                        Ver adjunto
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
