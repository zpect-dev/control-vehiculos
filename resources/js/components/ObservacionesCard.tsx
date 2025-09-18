import { Props } from "@/types";


export default function ObservacionCard({ observacion, isAdmin = false, onResolver }: Props) {
    const estadoColor = observacion.resuelto ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';

    const fechaCreacion = observacion.fecha_creacion ? new Date(observacion.fecha_creacion).toLocaleDateString() : 'Sin fecha';

    const fechaResolucion = observacion.fecha_resolucion ? new Date(observacion.fecha_resolucion).toLocaleDateString() : null;

    return (
        <div className="rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-800">
            <div className="flex items-start justify-between">
                <p className="text-gray-800 dark:text-gray-100">{observacion.observacion}</p>

                {isAdmin && !observacion.resuelto && onResolver && (
                    <label className="ml-4 flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <input
                            type="checkbox"
                            checked={observacion.resuelto}
                            onChange={() => onResolver?.(observacion.id)}
                            className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        Marcar como resuelta
                    </label>
                )}
            </div>

            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Autor:</span> {observacion.user?.name || 'Usuario desconocido'}
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Fecha:</span> {fechaCreacion}
            </div>

            {observacion.tipo && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Tipo:</span> {observacion.tipo}
                </div>
            )}

            <span className={`mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${estadoColor}`}>
                {observacion.resuelto ? 'Resuelto' : 'Pendiente'}
            </span>

            {observacion.resuelto && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {fechaResolucion && (
                        <>
                            <span className="font-semibold">Resuelto el:</span> {fechaResolucion}
                        </>
                    )}
                    {observacion.admin?.name && (
                        <>
                            {' '}
                            por <span className="font-semibold">{observacion.admin.name}</span>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
