import type { Pista } from '@/types';
import clsx from 'clsx';

interface PropsGrupoPista {
    tipo: string;
    actividades: Pista[];
}

export default function GrupoPista({ tipo, actividades }: PropsGrupoPista) {
    return (
        <div className="mb-10">
            <h2
                className={clsx('mb-4 text-lg font-bold tracking-wide uppercase', 'text-gray-700 dark:text-gray-200', {
                    'text-red-600': tipo === 'eliminar',
                    'text-green-600': tipo === 'crear',
                    'text-blue-600': tipo === 'editar',
                    'text-yellow-600': tipo === 'acceder',
                })}
            >
                {tipo}
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {actividades.map((pista) => (
                    <div
                        key={pista.id}
                        className="rounded-lg border bg-white p-4 shadow-sm transition-transform duration-300 hover:scale-[1.02] dark:bg-gray-800"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            <span className="font-semibold">Usuario:</span> {pista.user?.name || 'Desconocido'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            <span className="font-semibold">Modelo:</span> {pista.modelo}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            <span className="font-semibold">Descripción:</span> {pista.descripcion}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            <span className="font-semibold">Fecha:</span> {new Date(pista.created_at).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
