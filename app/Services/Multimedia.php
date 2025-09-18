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
        'documentos' => 'uploads/fotos-documentos'
    ];

    public function guardarImagen($image, $tipo)
    {
        $nameImage = Str::uuid() . '.' . $image->extension();
        $serverImage = ImageManager::gd()->read($image);
        $serverImage->cover(1000, 1000);

        if(!array_key_exists($tipo, $this->rutasGuardado)){
            return false;
        }

        $targetPath = $this->rutasGuardado[$tipo];
        $respuesta = Storage::disk('public')->put($targetPath . '/' . $nameImage, $serverImage->encode());

        if(!$respuesta){
            return false;
        }

        return $nameImage;
    }
}