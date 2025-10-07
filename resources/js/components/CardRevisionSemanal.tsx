import { fluidosSemanalFields } from '@/constants/formFields';

export default function CardRevisionSemanal({ vehiculo, revisionSemanal }) {
    const tipoVehiculo = vehiculo?.tipo as 'CARRO' | 'MOTO';
    const fields = fluidosSemanalFields[tipoVehiculo] || [];

    const imagenes = fields
        .filter((field) => field.type === 'file')
        .map((field) => ({
            id: field.id,
            label: field.label,
            url: revisionSemanal?.[field.id] ?? null,
        }))
        .filter((img) => img.url);

    return (
        <div className="rounded-lg border bg-gray-100 p-6 shadow-md dark:bg-gray-800">
            <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">Revisión Semanal</h3>

            <div className="mb-6">
                <h4 className="text-md mb-4 font-semibold text-gray-800 dark:text-white">Imágenes semanales</h4>

                {imagenes.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {imagenes.map(({ id, label, url }) => (
                            <div key={id} className="flex flex-col items-center rounded-lg bg-white p-2 shadow dark:bg-gray-700">
                                <img
                                    src={url}
                                    alt={label}
                                    className="mb-2 h-32 w-full rounded object-cover"
                                />
                                <p className="text-sm text-center text-gray-700 dark:text-gray-300">{label}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 dark:text-gray-400">No se han subido imágenes esta semana.</p>
                )}
            </div>
        </div>
    );
}
