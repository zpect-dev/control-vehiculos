/* eslint-disable @typescript-eslint/no-explicit-any */
interface FieldOption {
    value: string;
    label: string;
}

interface Field {
    id: string;
    label: string;
    type: string;
    placeholder?: string;
    options?: FieldOption[];
}

interface FormCardProps {
    title: string;
    fields: Field[];
    buttonText: string;
    onSubmit?: (formData: any) => void;
    children?: React.ReactNode;
}

export default function FormCard({ title, fields, buttonText, onSubmit }: FormCardProps) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData: Record<string, any> = {};

        fields.forEach((field) => {
            const input = document.getElementById(field.id) as HTMLInputElement;
            if (input) {
                formData[field.id] = input.value;
            }

            const estado = document.getElementById(`${field.id}-estado`) as HTMLSelectElement;
            if (estado) {
                formData[field.id] = estado.value;
            }

            const expedicion = document.getElementById(`${field.id}-expedicion`) as HTMLInputElement;
            const vencimiento = document.getElementById(`${field.id}-vencimiento`) as HTMLInputElement;
            if (expedicion && vencimiento) {
                formData[`${field.id}_expedicion`] = expedicion.value;
                formData[`${field.id}_vencimiento`] = vencimiento.value;
            }
        });

        if (onSubmit) {
            onSubmit(formData);
        }
    };

    const renderField = (field: Field) => {
        switch (field.type) {
            case 'date':
                return (
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <label htmlFor={`${field.id}-expedicion`} className="text-xs text-gray-500 dark:text-gray-400">
                                Fecha de Expedición
                            </label>
                            <input
                                id={`${field.id}-expedicion`}
                                type="date"
                                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-[#49af4e] focus:ring-2 focus:ring-[#49af4e] focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor={`${field.id}-vencimiento`} className="text-xs text-gray-500 dark:text-gray-400">
                                Fecha de Vencimiento
                            </label>
                            <input
                                id={`${field.id}-vencimiento`}
                                type="date"
                                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-[#49af4e] focus:ring-2 focus:ring-[#49af4e] focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>
                );
            case 'select':
                return (
                    <div className="flex flex-col gap-3">
                        <select
                            id={`${field.id}-estado`}
                            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition focus:border-[#49af4e] focus:ring-2 focus:ring-[#49af4e] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Seleccionar estado</option>
                            {field.options?.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <input
                            id={`${field.id}-descripcion`}
                            placeholder="Descripción del accesorio"
                            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-[#49af4e] focus:ring-2 focus:ring-[#49af4e] focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                );
            default:
                return (
                    <input
                        id={field.id}
                        type={field.type}
                        placeholder={field.placeholder}
                        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-[#49af4e] focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                );
        }
    };

    return (
        <div className="mx-auto w-full max-w-5xl rounded-xl border bg-gray-100 px-8 py-6 shadow-lg dark:bg-gray-800">
            <h2 className="text-center text-2xl font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
            <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
                    {fields.map((field) => (
                        <div key={field.id} className="flex flex-col gap-2">
                            <label htmlFor={field.id} className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                {field.label}
                            </label>
                            {renderField(field)}
                        </div>
                    ))}
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="w-full rounded-full bg-[#49af4e] px-6 py-3 text-base font-semibold text-white shadow-md transition-transform duration-200 hover:scale-105 hover:bg-[#3d9641] focus:ring-2 focus:ring-[#49af4e] focus:ring-offset-2 focus:outline-none md:w-auto"
                    >
                        {buttonText}
                    </button>
                </div>
            </form>
        </div>
    );
}
