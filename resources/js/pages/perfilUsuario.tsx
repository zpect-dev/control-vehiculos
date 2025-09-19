import AppLayout from '@/layouts/app-layout';
import { UsuarioBasico } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function PerfilUsuario() {
    const { usuario } = usePage<{ usuario: UsuarioBasico }>().props;

    const [formData, setFormData] = useState<Record<string, string | File | null>>({});

    const [submitting, setSubmitting] = useState(false);

    const documentos = [
        { label: 'Cédula', key: 'cedula' },
        { label: 'Licencia', key: 'licencia' },
        { label: 'Certificado Médico', key: 'certificado_medico' },
        { label: 'Seguro Civil', key: 'seguro_civil' },
        { label: 'Carnet de Circulación', key: 'carnet_circulacion' },
        { label: 'Solvencia', key: 'solvencia' },
    ];

    const handleFileChange = (key: string, file: File | null) => {
        setFormData((prev) => ({ ...prev, [`foto_${key}`]: file }));
    };

    const handleDateChange = (key: string, date: string) => {
        setFormData((prev) => ({ ...prev, [`vencimiento_${key}`]: date }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const payload = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value) payload.append(key, value);
        });
        console.log([...payload.entries()]);

        router.patch(`/perfil/${usuario.id}`, payload, {
            onFinish: () => setSubmitting(false),
            forceFormData: true,
        });
    };

    return (
        <AppLayout>
            <Head title={`Perfil de ${usuario.name}`} />
            <div className="min-h-screen bg-background px-4 py-10 font-sans dark:bg-gray-900">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Perfil del Empleado</h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">ID interno: {usuario.id}</p>
                </div>

                <div className="mx-auto max-w-5xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Nombre completo</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{usuario.name}</p>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Cédula</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{usuario.email}</p>
                    </div>

                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">Documentación</h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {documentos.map(({ label, key }) => {
                                const foto = usuario[`foto_${key}` as keyof UsuarioBasico] as string | undefined;
                                const vencimiento = usuario[`vencimiento_${key}` as keyof UsuarioBasico] as string | undefined;
                                const vencido = vencimiento && new Date(vencimiento) < new Date();

                                return (
                                    <div key={key} className="rounded-lg border p-4 dark:border-gray-600 dark:bg-gray-700">
                                        <h3 className="text-md mb-2 font-semibold text-gray-900 dark:text-white">{label}</h3>
                                        {foto ? (
                                            <img
                                                src={`/storage/documentos/${foto}`}
                                                alt={`Documento ${label}`}
                                                className="mb-2 max-h-40 rounded shadow"
                                            />
                                        ) : (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">No cargado</p>
                                        )}
                                        {vencimiento && (
                                            <p className={`text-sm ${vencido ? 'text-red-600' : 'text-green-600'}`}>
                                                Vence: {new Date(vencimiento).toLocaleDateString()}
                                            </p>
                                        )}

                                        <div className="mt-4 space-y-2">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300">Reemplazar documento</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange(key, e.target.files?.[0] || null)}
                                                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300">Nueva fecha de vencimiento</label>
                                                <input
                                                    type="date"
                                                    onChange={(e) => handleDateChange(key, e.target.value)}
                                                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="rounded-full bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-md transition-transform duration-200 hover:scale-105 hover:bg-blue-700 disabled:opacity-50"
                            >
                                Guardar cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
