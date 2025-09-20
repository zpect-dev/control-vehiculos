<?php

namespace App\Services;

use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Illuminate\Support\Facades\Storage;

class Multimedia
{
    protected $rutasGuardado = [
        'diario' => 'uploads/fotos-diarias',
        'asignacion' => 'uploads/fotos-asignaciones',
        'documentos' => 'uploads/fotos-documentos',
        'pdf' => 'uploads/pdf-documentos'
    ];

    public function guardarImagen($image, $tipo)
    {
        $nameImage = Str::uuid() . '.' . $image->extension();
        $serverImage = ImageManager::gd()->read($image);
        $serverImage->cover(1200, 800);

        if(!array_key_exists($tipo, $this->rutasGuardado)){
            return false;
        }

        $targetPath = $this->rutasGuardado[$tipo];
        $respuesta = Storage::disk('public')->put($targetPath . '/' . $nameImage, $serverImage->encode());

        return $respuesta ? $nameImage : false;
    }

    public function guardarArchivoPdf($archivo, $tipo)
    {
        if ($archivo->getClientMimeType() !== 'application/pdf') {
            return false;
        }

        if (!array_key_exists($tipo, $this->rutasGuardado)) {
            return false;
        }

        $nameFile = Str::uuid() . '.pdf';
        $targetPath = $this->rutasGuardado[$tipo];
        $rutaCompleta = $targetPath . '/' . $nameFile;

        $respuesta = Storage::disk('public')->put($rutaCompleta, file_get_contents($archivo));

        return $respuesta ? $nameFile : false;
    }
}