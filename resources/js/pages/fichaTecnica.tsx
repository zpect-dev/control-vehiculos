/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import FormCard from '@/components/FormCard';
import AppLayout from '@/layouts/app-layout';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Head, router, usePage } from '@inertiajs/react';
import { PanelTopOpen } from 'lucide-react';

type FlashProps = {
    success?: string;
    [key: string]: any;
};

export default function fichaTecnica({ vehiculos }: { vehiculos: any[] }) {
    const { flash } = usePage<{ flash: FlashProps }>().props;

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

    const handleFormSubmit = (formData: any, formTitle: string, vehiculoId: string) => {
        formData.vehiculo_id = vehiculoId;

        router.post('/fichaTecnica', formData, {
            onSuccess: () => {
                console.log('Formulario guardado con éxito');
            },
            onError: (errors) => {
                console.error('Error al guardar:', errors);
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Ficha Técnica / Registro General del Vehículo" />
            <div className="min-h-screen bg-background px-4 py-10 font-sans dark:bg-gray-900">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Ficha Técnica / Registro General del Vehículo</h1>
                    {flash?.success && <p className="mt-2 font-semibold text-green-600">{flash.success}</p>}
                </div>

                {vehiculos.map((vehiculo: any, index: number) => (
                    <Disclosure
                        key={index}
                        as="div"
                        className="mx-auto my-4 w-full max-w-5xl rounded-xl border bg-gray-100 shadow-lg dark:bg-gray-800"
                    >
                        {({ open }) => (
                            <>
                                <DisclosureButton className="flex w-full items-center justify-between px-6 py-4 text-left text-xl font-bold text-gray-800 dark:text-white">
                                    <span>
                                        {vehiculo.modelo} — {vehiculo.placa}
                                    </span>
                                    <PanelTopOpen
                                        className={`h-5 w-5 transform transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}
                                    />
                                </DisclosureButton>
                                <DisclosurePanel className="px-6 pt-2 pb-6">
                                    <FormCard
                                        fields={expedienteTecnicoFields}
                                        buttonText="Guardar Expediente"
                                        onSubmit={(data: any) => handleFormSubmit(data, 'Expediente Técnico del Vehículo', vehiculo.placa)}
                                        title=""
                                    />
                                </DisclosurePanel>
                            </>
                        )}
                    </Disclosure>
                ))}
            </div>
        </AppLayout>
    );
}
