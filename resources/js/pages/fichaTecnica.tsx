/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import FormCard from '@/components/FormCard';
import AppLayout from '@/layouts/app-layout';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Head, router, usePage } from '@inertiajs/react';
import { PanelTopOpen } from 'lucide-react';
import { useState } from 'react';

type FlashProps = {
    success?: string;
    [key: string]: any;
};

export default function fichaTecnica({
    vehiculos,
    expedientesTecnicos,
    permisosGuardados,
}: {
    vehiculos: any[];
    modo: string;
    expedientesTecnicos: Record<string, Record<string, string>>;
    permisosGuardados: Record<string, Record<string, string>>;
}) {
    const { flash } = usePage<{ flash: FlashProps }>().props;

    const [permisosLocal, setPermisosLocal] = useState(permisosGuardados);

    const expedienteTecnicoFields = [
        { id: '1', label: 'Marca del Aceite', type: 'text', placeholder: 'Ej: Castrol' },
        { id: '2', label: 'Marca de Valvulina', type: 'text', placeholder: 'Ej: Mobil' },
        { id: '3', label: 'Marca del Refrigerante', type: 'text', placeholder: 'Ej: Motul' },
        { id: '4', label: 'Posee Computadora Bloqueada', type: 'text', placeholder: 'SI / NO' },
        { id: '5', label: 'Tipo de Frenos', type: 'text', placeholder: 'Ej: Disco, Tambor, ABS' },
        { id: '6', label: 'Tipo de Distribución de Motor', type: 'text', placeholder: 'Ej: Cadena, Correa, Engranajes' },
        { id: '7', label: 'Sistema de Inyección', type: 'text', placeholder: 'Ej: Gasolina, Eléctrico, Diésel' },
        { id: '8', label: 'Tipo de Cauchos', type: 'text', placeholder: 'Ej: Medida, Marca' },
    ];

    const permisologiaFields = [
        { id: 'titulo', label: 'Título del Vehículo', type: 'text' },
        { id: 'carnet', label: 'Carnet de Circulación', type: 'text' },
        { id: 'seguro', label: 'Seguro RCV', type: 'date' },
        { id: 'roct', label: 'Roct', type: 'date' },
        { id: 'permisoRotReg', label: 'Permiso de Rotulado Regional', type: 'date' },
        { id: 'permisoRotNac', label: 'Permiso de Rotulado Nacional', type: 'date' },
        { id: 'salvoconducto', label: 'Salvoconducto', type: 'date' },
        { id: 'permisoAliMed', label: 'Permiso de Alimentos y Medicamentos', type: 'date' },
        { id: 'trimestres', label: 'Trimestres', type: 'date' },
    ];

    const handleFormSubmit = (formData: any, vehiculoId: string) => {
        formData.vehiculo_id = vehiculoId;

        router.post(`/fichaTecnica/${vehiculoId}/expedientes`, formData, {
            onSuccess: () => console.log('Expediente guardado con éxito'),
            onError: (errors) => console.error('Error al guardar expediente:', errors),
        });
    };

    const handleFormSubmitPermisologia = (formData: any, vehiculoId: string) => {
        formData.vehiculo_id = vehiculoId;

        router.post(`/fichaTecnica/${vehiculoId}/permisos`, formData, {
            onSuccess: () => {
                console.log('Permisología guardada con éxito');
                setPermisosLocal((prev) => ({
                    ...prev,
                    [vehiculoId]: {
                        ...prev[vehiculoId],
                        ...formData,
                    },
                }));
            },
            onError: (errors) => console.error('Error al guardar permisología:', errors),
        });
    };

    const transformarPermisos = (permisos: Record<string, any>) => {
        const plano: Record<string, string> = {};
        Object.entries(permisos).forEach(([key, value]) => {
            if (value?.fecha_expedicion) {
                plano[`${key}_expedicion`] = value.fecha_expedicion;
            }
            if (value?.fecha_vencimiento) {
                plano[`${key}_vencimiento`] = value.fecha_vencimiento;
            } else if (typeof value === 'string') {
                plano[key] = value;
            }
        });
        return plano;
    };

    const vehiculo = vehiculos[0];

    return (
        <AppLayout>
            <Head title={`Ficha Técnica / ${vehiculo.modelo} (${vehiculo.placa})`} />
            <div className="min-h-screen bg-background px-4 py-10 font-sans dark:bg-gray-900">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Ficha Técnica del Vehículo {vehiculo.modelo} ({vehiculo.placa})
                    </h1>
                    {flash?.success && <p className="mt-2 font-semibold text-green-600">{flash.success}</p>}
                </div>

                <div className="space-y-6">
                    {/* Expediente Técnico */}
                    <Disclosure as="div" className="mx-auto w-full max-w-5xl rounded-xl border bg-gray-100 shadow-lg dark:bg-gray-800">
                        {({ open }) => (
                            <>
                                <DisclosureButton className="flex w-full items-center justify-between px-6 py-4 text-left text-xl font-bold text-gray-800 dark:text-white">
                                    <span>Expediente Técnico del Vehículo</span>
                                    <PanelTopOpen
                                        className={`h-5 w-5 transform transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}
                                    />
                                </DisclosureButton>
                                <DisclosurePanel className="px-6 py-4">
                                    <FormCard
                                        fields={expedienteTecnicoFields}
                                        formType="expediente"
                                        onSubmit={(data: any) => handleFormSubmit(data, vehiculo.placa)}
                                        expediente={expedientesTecnicos[vehiculo.placa] || {}}
                                    />
                                </DisclosurePanel>
                            </>
                        )}
                    </Disclosure>

                    {/* Permisología */}
                    <Disclosure as="div" className="mx-auto w-full max-w-5xl rounded-xl border bg-gray-100 shadow-lg dark:bg-gray-800">
                        {({ open }) => (
                            <>
                                <DisclosureButton className="flex w-full items-center justify-between px-6 py-4 text-left text-xl font-bold text-gray-800 dark:text-white">
                                    <span>Permisología del Vehículo</span>
                                    <PanelTopOpen
                                        className={`h-5 w-5 transform transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}
                                    />
                                </DisclosureButton>
                                <DisclosurePanel className="px-6 pt-2 pb-6">
                                    <FormCard
                                        fields={permisologiaFields}
                                        formType="permisologia"
                                        onSubmit={(data: any) => handleFormSubmitPermisologia(data, vehiculo.placa)}
                                        expediente={transformarPermisos(permisosLocal[vehiculo.placa] || {})}
                                    />
                                </DisclosurePanel>
                            </>
                        )}
                    </Disclosure>
                </div>
            </div>
        </AppLayout>
    );
}
