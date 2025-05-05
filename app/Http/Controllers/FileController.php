<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\Course;
use App\Models\Section;
use App\Models\Lesson;
use App\Models\Enrollment;

class FileController extends Controller
{
    /**
     * Télécharger un fichier
     */
    public function upload(Request $request)
    {
        try {
            // Valider le fichier
            $validator = Validator::make($request->all(), [
                'file' => 'required|file|max:10240', // 10MB maximum
                'type' => 'nullable|string|in:profile,course,lesson,resource',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Obtenir le fichier
            $file = $request->file('file');
            $type = $request->input('type', 'default');

            // Générer un nom de fichier unique
            $fileName = Str::random(40) . '.' . $file->getClientOriginalExtension();

            // Déterminer le dossier approprié
            $folder = $this->getFolderByType($type);

            // Stocker le fichier
            $path = $file->storeAs($folder, $fileName, 'public');

            // Construire l'URL complète du fichier
            $fullUrl = asset('storage/' . str_replace('public/', '', $path));

            // Retourner l'URL du fichier
            return response()->json([
                'status' => 'success',
                'message' => 'File uploaded successfully',
                'data' => [
                    'file_name' => $fileName,
                    'file_url' => $fullUrl,
                    'file_path' => $path,
                    'file_size' => $file->getSize(),
                    'file_type' => $file->getMimeType()
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to upload file',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir un fichier par son URL
     */
    public function getFile($fileName)
    {
        try {
            // Vérifier si le fichier existe dans le dossier uploads général
            if (Storage::disk('public')->exists('uploads/' . $fileName)) {
                $path = 'uploads/' . $fileName;
                $filePath = Storage::disk('public')->path($path);

                // Déterminer le type MIME du fichier
                $mime = mime_content_type($filePath);

                // Retourner le fichier avec le bon type MIME
                return response()->file($filePath, ['Content-Type' => $mime]);
            }

            // Vérifier dans les différents sous-dossiers
            $subfolders = [
                'uploads/lessons/content/',
                'uploads/lessons/videos/',
                'uploads/lessons/documents/',
                'uploads/lessons/pdf/',
                'lesson/content/',
                'lessons/content/',
                'lessons/documents/',
                'lessonContent/content/',
                'lessonResource/content/'
            ];

            foreach ($subfolders as $subfolder) {
                if (Storage::disk('public')->exists($subfolder . $fileName)) {
                    $path = $subfolder . $fileName;
                    $filePath = Storage::disk('public')->path($path);

                    // Déterminer le type MIME du fichier
                    $mime = mime_content_type($filePath);

                    // Retourner le fichier avec le bon type MIME
                    return response()->file($filePath, ['Content-Type' => $mime]);
                }
            }

            // Si nous arrivons ici, le fichier n'a pas été trouvé
            return response()->json([
                'status' => 'error',
                'message' => 'File not found'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to get file',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer un fichier
     */
    public function deleteFile(Request $request, $fileName)
    {
        try {
            // Vérifier si l'utilisateur est autorisé
            if (!$request->user() || !in_array($request->user()->role, ['admin', 'teacher'])) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 403);
            }

            // Vérifier si le fichier existe
            $filePath = 'uploads/' . $fileName;
            if (!Storage::disk('public')->exists($filePath)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'File not found'
                ], 404);
            }

            // Supprimer le fichier
            Storage::disk('public')->delete($filePath);

            return response()->json([
                'status' => 'success',
                'message' => 'File deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete file',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Déterminer le dossier de stockage en fonction du type de fichier
     */
    private function getFolderByType($type)
    {
        switch ($type) {
            case 'profile':
                return 'public/uploads/profiles';
            case 'course':
                return 'public/uploads/courses';
            case 'lesson':
                return 'public/uploads/lessons/content';
            case 'lesson_video':
                return 'public/uploads/lessons/videos';
            case 'lesson_document':
                return 'public/uploads/lessons/documents';
            case 'lesson_pdf':
                return 'public/uploads/lessons/pdf';
            case 'resource':
                return 'public/uploads/resources';
            default:
                return 'public/uploads/misc';
        }
    }

    /**
     * Servir un fichier de leçon directement
     */
    public function getLessonFile(Course $course, Section $section, Lesson $lesson, $fileName)
    {
        // Vérifier si l'utilisateur est authentifié
        $user = auth()->user();

        // Vérifier les autorisations
        $isEnrolled = $user && Enrollment::where('student_id', $user->id)
                          ->where('course_id', $course->id)
                          ->exists();
        $isInstructor = $user && $course->instructor_id === $user->id;
        $isAdmin = $user && $user->isAdmin();

        // Autoriser l'accès si la leçon est gratuite ou si l'utilisateur a les droits
        if ($lesson->is_free || $isEnrolled || $isInstructor || $isAdmin) {
            // Construire le chemin complet vers le fichier
            $path = storage_path('app/public/uploads/lessons/content/' . $fileName);

            if (!file_exists($path)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Fichier non trouvé'
                ], 404);
            }

            // Retourner le fichier
            return response()->file($path);
        }

        return response()->json([
            'success' => false,
            'message' => 'Non autorisé à accéder à ce fichier'
        ], 403);
    }
}
