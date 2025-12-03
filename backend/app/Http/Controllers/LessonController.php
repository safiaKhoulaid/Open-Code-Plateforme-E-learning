<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Section;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\Enrollment;
use App\Models\Certificate;

class LessonController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Course $course, Section $section)
    {
        try {
            // Validation initiale sans le content_url pour le cas d'un fichier
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'order' => 'required|integer|min:0',
                'content_type' => 'required|string|in:video,document,quiz,pdf',
                'duration' => 'required|integer|min:0',
                'is_free' => 'boolean',
                'is_published' => 'boolean'
            ]);

            // Si content_url est fourni comme URL, on le valide
            if ($request->has('content_url') && !$request->hasFile('content_url')) {
                $urlValidation = $request->validate([
                    'content_url' => 'string'
                ]);
                $validated['content_url'] = $urlValidation['content_url'];
            } else {
                // Si aucun content_url n'est fourni, définir une valeur par défaut ou null
                // Ceci permet de satisfaire la contrainte du modèle Lesson mais sera mis à jour plus tard
                $validated['content_url'] = null;
            }

            // Créer la leçon avec les champs validés
            $lesson = $section->lessons()->create($validated);

            // Gérer l'upload du fichier si présent comme content_url
            if ($request->hasFile('content_url')) {
                // Utiliser FileController pour l'upload du fichier
                $fileController = new FileController();

                // Déterminer le type de fichier en fonction du content_type
                $fileType = 'lesson';
                if (isset($validated['content_type'])) {
                    switch ($validated['content_type']) {
                        case 'video':
                            $fileType = 'lesson_video';
                            break;
                        case 'document':
                            $fileType = 'lesson_document';
                            break;
                        case 'pdf':
                            $fileType = 'lesson_pdf';
                            break;
                    }
                }

                // Créer une nouvelle requête pour l'envoi du fichier
                $fileRequest = new Request();
                $fileRequest->merge([
                    'file' => $request->file('content_url'),
                    'type' => $fileType
                ]);

                // Appeler la méthode upload du FileController
                $uploadResponse = $fileController->upload($fileRequest);
                $uploadData = json_decode($uploadResponse->getContent(), true);

                // Si l'upload a réussi, mettre à jour l'URL du contenu de la leçon
                if ($uploadResponse->getStatusCode() === 200 && $uploadData['status'] === 'success') {
                    $lesson->content_url = $uploadData['data']['file_url'];
                    $lesson->save();
                }
            }
            // Gérer l'upload si file est présent (compatibilité avec l'implémentation précédente)
            else if ($request->hasFile('file')) {
                $fileController = new FileController();

                // Déterminer le type de fichier en fonction du content_type
                $fileType = 'lesson';
                if (isset($validated['content_type'])) {
                    switch ($validated['content_type']) {
                        case 'video':
                            $fileType = 'lesson_video';
                            break;
                        case 'document':
                            $fileType = 'lesson_document';
                            break;
                        case 'pdf':
                            $fileType = 'lesson_pdf';
                            break;
                    }
                }

                $fileRequest = new Request();
                $fileRequest->merge([
                    'file' => $request->file('file'),
                    'type' => $fileType
                ]);

                $uploadResponse = $fileController->upload($fileRequest);
                $uploadData = json_decode($uploadResponse->getContent(), true);

                if ($uploadResponse->getStatusCode() === 200 && $uploadData['status'] === 'success') {
                    $lesson->content_url = $uploadData['data']['file_url'];
                    $lesson->save();
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Leçon créée avec succès',
                'data' => $lesson
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de la leçon',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function edit(Lesson $lesson)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Course $course, Section $section, Lesson $lesson)
    {
        try {
            // Validation initiale sans le content_url pour le cas d'un fichier
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'order' => 'required|integer|min:0',
                'content_type' => 'required|string|in:video,document,quiz,pdf',
                'duration' => 'required|integer|min:0',
                'is_free' => 'boolean',
                'is_published' => 'boolean'
            ]);

            // Si content_url est fourni comme URL, on le valide
            if ($request->has('content_url') && !$request->hasFile('content_url')) {
                $urlValidation = $request->validate([
                    'content_url' => 'string'
                ]);
                $validated['content_url'] = $urlValidation['content_url'];
            } else if (!$request->hasFile('content_url') && !$request->hasFile('file')) {
                // Si on ne met pas à jour le content_url, conserver la valeur existante
                // Ne pas inclure content_url dans $validated pour ne pas écraser la valeur existante
                unset($validated['content_url']);
            }

            // Gérer l'upload du fichier si présent comme content_url
            if ($request->hasFile('content_url')) {
                // Utiliser FileController pour l'upload du fichier
                $fileController = new FileController();

                // Déterminer le type de fichier en fonction du content_type
                $fileType = 'lesson';
                if (isset($validated['content_type'])) {
                    switch ($validated['content_type']) {
                        case 'video':
                            $fileType = 'lesson_video';
                            break;
                        case 'document':
                            $fileType = 'lesson_document';
                            break;
                        case 'pdf':
                            $fileType = 'lesson_pdf';
                            break;
                    }
                }

                // Créer une nouvelle requête pour l'envoi du fichier
                $fileRequest = new Request();
                $fileRequest->merge([
                    'file' => $request->file('content_url'),
                    'type' => $fileType
                ]);

                // Appeler la méthode upload du FileController
                $uploadResponse = $fileController->upload($fileRequest);
                $uploadData = json_decode($uploadResponse->getContent(), true);

                // Si l'upload a réussi, mettre à jour l'URL du contenu de la leçon
                if ($uploadResponse->getStatusCode() === 200 && $uploadData['status'] === 'success') {
                    $validated['content_url'] = $uploadData['data']['file_url'];
                }
            }
            // Gérer l'upload si file est présent (compatibilité avec l'implémentation précédente)
            else if ($request->hasFile('file')) {
                $fileController = new FileController();

                // Déterminer le type de fichier en fonction du content_type
                $fileType = 'lesson';
                if (isset($validated['content_type'])) {
                    switch ($validated['content_type']) {
                        case 'video':
                            $fileType = 'lesson_video';
                            break;
                        case 'document':
                            $fileType = 'lesson_document';
                            break;
                        case 'pdf':
                            $fileType = 'lesson_pdf';
                            break;
                    }
                }

                $fileRequest = new Request();
                $fileRequest->merge([
                    'file' => $request->file('file'),
                    'type' => $fileType
                ]);

                $uploadResponse = $fileController->upload($fileRequest);
                $uploadData = json_decode($uploadResponse->getContent(), true);

                if ($uploadResponse->getStatusCode() === 200 && $uploadData['status'] === 'success') {
                    $lesson->content_url = $uploadData['data']['file_url'];
                    $lesson->save();
                }
            }

            $lesson->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Leçon mise à jour avec succès',
                'data' => $lesson
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour de la leçon',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course, Section $section, Lesson $lesson)
    {
        $this->authorize('update', $course);

        if ($lesson->content_url) {
            Storage::disk('public')->delete($lesson->content_url);
        }

        $lesson->delete();

        return back()->with('success', 'Leçon supprimée avec succès.');
    }

    public function reorder(Request $request, Course $course, Section $section)
    {
        $this->authorize('update', $course);

        $validated = $request->validate([
            'lessons' => 'required|array',
            'lessons.*' => 'exists:lessons,id'
        ]);

        foreach ($validated['lessons'] as $index => $lessonId) {
            Lesson::where('id', $lessonId)->update(['order' => $index]);
        }

        return response()->json(['message' => 'Ordre des leçons mis à jour avec succès.']);
    }

    public function togglePublish(Course $course, Section $section, Lesson $lesson)
    {
        $this->authorize('update', $course);

        $lesson->update([
            'is_published' => !$lesson->is_published
        ]);

        return back()->with('success', $lesson->is_published ? 'Leçon publiée avec succès.' : 'Leçon dépubliée avec succès.');
    }

    public function toggleFree(Course $course, Section $section, Lesson $lesson)
    {
        $this->authorize('update', $course);

        $lesson->update([
            'is_free' => !$lesson->is_free
        ]);

        return back()->with('success', $lesson->is_free ? 'Leçon marquée comme gratuite.' : 'Leçon marquée comme payante.');
    }

    public function watch(Course $course, Section $section, Lesson $lesson, Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non authentifié'
            ], 401);
        }

        // Vérifier que l'utilisateur est inscrit au cours ou est l'instructeur
        // $isEnrolled = $user->enrolledCourses()->where('course_id', $course->id)->exists();
        // $isInstructor = $course->instructor_id === $user->id;

        // if (!$isEnrolled && !$isInstructor && !$user->isAdmin() && !$lesson->is_free) {
        //     return response()->json([
        //         'success' => false,
        //         'message' => 'Non autorisé à voir cette leçon'
        //     ], 403);
        // }

        // $lesson->load(['resources', 'quizzes']);

        // Traitement du content_url pour le frontend
        if ($lesson->content_url) {
            // Si c'est une URL complète (externe)
            if (filter_var($lesson->content_url, FILTER_VALIDATE_URL)) {
                // On conserve l'URL complète
                $lesson->content_access_url = $lesson->content_url;
            } else {
                // Si c'est une URL locale
                $fileName = basename($lesson->content_url);

                // Générer l'URL d'accès direct au fichier
                $lesson->content_access_url = url("/api/courses/{$course->id}/sections/{$section->id}/lessons/{$lesson->id}/files/{$fileName}");
            }
        }

        // Traiter les ressources de la même manière
        if ($lesson->resources && count($lesson->resources) > 0) {
            foreach ($lesson->resources as &$resource) {
                if ($resource->file_url) {
                    // Si c'est une URL complète (externe)
                    if (filter_var($resource->file_url, FILTER_VALIDATE_URL)) {
                        // On conserve l'URL complète
                        $resource->file_access_url = $resource->file_url;
                    } else {
                        // Si c'est une URL locale
                        $fileName = basename($resource->file_url);

                        // Générer l'URL d'accès direct au fichier
                        $resource->file_access_url = url("/api/files/{$fileName}");
                    }
                }
            }
        }

        return response()->json([
            'success' => true,
            'data' => $lesson
        ]);
    }

    // public function complete(Course $course, Section $section, Lesson $lesson, Request $request)
    // {
    //     $user = $request->user();
    //     if (!$user) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Utilisateur non authentifié'
    //         ], 401);
    //     }

    //     // Vérifier que l'utilisateur est inscrit au cours
    //     $isEnrolled = $user->enrolledCourses()->where('course_id', $course->id)->exists();
    //     if (!$isEnrolled) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Non inscrit à ce cours'
    //         ], 403);
    //     }

    //     $progress = $user->progress()->where('course_id', $course->id)->first();
    //     if (!$progress) {
    //         $progress = $user->progress()->create([
    //             'course_id' => $course->id,
    //             'completed_lessons' => [],
    //             'completion_percentage' => 0
    //         ]);
    //     }

    //     $completedLessons = $progress->completed_lessons;
    //     if (!in_array($lesson->id, $completedLessons)) {
    //         $completedLessons[] = $lesson->id;
    //         $progress->update([
    //             'completed_lessons' => $completedLessons,
    //             'completion_percentage' => (count($completedLessons) / $course->lessons()->count()) * 100
    //         ]);
    //     }

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Leçon marquée comme complétée',
    //         'data' => $progress
    //     ]);
    // }

    /**
     * Marquer une leçon comme complétée
     */
    // public function complete($courseId, $sectionId, $lessonId, Request $request)
    // {
    //     // Récupérer la leçon manuellement
    //     $lesson = Lesson::findOrFail($lessonId);

    //     $user = $request->user();
    //     if (!$user) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Utilisateur non authentifié'
    //         ], 401);
    //     }

    //     // Vérifier que l'utilisateur est inscrit au cours
    //     $enrollment = Enrollment::where('student_id', $user->id)
    //                      ->where('course_id', $course->id)
    //                      ->first();

    //     if (!$enrollment) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Non inscrit à ce cours'
    //         ], 403);
    //     }

    //     // Vérifier que la leçon appartient bien au cours
    //     $lessonBelongsToCourse = $lesson->section->course_id === $course->id;
    //     if (!$lessonBelongsToCourse) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Cette leçon n\'appartient pas à ce cours'
    //         ], 400);
    //     }

    //     $lesson->update([
    //         'is_completed' => true
    //     ]);

    //     return response()->json([
    //         'success' => true,
    //     ]);
    // }

    // /**
    ////arquer une leçon comme complétée et vérifier si le cours est complété
     //


     public function complete($courseId, $sectionId, $lessonId, Request $request){
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non authentifié'
            ], 401);
        }
        $course = Course::findOrFail($courseId);
        $section = Section::findOrFail($sectionId);
        $lesson = Lesson::findOrFail($lessonId);
        $lesson->is_completed = true;
        $lesson->save();

        return response()->json([
            'success' => true,
            'message' => 'Leçon marquée comme complétée'
        ]);


     }
    private function generateCertificate($user, $course)
    {
        // Vérifier si un certificat existe déjà
        $certificateExists = Certificate::where('user_id', $user->id)
                               ->where('course_id', $course->id)
                               ->exists();

        if (!$certificateExists && $course->has_certificate) {
            // Générer un numéro de certificat unique
            $certificateNumber = 'CERT-' . $course->id . '-' . $user->id . '-' . time();

            // Créer le certificat
            Certificate::create([
                'user_id' => $user->id,
                'course_id' => $course->id,
                'certificate_number' => $certificateNumber,
                'issue_date' => now(),
                'expiry_date' => null, // Vous pouvez définir une date d'expiration si nécessaire
                'status' => 'active',
                'student_name' => $user->firstName . ' ' . $user->lastName,
                'course_title' => $course->title,
                'instructor_name' => $course->instructor->firstName . ' ' . $course->instructor->lastName,
                'verification_url' => url('/verify-certificate/' . $certificateNumber),
                'skills' => $course->what_you_will_learn
            ]);

            // Vous pouvez également envoyer une notification à l'utilisateur ici
        }
    }

    /**
     * Récupérer toutes les leçons d'un cours
     */
    public function getLessonsByCourse(Course $course)
    {
        $lessons = Lesson::whereHas('section', function($query) use ($course) {
            $query->where('course_id', $course->id);
        })->get();

        return response()->json([
            'success' => true,
            'data' => $lessons
        ]);
    }
}
