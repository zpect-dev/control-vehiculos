import { FileFieldProps } from '@/types';
import { useEffect, useState } from 'react';

export function FileField({ id, label, value, onChange }: FileFieldProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (value instanceof File) {
            const url = URL.createObjectURL(value);
            setPreviewUrl(url);
            return;
        }
        if (typeof value === 'string' && value) {
            if (value.startsWith('/storage') || value.startsWith('http://') || value.startsWith('https://')) {
                setPreviewUrl(value);
                return;
            }
        }
        setPreviewUrl(null);
    }, [value]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        onChange(id, file);

        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            setPreviewUrl(null);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">{label}</label>
            <div className="flex flex-col gap-1">
                <label htmlFor={id} className="text-xs text-gray-500 dark:text-gray-400">
                    {label}
                </label>
                <input
                    type="file"
                    id={id}
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
            </div>
            {previewUrl && (
                <img
                    src={previewUrl}
                    alt="Vista previa"
                    className="mt-2 h-32 w-auto rounded-md border object-contain shadow"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.opacity = '0.4';
                        (e.target as HTMLImageElement).title = 'No se pudo cargar la imagen';
                    }}
                />
            )}
        </div>
    );
}
