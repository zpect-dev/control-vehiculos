/* eslint-disable @typescript-eslint/no-explicit-any */
import FormCard from '@/components/FormCard';
import AppLayout from '@/layouts/app-layout';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Head } from '@inertiajs/react';
import { PanelTopOpen } from 'lucide-react';

export default function General() {
    // Definimos la estructura de los campos para cada formulario
    const expedienteTecnicoFields = [
        { id: 'marcaAceite', label: 'Marca del Aceite', type: 'text', placeholder: 'Ej: Castrol' },
        { id: 'marcaValvulina', label: 'Marca de Valvulina', type: 'text', placeholder: 'Ej: Mobil' },
        { id: 'marcaRefrigerante', label: 'Marca del Refrigerante', type: 'text', placeholder: 'Ej: Motul' },
        { id: 'computadoraBloqueada', label: 'Posee Computadora Bloqueada', type: 'text', placeholder: 'SI / NO' },
        { id: 'marcaLiga', label: 'Marca de Liga', type: 'text', placeholder: 'Ej: Gates DOT 3 / DOT 4' },
        { id: 'tipoFrenos', label: 'Tipo de Frenos', type: 'text', placeholder: 'Ej: Disco, Tambor, ABS' },
        { id: 'tipoDistribucion', label: 'Tipo de Distribución de Motor', type: 'text', placeholder: 'Ej: Cadena, Correa, Engranajes' },
        { id: 'sistemaInyeccion', label: 'Sistema de Inyección', type: 'text', placeholder: 'Ej: Gasolina, Eléctrico, Diésel' },
        { id: 'tipoCauchos', label: 'Tipo de Cauchos', type: 'text', placeholder: 'Ej: Medida, Marca' },
    ];

    // Campos para el formulario de Permisología
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

    // Campos para el formulario de Accesorios
    const accesoriosFields = [
        {
            id: 'caja',
            label: 'Caja de Herramienta',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'conos',
            label: 'Conos de seguridad',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'cuña',
            label: 'Cuña',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'extintor',
            label: 'Extintor',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'gato',
            label: 'Gato',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'llave',
            label: 'Llave de cruz',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'linterna',
            label: 'Linterna',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'repuesto',
            label: 'Repuesto',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
    ];

    // Campos para el formulario de Piezas Revisadas
    const piezasRevisadasFields = [
        {
            id: 'aire',
            label: 'Aire Acondicionado',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'cauchoDelDer',
            label: 'Caucho Delantero Der.',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'cauchoDelIzq',
            label: 'Caucho Delantero Izq.',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'cauchoTraDer',
            label: 'Caucho Tracero Der.',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'cauchoTraIzq',
            label: 'Caucho Tracero Izq.',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'cepillosPara',
            label: 'Cepillos Limpia Parabrisas',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'cerraduras',
            label: 'Cerraduras de Puertas',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'cinturones',
            label: 'Cinturones de Segurida',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'espejo',
            label: 'Espejo Interior de Cabina',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'espejoRetDer',
            label: 'Espejo Retovisor Der.',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'espejoRetIzq',
            label: 'Espejo Retovisor Izq.',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'bateria',
            label: 'Estado de la Bateria',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'bornes',
            label: 'Estado de los Bornes de Bateria',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'carroceria',
            label: 'Estado de la Carroceria',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'parachoques',
            label: 'Estado del Parachoques',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'pintura',
            label: 'Estado de la Pintura',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'guardapolvos',
            label: 'Estado del Guardapolvos',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'fluidos',
            label: 'Estados de los Recipientes de Fluidos',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'enfriamiento',
            label: 'Estado del Sistema de Enfriamiento',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'gomas',
            label: 'Gomas de las Puertas y Ventanas',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'lucesCrucesDel',
            label: 'Luces de los Cruces Delanteros',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'lucesCrucesTra',
            label: 'Luces de los Cruces Traceros',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'lucesFrenos',
            label: 'Luces de los Frenos',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'lucesNeblina',
            label: 'Luces de Neblina',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'lucesRetro',
            label: 'Luces de los Retroceso',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'lucesDelAltas',
            label: 'Luces Delanteras Altas',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'lucesDelBajas',
            label: 'Luces Delanteras Bajas',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'lucesIntermitentes',
            label: 'Luces Intermitentes Delanteras',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'lucesIntermitentesTra',
            label: 'Luces Intermitentes Traceras',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'lucesInternas',
            label: 'Luces Internas',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'lucesTestigo',
            label: 'Luces Testigo',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'manijasPuertas',
            label: 'Manijas de las Puertas',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'manijasVentanas',
            label: 'Manijas de las Ventanas',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'vidriosLatDel',
            label: 'Vidrios Laterales Delanteros',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'vidriosLatTra',
            label: 'Vidrios Laterales Traceros',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'vidrioParabrisas',
            label: 'Vidrio Parabrisas',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'pito',
            label: 'Pito',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'esparragos',
            label: 'Revisión de Esparragos',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'tablero',
            label: 'Tablero',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'tapetes',
            label: 'Tapetes',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
        {
            id: 'tapiceria',
            label: 'Tapicería',
            type: 'select',
            options: [
                { value: 'bueno', label: 'Bueno' },
                { value: 'malo', label: 'Malo' },
                { value: 'no-posee', label: 'No posee' },
            ],
        },
    ];

    // Función para manejar el envío de formularios
    const handleFormSubmit = (formData: any, formTitle: string) => {
        console.log(`Datos enviados del formulario "${formTitle}":`, formData);
        // Aquí puedes agregar la lógica para enviar los datos a una API
    };

    return (
        <AppLayout>
            <Head title="Ficha Técnica / Registro General del Vehículo" />
            <div className="min-h-screen bg-background px-4 py-10 font-sans dark:bg-gray-900">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Ficha Técnica / Registro General del Vehículo</h1>
                </div>

                <Disclosure
                    as="div"
                    className="mx-auto my-4 w-full max-w-5xl rounded-xl border bg-gray-100 shadow-lg transition-all dark:bg-gray-800"
                >
                    {({ open }) => (
                        <>
                            <DisclosureButton className="flex w-full items-center justify-between px-6 py-4 text-left text-xl font-bold text-gray-800 dark:text-white">
                                <span>Expediente Técnico del Vehículo</span>
                                <PanelTopOpen className={`h-5 w-5 transform transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`} />
                            </DisclosureButton>
                            <DisclosurePanel className="px-6 pt-2 pb-6">
                                <FormCard
                                    fields={expedienteTecnicoFields}
                                    buttonText="Guardar Expediente"
                                    onSubmit={(data: any) => handleFormSubmit(data, 'Expediente Técnico del Vehículo')}
                                    title={''}
                                />
                            </DisclosurePanel>
                        </>
                    )}
                </Disclosure>

                <Disclosure
                    as="div"
                    className="mx-auto my-4 w-full max-w-5xl rounded-xl border bg-gray-100 shadow-lg transition-all dark:bg-gray-800"
                >
                    {({ open }) => (
                        <>
                            <DisclosureButton className="flex w-full items-center justify-between px-6 py-4 text-left text-xl font-bold text-gray-800 dark:text-white">
                                <span>Permisologia del Vehiculo</span>
                                <PanelTopOpen className={`h-5 w-5 transform transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`} />
                            </DisclosureButton>
                            <DisclosurePanel className="px-6 pt-2 pb-6">
                                <FormCard
                                    fields={permisologiaFields}
                                    buttonText="Guardar Permisología"
                                    onSubmit={(data: any) => handleFormSubmit(data, 'Permisologia del Vehiculo')}
                                    title={''}
                                />
                            </DisclosurePanel>
                        </>
                    )}
                </Disclosure>

                <Disclosure
                    as="div"
                    className="mx-auto my-4 w-full max-w-5xl rounded-xl border bg-gray-100 shadow-lg transition-all dark:bg-gray-800"
                >
                    {({ open }) => (
                        <>
                            <DisclosureButton className="flex w-full items-center justify-between px-6 py-4 text-left text-xl font-bold text-gray-800 dark:text-white">
                                <span>Accesorios del Vehiculo</span>
                                <PanelTopOpen className={`h-5 w-5 transform transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`} />
                            </DisclosureButton>
                            <DisclosurePanel className="px-6 pt-2 pb-6">
                                <FormCard
                                    fields={accesoriosFields}
                                    buttonText="Guardar Accesorios"
                                    onSubmit={(data: any) => handleFormSubmit(data, 'Accesorios del Vehiculo')}
                                    title={''}
                                />
                            </DisclosurePanel>
                        </>
                    )}
                </Disclosure>

                <Disclosure
                    as="div"
                    className="mx-auto my-4 w-full max-w-5xl rounded-xl border bg-gray-100 shadow-lg transition-all dark:bg-gray-800"
                >
                    {({ open }) => (
                        <>
                            <DisclosureButton className="flex w-full items-center justify-between px-6 py-4 text-left text-xl font-bold text-gray-800 dark:text-white">
                                <span>Piezas Revisadas</span>
                                <PanelTopOpen className={`h-5 w-5 transform transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`} />
                            </DisclosureButton>
                            <DisclosurePanel className="px-6 pt-2 pb-6">
                                <FormCard
                                    fields={piezasRevisadasFields}
                                    buttonText="Guardar Piezas"
                                    onSubmit={(data: any) => handleFormSubmit(data, 'Piezas Revisadas')}
                                    title={''}
                                />
                            </DisclosurePanel>
                        </>
                    )}
                </Disclosure>
            </div>
        </AppLayout>
    );
}
