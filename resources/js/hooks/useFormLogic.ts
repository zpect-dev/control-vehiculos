import { useEffect, useState } from 'react';

export interface Field {
    id: string;
    label: string;
    type: 'text' | 'select' | 'date' | 'file' | 'checkbox' | 'number' | 'textarea';
    placeholder?: string;
    options?: { value: string; label: string }[];
    required: boolean;
}

export function useFormLogic<T extends Record<string, string | boolean | File | null>>(initialData: T, fields: Field[]) {
    const [formValues, setFormValues] = useState<T>(() => {
        const isValid = initialData && typeof initialData === 'object' && !Array.isArray(initialData);
        if (isValid && Object.keys(initialData).length > 0) {
            return initialData;
        } else {
            const defaultValues = fields.reduce((acc, field) => {
                if (field.type === 'checkbox') {
                    return { ...acc, [field.id]: false };
                }
                if (field.type === 'file') {
                    return { ...acc, [field.id]: null };
                }
                if (field.type === 'number') {
                    return { ...acc, [field.id]: '' };
                }
                return { ...acc, [field.id]: '' };
            }, {} as T);
            return defaultValues;
        }
    });
    const [isEditing, setIsEditing] = useState(false);
    const [hasFechasInvalidas, setHasFechasInvalidas] = useState(false);
    const [hasCamposIncompletos, setHasCamposIncompletos] = useState(false);
    useEffect(() => {
        const incompletos = fields.some((field) => {
            const value = formValues[field.id];

            if (!field.required) return false;

            if (field.type === 'checkbox') return false;
            if (field.type === 'file') return !(value instanceof File || typeof value === 'string');
            if (field.type === 'select') return typeof value !== 'string' || value.trim() === '';
            if (field.type === 'number') {
                if (typeof value === 'string') return value.trim() === '';
                return value == null;
            }

            return typeof value === 'string' ? value.trim() === '' : value == null;
        });

        setHasCamposIncompletos(incompletos);
    }, [formValues, fields]);

    useEffect(() => {
        const isValid = initialData && typeof initialData === 'object' && !Array.isArray(initialData);
        setIsEditing(isValid && Object.keys(initialData).length > 0);
    }, [initialData]);
    useEffect(() => {
        const invalid = fields.some((field) => {
            if (field.type === 'date') {
                const exp = formValues[`${field.id}_expedicion`];
                const ven = formValues[`${field.id}_vencimiento`];
                const isExpValida = typeof exp === 'string' && exp !== '';
                const isVenValida = typeof ven === 'string' && ven !== '';
                return isExpValida && isVenValida && new Date(ven) < new Date(exp);
            }
            return false;
        });
        setHasFechasInvalidas(invalid);
    }, [formValues, fields]);

    const handleChange = (id: string, value: string | boolean | File | null) => {
        setFormValues((prev) => ({ ...prev, [id]: value }));
    };

    return { formValues, isEditing, hasFechasInvalidas, hasCamposIncompletos, handleChange };
}
