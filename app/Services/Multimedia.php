<?php

namespace App\Services;

use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Illuminate\Support\Facades\Storage;

class Multimedia
{
    public function guardarImagen($image)
    {
        $nameImage = Str::uuid() . '.' . $image->extension();
        $serverImage = ImageManager::gd()->read($image);
        $serverImage->cover(1000, 1000);
        $targetPath = 'uploads/fotos-diarias';

        $respuesta = Storage::disk('public')->put($targetPath . '/' . $nameImage, $serverImage->encode());

        if(!$respuesta){
            return false;
        }

        return $nameImage;
    }
}