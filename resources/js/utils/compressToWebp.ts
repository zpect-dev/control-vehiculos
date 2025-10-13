import imageCompression from 'browser-image-compression';

export type WebpCompressOptions = {
    maxWidthOrHeight?: number; // 1600–2400 recomendado; 2000 es un buen balance
    targetSizeMB?: number; // ~1.0–1.5 MB por imagen
    initialQuality?: number; // opcional; si usas targetSizeMB, no es necesario
    useWebWorker?: boolean;
    onProgress?: (progress: number) => void;
};

// Intenta exportar a WebP; si el navegador no puede, cae a JPEG.
// Si falla por completo (p.ej. HEIC sin soporte), retorna el original.
export async function compressToWebp(
    file: File,
    { maxWidthOrHeight = 2000, targetSizeMB = 1.2, initialQuality, useWebWorker = true, onProgress }: WebpCompressOptions = {},
): Promise<File> {
    try {
        // Intento WebP
        const webpBlob = await imageCompression(file, {
            maxWidthOrHeight,
            maxSizeMB: targetSizeMB,
            initialQuality,
            fileType: 'image/webp',
            useWebWorker,
            onProgress,
        });

        if (webpBlob.type.includes('webp')) {
            const name = file.name.replace(/\.\w+$/, '.webp');
            return new File([webpBlob], name, { type: 'image/webp', lastModified: Date.now() });
        }

        // Si no salió como WebP, probamos JPEG
        const jpegBlob = await imageCompression(file, {
            maxWidthOrHeight,
            maxSizeMB: targetSizeMB,
            initialQuality: typeof initialQuality === 'number' ? initialQuality : 0.8,
            fileType: 'image/jpeg',
            useWebWorker,
            onProgress,
        });
        const jpegName = file.name.replace(/\.\w+$/, '.jpg');
        return new File([jpegBlob], jpegName, { type: 'image/jpeg', lastModified: Date.now() });
    } catch {
        // Fallback: sube el original si algo falla (p.ej. HEIC sin soporte)
        return file;
    }
}
