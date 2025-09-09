import { useEffect, useState } from 'react';

export interface Field {
    id: string;
    label: string;
    type: string;
    placeholder?: string;
    options?: { value: string; label: string }[];
}

export function useFormLogic<T extends Record<string, string>>(initialData: T, fields: Field[]) {
    const [formValues, setFormValues] = useState<T>(() => initialData || ({} as T));
    const [isEditing, setIsEditing] = useState(false);
    const [hasFechasInvalidas, setHasFechasInvalidas] = useState(false);

    useEffect(() => {
        const isValid = initialData && typeof initialData === 'object' && !Array.isArray(initialData);
        setFormValues(isValid ? initialData : ({} as T));
        setIsEditing(isValid && Object.keys(initialData).length > 0);
    }, [initialData]);

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

    return { formValues, isEditing, hasFechasInvalidas, handleChange };
}
