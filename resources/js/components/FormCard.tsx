import { DateField } from '@/components/form-fields/DateField';
import { SelectField } from '@/components/form-fields/SelectField';
import { TextField } from '@/components/form-fields/TextField';
import { Field, useFormLogic } from '@/hooks/useFormLogic';
import { CheckField } from './form-fields/CheckField';
import { FileField } from './form-fields/FileField';

interface FormCardProps {
    title?: string;
    fields: Field[];
    buttonText?: string;
    formType?: 'expediente' | 'permisologia' | 'accesorios' | 'piezas' | 'revisionFluidos' | 'asignacion';
    onSubmit?: (formData: Record<string, string | boolean | File | null>) => void;
    expediente?: Record<string | number, string | boolean | File | null>;
}

export default function FormCard({ title, fields, buttonText, formType = 'expediente', onSubmit, expediente = {} }: FormCardProps) {
    const { formValues, isEditing, hasFechasInvalidas, handleChange } = useFormLogic(expediente, fields);
console.log(expediente)
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (hasFechasInvalidas) {
            alert('Hay fechas inválidas. Corrige antes de guardar.');
            return;
        }
        onSubmit?.(formValues);
    };

    const renderField = (field: Field) => {
        const value = formValues[field.id];

        switch (field.type) {
            case 'date':
                return (
                    <DateField
                        id={field.id}
                        label={field.label}
                        expedicion={typeof formValues[`${field.id}_expedicion`] === 'string' ? formValues[`${field.id}_expedicion`] : ''}
                        vencimiento={typeof formValues[`${field.id}_vencimiento`] === 'string' ? formValues[`${field.id}_vencimiento`] : ''}
                        onChange={handleChange}
                    />
                );

            case 'select':
                return (
                    <SelectField
                        id={field.id}
                        label={field.label}
                        value={value}
                        options={field.options}
                        onChange={handleChange}
                    />
                );

            case 'file': {
                const safeFile = typeof value === 'string' || value instanceof File || value === null ? value : undefined;
                return <FileField id={field.id} label={field.label} value={safeFile} onChange={(id, file) => handleChange(id, file)} />;
            }

            case 'checkbox':
                return (
                    <CheckField id={field.id} label={field.label} checked={value === true} onChange={(id, checked) => handleChange(id, checked)} />
                );

            default:
                return (
                    <TextField
                        id={field.id}
                        label={field.label}
                        value={typeof value === 'string' ? value : ''}
                        placeholder={field.placeholder}
                        type={field.type}
                        onChange={handleChange}
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
