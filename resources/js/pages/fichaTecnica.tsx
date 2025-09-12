/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import AsignacionUser from '@/components/AsignacionUser';
import FichaSeccion from '@/components/FichaSeccion';
import FlashMessage from '@/components/FlashMessage';
import { accesoriosFields, expedienteTecnicoFields, permisologiaFields, piezasRevisadasFields } from '@/constants/formFields';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

type FlashProps = {
    success?: string;
    [key: string]: any;
};

export default function fichaTecnica({
    vehiculos,
    expedientesTecnicos,
    permisosGuardados,
    accesoriosGuardados = {},
    piezasGuardadas = {},
    users,
    isAdmin,
}: {
    vehiculos: any[];
    modo: string;
    expedientesTecnicos: Record<string, Record<string, string>>;
    permisosGuardados: Record<string, Record<string, string>>;
    accesoriosGuardados?: Record<string, Record<string, string>>;
    piezasGuardadas?: Record<string, Record<string, string>>;
    users: any[];
    isAdmin: boolean;
}) {
    const { flash } = usePage<{ flash: FlashProps }>().props;
    const vehiculo = vehiculos[0];
    const placa = vehiculo?.placa || '';

    const [permisosLocal, setPermisosLocal] = useState(permisosGuardados);
    const [, setAccesoriosLocal] = useState(accesoriosGuardados);

    const transformarPermisos = (permisos: Record<string, any>) => {
        const plano: Record<string, string> = {};
        Object.entries(permisos).forEach(([key, value]) => {
            if (value?.fecha_expedicion) plano[`${key}_expedicion`] = value.fecha_expedicion;
            if (value?.fecha_vencimiento) plano[`${key}_vencimiento`] = value.fecha_vencimiento;
            else if (typeof value === 'string') plano[key] = value;
        });
        return plano;
    };

    const sanitizeFormData = (data: Record<string, string | boolean | File | null>): Record<string, string> => {
        const sanitized: Record<string, string> = {};
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'string') {
                sanitized[key] = value;
            } else if (typeof value === 'boolean') {
                sanitized[key] = value ? 'true' : 'false';
            } else if (value instanceof File) {
                sanitized[key] = value.name;
            } else {
                sanitized[key] = '';
            }
        }
        return sanitized;
    };

    const handleFormSubmit = (
        tipo: 'expedientes' | 'permisologia' | 'accesorios' | 'piezas',
        rawData: Record<string, string | boolean | File | null>,
        vehiculoId: string,
    ) => {
        const formData = sanitizeFormData(rawData);
        formData.vehiculo_id = vehiculoId;

        router.post(`/fichaTecnica/${vehiculoId}/${tipo}`, formData, {
            onSuccess: () => {
                console.log(`${tipo} guardado con éxito`);
                if (tipo === 'permisologia') {
                    setPermisosLocal((prev) => ({
                        ...prev,
                        [vehiculoId]: { ...prev[vehiculoId], ...formData },
                    }));
                }
                if (tipo === 'accesorios') {
                    setAccesoriosLocal((prev) => ({
                        ...prev,
                        [vehiculoId]: { ...prev[vehiculoId], ...formData },
                    }));
                }
            },
            onError: (errors) => console.error(`Error al guardar ${tipo}:`, errors),
        });
    };

    return (
        <AppLayout>
            <Head title={`Ficha Técnica / ${vehiculo.modelo} (${vehiculo.placa})`} />
            <div className="min-h-screen bg-background px-4 py-10 font-sans dark:bg-gray-900">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Ficha Técnica del Vehículo {vehiculo.modelo}</h1>
                    <AsignacionUser vehiculo={vehiculo} users={users} isAdmin={isAdmin} />
                    <FlashMessage mensaje={flash?.success} />
                </div>

                <div className="space-y-4">
                    <FichaSeccion
                        title="Expediente Técnico del Vehículo"
                        fields={expedienteTecnicoFields}
                        formType="expediente"
                        expediente={expedientesTecnicos[placa] || {}}
                        onSubmit={(data) => handleFormSubmit('expedientes', data, placa)}
                    />

                    <FichaSeccion
                        title="Permisología del Vehículo"
                        fields={permisologiaFields}
                        formType="permisologia"
                        expediente={transformarPermisos(permisosLocal[placa] || {})}
                        onSubmit={(data) => handleFormSubmit('permisologia', data, placa)}
                    />

                    <FichaSeccion
                        title="Accesorios del Vehículo"
                        fields={accesoriosFields}
                        formType="accesorios"
                        expediente={accesoriosGuardados[placa]}
                        onSubmit={(data) => handleFormSubmit('accesorios', data, placa)}
                    />

                    <FichaSeccion
                        title="Piezas Revisadas del Vehículo"
                        fields={piezasRevisadasFields}
                        formType="piezas"
                        expediente={piezasGuardadas[placa]}
                        onSubmit={(data) => handleFormSubmit('piezas', data, placa)}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
