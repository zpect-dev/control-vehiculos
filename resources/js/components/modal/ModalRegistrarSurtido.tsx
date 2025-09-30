/* eslint-disable react-hooks/exhaustive-deps */
import { useFormLogic } from '@/hooks/useFormLogic';
import { ModalRegistroSurtidoProps, SurtidoField, SurtidoFormData } from '@/types'; // ajusta la ruta según tu estructura
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { router } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

const fields: SurtidoField[] = [
    {
        id: 'litros',
        label: 'Litros surtidos',
        type: 'number',
        placeholder: 'Ej: 20',
        required: true,
    },
    {
        id: 'kilometraje',
        label: 'Kilometraje actual',
        type: 'number',
        placeholder: 'Ej: 12500',
        required: true,
    },
    {
        id: 'observacion',
        label: 'Observación',
        type: 'textarea',
        placeholder: 'Observaciones adicionales...',
        required: false,
    },
];

export default function ModalRegistroSurtido({ isOpen, onClose, vehiculo }: ModalRegistroSurtidoProps) {
    const { formValues, handleChange, hasCamposIncompletos } = useFormLogic<SurtidoFormData>(
        {
            litros: '',
            kilometraje: '',
        },
        fields,
    );
    const { litros, kilometraje, observacion } = formValues;
    const [processing, setProcessing] = useState(false);
    const [kilometrajeAnterior, setKilometrajeAnterior] = useState<number>(0);
    const [surtidoIdeal, setSurtidoIdeal] = useState<number | null>(null);
    const [precioUnitario, setPrecioUnitario] = useState<number>(0.5);

    console.log(kilometraje)

    useEffect(() => {
        if (isOpen) {
            fetch(`/fichaTecnica/${vehiculo.placa}/gasolina/info`)
                .then((res) => res.json())
                .then((data) => {
                    setKilometrajeAnterior(data.kilometraje_anterior);
                    setSurtidoIdeal(data.surtido_ideal);
                    setPrecioUnitario(data.precio_unitario);
                });
        }
    }, [isOpen]);

    function registrarSurtido() {
        console.log('Intentando registrar surtido...');

        if (hasCamposIncompletos) {
            console.log('Campos incompletos:', formValues);
            alert('Por favor completa los campos requeridos');
            return;
        }

        console.log('Campos completos, enviando:', formValues);
        setProcessing(true);

        router.post(
            `/fichaTecnica/${vehiculo.placa}/gasolina`,
            {
                cant_litros: litros,
                kilometraje,
                observaciones: observacion,
                precio: Number(litros) * precioUnitario,
            },
            {
                onSuccess: () => {
                    console.log('Surtido registrado con éxito');
                    onClose();
                },
                onError: (errors) => {
                    console.log('Error al registrar surtido:', errors);
                    alert('Error al registrar el surtido');
                },
                onFinish: () => {
                    console.log('Petición finalizada');
                    setProcessing(false);
                },
            },
        );
    }

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl dark:border dark:border-gray-700 dark:bg-gray-900">
                    {/* Encabezado */}
                    <div className="mb-6 flex items-center justify-between border-b pb-2">
                        <DialogTitle className="text-xl font-bold text-gray-800 dark:text-white">Registrar Surtido de Gasolina</DialogTitle>
                        <button onClick={onClose} className="rounded-full p-1 text-gray-500 hover:text-gray-700 dark:hover:text-white">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Datos del vehículo */}
                    <div className="mb-6 text-gray-700 dark:text-gray-300">
                        <p>
                            <strong>Placa:</strong> {vehiculo.placa}
                        </p>
                        <p>
                            <strong>Conductor:</strong> {vehiculo.conductor}
                        </p>
                        <p>
                            <strong>Modelo:</strong> {vehiculo.modelo}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 text-sm font-semibold text-gray-700 sm:grid-cols-2 dark:text-gray-300">
                        <p>
                            <strong>Kilometraje anterior:</strong> {kilometrajeAnterior}
                        </p>
                        <p>
                            <strong>Surtido ideal:</strong> {(kilometraje - kilometrajeAnterior)*0.35}
                        </p>
                        <p>
                            <strong>Precio unitario:</strong> ${precioUnitario}
                        </p>
                        <p>
                            <strong>Precio total:</strong> ${(Number(litros) * precioUnitario).toFixed(2)}
                        </p>
                    </div>

                    {/* Campos dinámicos */}
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {fields.map((field) => (
                            <div key={field.id} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{field.label}</label>

                                {field.type === 'textarea' ? (
                                    <textarea
                                        value={formValues[field.id] as string}
                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                        placeholder={field.placeholder}
                                        className="w-full rounded border px-3 py-2 text-sm"
                                        rows={3}
                                    />
                                ) : (
                                    <input
                                        type="number"
                                        value={formValues[field.id] as string}
                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                        placeholder={field.placeholder}
                                        className="w-full rounded border px-3 py-2 text-sm"
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Botón de acción */}
                    <div className="mt-6 text-right">
                        <button
                            onClick={registrarSurtido}
                            disabled={processing}
                            className="rounded bg-[#49af4e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4fbb55]"
                        >
                            {processing ? 'Registrando...' : 'Registrar surtido'}
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
