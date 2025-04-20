<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function upload(Request $request)
    {
        
        try {
            // Vérifier si un fichier est présent
            if (!$request->hasFile('file')) {
                return response()->json([
                    'message' => 'Aucun fichier n\'a été envoyé',
                    'errors' => ['file' => ['Le champ file est requis']]
                ], 422);
            }

            $request->validate([
                'file' => 'required|file|mimes:pdf,mp4,mov,ogg,doc,docx,jpg,jpeg,png|max:102400',
                'type' => 'required|string|in:lesson,profile,course'
            ]);

            $file = $request->file('file');
            $type = $request->type;
            $extension = $file->getClientOriginalExtension();
            $filename = Str::random(40) . '.' . $extension;

            $path = $file->storeAs(
                $type . '/content',
                $filename,
                'public'
            );

            return response()->json([
                'message' => 'Fichier téléchargé avec succès',
                'path' => $path,
                'url' => Storage::url($path)
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors du téléchargement du fichier',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}