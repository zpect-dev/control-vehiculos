/* eslint-disable @typescript-eslint/no-explicit-any */
import { DateField } from '@/components/form-fields/DateField';
import { SelectField } from '@/components/form-fields/SelectField';
import { TextField } from '@/components/form-fields/TextField';
import { Field, useFormLogic } from '@/hooks/useFormLogic';
import { FormCardProps } from '@/types';
import { useState } from 'react';
import { CheckField } from './form-fields/CheckField';
import { FileField } from './form-fields/FileField';

export default function FormCard({
    title,
    fields,
    buttonText,
    formType = 'expediente',
    onSubmit,
    expediente = {},
    onChange,
}: FormCardProps) {
    const { formValues, isEditing, hasFechasInvalidas, hasCamposIncompletos, handleChange } = useFormLogic(expediente, fields);
    const [imagenModal, setImagenModal] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (hasFechasInvalidas) {
            alert('Hay fechas inválidas. Corrige antes de guardar.');
            return;
        }
        onSubmit?.(formValues);
    };

    const handleChangeWrapper = (id: string, value: any) => {
        handleChange(id, value);
        onChange?.({ ...formValues, [id]: value });
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
                        onChange={handleChangeWrapper}
                    />
                );

            case 'select':
                return <SelectField id={field.id} label={field.label} value={value} options={field.options} onChange={handleChangeWrapper} />;

            case 'file': {
                const safeFile = value instanceof File || value === null ? value : undefined;
                const baseId = field.id.replace('_archivo', '');
                const rawDocumento = expediente[`${baseId}_documento`] || expediente[field.id];
                const documentoActual = typeof rawDocumento === 'string' ? rawDocumento : undefined;

                return (
                    <div className="space-y-2">
                        <FileField id={field.id} label={field.label} value={safeFile} onChange={(id, file) => handleChangeWrapper(id, file)} />

                        {/* Vista previa del archivo recién cargado */}
                        {value instanceof File && (
                            <img
                                src={URL.createObjectURL(value)}
                                alt="Vista previa"
                                className="max-h-32 rounded border object-contain shadow-sm"
                            />
                        )}

                        {/* Archivo anterior si existe */}
                        {documentoActual &&
                            (/\.(pdf)$/i.test(documentoActual) ? (
                                <a
                                    href={`/storage/uploads/pdf-documentos/${documentoActual}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-sm text-blue-600 underline"
                                >
                                    Ver PDF actual
                                </a>
                            ) : (
                                <div
                                    className="max-h-48 cursor-pointer"
                                    onClick={() => setImagenModal(`/storage/uploads/fotos-documentos/${documentoActual}`)}
                                >
                                    <img
                                        src={`/storage/uploads/fotos-documentos/${documentoActual}`}
                                        alt="Documento actual"
                                        className="max-h-48 rounded border object-contain shadow-sm"
                                    />
                                </div>
                            ))}

                        {documentoActual && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Al subir un nuevo archivo, se reemplazará el documento actual.
                            </p>
                        )}
                    </div>
                );
            }

            case 'checkbox':
                return (
                    <CheckField
                        id={field.id}
                        label={field.label}
                        checked={value === true}
                        onChange={(id, checked) => handleChangeWrapper(id, checked)}
                    />
                );

            default:
                return (
                    <TextField
                        id={field.id}
                        label={field.label}
                        value={typeof value === 'string' ? value : ''}
                        placeholder={field.placeholder}
                        type={field.type}
                        onChange={handleChangeWrapper}
                    />
                );
        }
    };

    return (
        <div className="mx-auto w-full max-w-5xl rounded-xl border bg-gray-100 px-8 py-4 shadow-lg dark:bg-gray-800">
            {title && <h2 className="pb-4 text-center text-2xl font-semibold text-gray-800 dark:text-gray-100">{title}</h2>}
            <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1">
                    {fields.map((field) => (
                        <div key={field.id}>{renderField(field)}</div>
                    ))}
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={hasFechasInvalidas || hasCamposIncompletos}
                        className={`w-full rounded-full px-6 py-3 text-base font-semibold shadow-md transition-transform duration-200 md:w-auto ${
                            hasFechasInvalidas || hasCamposIncompletos
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

            {/* Modal para imagen ampliada */}
            {imagenModal && (
                <div className="bg-opacity-70 fixed inset-0 z-50 flex items-center justify-center bg-black" onClick={() => setImagenModal(null)}>
                    <img
                        src={imagenModal}
                        alt="Imagen ampliada"
                        className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
}
