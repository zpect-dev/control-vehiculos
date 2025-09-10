import { DateField } from '@/components/form-fields/DateField';
import { SelectField } from '@/components/form-fields/SelectField';
import { TextField } from '@/components/form-fields/TextField';
import { Field, useFormLogic } from '@/hooks/useFormLogic';

interface FormCardProps {
    title?: string;
    fields: Field[];
    buttonText?: string;
    formType?: 'expediente' | 'permisologia' | 'accesorios' | 'piezas';
    onSubmit?: (formData: Record<string, string>) => void;
    expediente?: Record<string, string>;
}

export default function FormCard({ title, fields, buttonText, formType = 'expediente', onSubmit, expediente = {} }: FormCardProps) {
    const { formValues, isEditing, hasFechasInvalidas, handleChange } = useFormLogic(expediente, fields);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (hasFechasInvalidas) {
            alert('Hay fechas inválidas. Corrige antes de guardar.');
            return;
        }
        onSubmit?.(formValues);
    };

    const renderField = (field: Field) => {
        const value = formValues[field.id] !== undefined ? String(formValues[field.id]) : '';

        if (field.type === 'date') {
            return (
                <DateField
                    id={field.id}
                    label={field.label}
                    expedicion={formValues[`${field.id}_expedicion`] || ''}
                    vencimiento={formValues[`${field.id}_vencimiento`] || ''}
                    onChange={handleChange}
                />
            );
        }

        if (field.type === 'select') {
            return <SelectField id={field.id} label={field.label} value={value} options={field.options} onChange={handleChange} />;
        }

        return (
            <TextField id={field.id} label={field.label} value={value} placeholder={field.placeholder} type={field.type} onChange={handleChange} />
        );
    };

    return (
        <div className="mx-auto w-full max-w-5xl rounded-xl border bg-gray-100 px-8 py-4 shadow-lg dark:bg-gray-800">
            {title && <h2 className="pb-4 text-center text-2xl font-semibold text-gray-800 dark:text-gray-100">{title}</h2>}
            <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
                    {fields.map((field) => (
                        <div key={field.id}>{renderField(field)}</div>
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
                                ? `Actualizar ${formType.charAt(0).toUpperCase() + formType.slice(1)}`
                                : `Guardar ${formType.charAt(0).toUpperCase() + formType.slice(1)}`)}
                    </button>
                </div>
            </form>
        </div>
    );
}
