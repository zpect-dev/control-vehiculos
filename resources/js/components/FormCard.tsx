import { useEffect, useState } from 'react';

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
    title?: string;
    fields: Field[];
    buttonText?: string;
    formType?: 'expediente' | 'permisologia';
    onSubmit?: (formData: Record<string, string>) => void;
    children?: React.ReactNode;
    expediente?: Record<string, string>;
}

export default function FormCard({ title, fields, buttonText, formType = 'expediente', onSubmit, expediente = {} }: FormCardProps) {
    const [formValues, setFormValues] = useState<Record<string, string>>(() => expediente || {});

    const [hasFechasInvalidas, setHasFechasInvalidas] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        console.log('Expediente recibido en FormCard:', expediente);
        setFormValues(expediente);
        setIsEditing(Object.keys(expediente).length > 0);
    }, [expediente]);

    useEffect(() => {
        const invalid = fields.some((field) => {
            if (field.type === 'date') {
                const exp = formValues[`${field.id}_expedicion`];
                const ven = formValues[`${field.id}_vencimiento`];
                return exp && ven && new Date(ven) < new Date(exp);
            }
            return false;
        });
        setHasFechasInvalidas(invalid);
    }, [formValues, fields]);

    const handleChange = (id: string, value: string) => {
        setFormValues((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (hasFechasInvalidas) {
            alert('Hay fechas inválidas. Corrige antes de guardar.');
            return;
        }
        if (onSubmit) {
            onSubmit(formValues);
        }
    };

    const renderField = (field: Field) => {
        switch (field.type) {
            case 'date': {
                const exp = formValues[`${field.id}_expedicion`] || '';
                const ven = formValues[`${field.id}_vencimiento`] || '';
                const fechaInvalida = exp && ven && new Date(ven) < new Date(exp);

                return (
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <label htmlFor={`${field.id}-expedicion`} className="text-xs text-gray-500 dark:text-gray-400">
                                Fecha de Expedición
                            </label>
                            <input
                                id={`${field.id}-expedicion`}
                                type="date"
                                value={exp}
                                onChange={(e) => handleChange(`${field.id}_expedicion`, e.target.value)}
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
                                value={ven}
                                onChange={(e) => handleChange(`${field.id}_vencimiento`, e.target.value)}
                                className={`rounded-md border px-3 py-2 text-sm shadow-sm transition focus:outline-none ${
                                    fechaInvalida
                                        ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                                        : 'border-gray-300 focus:border-[#49af4e] focus:ring-2 focus:ring-[#49af4e]'
                                } dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                            />
                            {fechaInvalida && (
                                <p className="mt-1 text-xs text-red-500">La fecha de vencimiento no puede ser anterior a la de expedición.</p>
                            )}
                        </div>
                    </div>
                );
            }
            case 'select':
                return (
                    <div className="flex flex-col gap-3">
                        <select
                            id={`${field.id}-estado`}
                            value={formValues[field.id] || ''}
                            onChange={(e) => handleChange(field.id, e.target.value)}
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
                            value={formValues[`${field.id}_descripcion`] || ''}
                            onChange={(e) => handleChange(`${field.id}_descripcion`, e.target.value)}
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
                        value={formValues[field.id] || ''}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-[#49af4e] focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                );
        }
    };

    return (
        <div className="mx-auto w-full max-w-5xl rounded-xl border bg-gray-100 px-8 py-4 shadow-lg dark:bg-gray-800">
            {title && <h2 className="pb-4 text-center text-2xl font-semibold text-gray-800 dark:text-gray-100">{title}</h2>}
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
                        disabled={hasFechasInvalidas}
                        className={`w-full rounded-full px-6 py-3 text-base font-semibold shadow-md transition-transform duration-200 md:w-auto ${
                            hasFechasInvalidas
                                ? 'cursor-not-allowed bg-gray-400 text-white'
                                : 'bg-[#49af4e] text-white hover:scale-105 hover:bg-[#3d9641] focus:ring-2 focus:ring-[#49af4e] focus:ring-offset-2 focus:outline-none'
                        }`}
                    >
                        {buttonText ||
                            (isEditing
                                ? formType === 'permisologia'
                                    ? 'Actualizar Permisología'
                                    : 'Actualizar Expediente'
                                : formType === 'permisologia'
                                  ? 'Guardar Permisología'
                                  : 'Guardar Expediente')}
                    </button>
                </div>
            </form>
        </div>
    );
}
