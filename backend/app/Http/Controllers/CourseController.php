<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Models\Section;
use Illuminate\Support\Facades\Storage;
use App\Models\Progress;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CourseController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function store(Request $request): JsonResponse
    {
        try {
            // Augmenter la taille maximale pour la validation (50MB)
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'subtitle' => 'nullable|string|max:255',
                'description' => 'required|string',
                'level' => 'required|string',
                'language' => 'required|string',
                'price' => 'required|numeric|min:0',
                'discount' => 'nullable|numeric|min:0',
                'category_id' => 'required|numeric',
                'instructor_id' => 'required|numeric',
                'image_url' => 'nullable|string',
                'video_url' => 'nullable|string',
                'requirements' => 'nullable|array',
                'what_you_will_learn' => 'nullable|array',
                'target_audience' => 'nullable|array',
                'has_certificate' => 'boolean'
            ]);

            $category = Category::find($validated['category_id']);
            if (!$category || !$category->is_active) {
                return response()->json(['message' => 'La catégorie spécifiée n\'existe pas ou n\'est pas active'], 404);
            }

            // Générer un slug unique basé sur le titre
            $slug = Str::slug($validated['title']);
            $count = 1;

            // Vérifier si le slug existe déjà et le rendre unique si nécessaire
            while (Course::where('slug', $slug)->exists()) {
                $slug = Str::slug($validated['title']) . '-' . $count;
                $count++;
            }

            $validated['slug'] = $slug;

            // Traiter l'image en base64 si elle est fournie
            if (isset($validated['image_url']) && preg_match('/^data:image\/(\w+);base64,/', $validated['image_url'])) {
                $imageData = substr($validated['image_url'], strpos($validated['image_url'], ',') + 1);
                $imageData = base64_decode($imageData);

                if ($imageData === false) {
                    return response()->json(['message' => 'Impossible de décoder l\'image en base64'], 400);
                }

                $filename = 'course_' . time() . '_' . Str::random(10) . '.jpg';
                $path = 'courses/images/' . $filename;

                Storage::disk('public')->put($path, $imageData);
                $validated['image_url'] = $path;
            }

            // Traiter la vidéo en base64 si elle est fournie
            if (isset($validated['video_url']) && preg_match('/^data:video\/(\w+);base64,/', $validated['video_url'])) {
                // Extraire les données base64
                $videoData = substr($validated['video_url'], strpos($validated['video_url'], ',') + 1);

                // Pour les gros fichiers, traiter par morceaux
                $this->processLargeBase64File($videoData, 'courses/videos', function($path) use (&$validated) {
                    $validated['video_url'] = $path;
                });
            }

            // Traiter le contenu en base64 s'il est fourni (vidéo ou autre)
            if (isset($validated['content_url'])) {
                // Vérifier si c'est une vidéo en base64
                if (preg_match('/^data:video\/(\w+);base64,/', $validated['content_url'])) {
                    $contentData = substr($validated['content_url'], strpos($validated['content_url'], ',') + 1);

                    // Pour les gros fichiers, traiter par morceaux
                    $this->processLargeBase64File($contentData, 'courses/videos', function($path) use (&$validated) {
                        $validated['content_url'] = $path;
                    });
                }
                // Vérifier si c'est un document en base64 (PDF, etc.)
                else if (preg_match('/^data:application\/(\w+);base64,/', $validated['content_url'])) {
                    $contentData = substr($validated['content_url'], strpos($validated['content_url'], ',') + 1);
                    $decodedData = base64_decode($contentData);

                    if ($decodedData === false) {
                        return response()->json(['message' => 'Impossible de décoder le contenu en base64'], 400);
                    }

                    $extension = '.pdf'; // Par défaut
                    if (preg_match('/^data:application\/(\w+);base64,/', $validated['content_url'], $matches)) {
                        if ($matches[1] === 'pdf') {
                            $extension = '.pdf';
                        } else if ($matches[1] === 'msword' || strpos($matches[1], 'document') !== false) {
                            $extension = '.doc';
                        }
                    }

                    $filename = 'content_' . time() . '_' . Str::random(10) . $extension;
                    $path = 'courses/content/' . $filename;

                    Storage::disk('public')->put($path, $decodedData);
                    $validated['content_url'] = $path;
                }
            }

            $course = new Course($validated);
            $course->status = 'DRAFT';

            // Traitement des fichiers traditionnels (si l'API permet également cette méthode)
            if ($request->hasFile('image_url')) {
                $image = $request->file('image_url');
                $course->image_url = $image->store('courses/images', 'public');
            }

            if ($request->hasFile('video_url')) {
                $video = $request->file('video_url');
                // Utiliser storeAs pour plus de contrôle
                $filename = 'course_' . time() . '_' . Str::random(10) . '.' . $video->getClientOriginalExtension();
                $course->video_url = $video->storeAs('courses/videos', $filename, 'public');
            }

            if ($request->hasFile('content_url')) {
                $content = $request->file('content_url');
                $extension = $content->getClientOriginalExtension();
                $filename = 'content_' . time() . '_' . Str::random(10) . '.' . $extension;
                // Détecter si c'est une vidéo et la stocker dans le dossier approprié
                if (in_array(strtolower($extension), ['mp4', 'mov', 'avi', 'webm'])) {
                    $course->content_url = $content->storeAs('courses/videos', $filename, 'public');
                } else {
                    $course->content_url = $content->storeAs('courses/content', $filename, 'public');
                }
            }

            $course->save();

            // Attacher les catégories et les tags
            if (isset($validated['category_id'])) {
                $course->categories()->attach($validated['category_id']);
            }

            // Transforme les URLs relatives en URLs complètes
            if ($course->image_url) {
                $course->image_url = $this->getFullUrl($course->image_url);
            }
            if ($course->video_url) {
                $course->video_url = $this->getFullUrl($course->video_url);
            }
            if ($course->content_url) {
                $course->content_url = $this->getFullUrl($course->content_url);
            }

            return response()->json([
                'message' => 'Cours créé avec succès',
                'data' => $course->load(['categories', 'tags'])
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la création du cours',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function index(): JsonResponse
    {
        // Récupérer les cours avec pagination
        $coursesQuery = Course::with([
            'categories',
            'tags',
            'instructor',
            'sections' => function ($query) {
                $query->orderBy('order')
                      ->with(['lessons' => function ($query) {
                          $query->orderBy('order');
                      }]);
            }
        ])
        ->orderBy('created_at', 'desc');

        $courses = $coursesQuery->paginate(10);

        // Transforme les URLs relatives en URLs complètes pour tous les cours
        foreach ($courses as $course) {
            if ($course->image_url) {
                $course->image_url = $this->getFullUrl($course->image_url);
            }
            if ($course->video_url) {
                $course->video_url = $this->getFullUrl($course->video_url);
            }
            if ($course->content_url) {
                $course->content_url = $this->getFullUrl($course->content_url);
            }
        }

        // Récupérer les catégories et tags (pour filtres)
        $categories = Category::where('is_active', true)
            ->orderBy('display_order')
            ->get();

        $tags = Tag::orderBy('popularity', 'desc')
            ->take(10)
            ->get();

        $userId = Auth::id();

        // Si l'utilisateur n'est pas connecté, retourner une collection vide pour courses_payes
        if (!$userId) {
            $coursePayed = collect();
        } else {
            $coursePayed = DB::table('courses as c')
                ->join('order_items as o', 'c.id', '=', 'o.course_id')
                ->join('payments as p', 'p.order_id', '=', 'o.order_id')
                ->where('p.user_id', $userId)
                ->groupBy('c.id')
                ->select('c.*')
                ->get();
        }

        return response()->json([
            'courses' => [
                'data' => $courses->getCollection(),
                'current_page' => $courses->currentPage(),
                'per_page' => $courses->perPage(),
                'total' => $courses->total(),
                'last_page' => $courses->lastPage()
            ],
            'categories' => $categories,
            'tags' => $tags,
            'courses_payes' => $coursePayed,
            'debug_info' => [
                'user_id' => $userId,
                'courses_payes_count' => $coursePayed->count()
            ],
            'message' => 'Données récupérées avec succès'
        ]);
    }

    public function show($id): JsonResponse
    {
        try {
            $course = Course::with([
                'categories',
                'tags',
                'instructor.profile',
                'instructor.teachingCourses',
                'sections' => function ($query) {
                    $query->orderBy('order')
                          ->with(['lessons' => function ($query) {
                              $query->orderBy('order');
                          }]);
                },
                'ratings.user',
                'enrollments.student',
                'certificates',
                'comments' => function($query) {
                    $query->whereNull('parent_id')
                          ->orderBy('created_at', 'desc')
                          ->with(['user', 'replies.user']);
                }
            ])->findOrFail($id);

            $totalStudents = $course->enrollments->count();
            $totalRatings = $course->ratings->count();
            $averageRating = $totalRatings > 0 ? round($course->ratings->avg('rating'), 1) : 0;
            $totalLessons = $course->sections->sum(function($section) {
                return $section->lessons->count();
            });

            $totalDuration = $course->sections->sum(function($section) {
                return $section->lessons->sum('duration');
            });

            $course->total_students = $totalStudents;
            $course->total_ratings = $totalRatings;
            $course->average_rating = $averageRating;
            $course->total_lessons = $totalLessons;
            $course->total_duration = $totalDuration;

            if ($course->image_url) {
                $course->image_url = $this->getFullUrl($course->image_url);
            }
            if ($course->video_url) {
                $course->video_url = $this->getFullUrl($course->video_url);
            }
            if ($course->content_url) {
                $course->content_url = $this->getFullUrl($course->content_url);
            }

            foreach ($course->sections as $section) {
                foreach ($section->lessons as $lesson) {
                    if ($lesson->content_url) {
                        $lesson->content_url = $this->getFullUrl($lesson->content_url);
                    }
                }
            }

            // Vérifier si l'utilisateur actuel est inscrit au cours
            $isEnrolled = false;
            $userProgress = null;

            if (Auth::check()) {
                $user = Auth::user();
                $isEnrolled = $course->enrollments->contains('student_id', $user->id);

                if ($isEnrolled) {
                    // Récupérer la progression de l'utilisateur en utilisant la relation directe depuis le cours
                    $userProgress = Progress::where('course_id', $course->id)
                        ->where('user_id', $user->id)
                        ->first();
                }
            }

            $course->is_enrolled = $isEnrolled;
            $course->user_progress = $userProgress;

            return response()->json([
                'data' => $course,
                'message' => 'Cours récupéré avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Cours non trouvé',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $course = Course::findOrFail($id);
            $course->delete();

            return response()->json([
                'message' => 'Course deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Course not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {
            // Trouver le cours à mettre à jour
            $course = Course::findOrFail($id);

            // Valider les données de la requête
            $validated = $request->validate([
                'title' => 'sometimes|string|max:255',
                'subtitle' => 'nullable|string|max:255',
                'description' => 'sometimes|string',
                'level' => 'sometimes|string',
                'language' => 'sometimes|string',
                'price' => 'sometimes|numeric|min:0',
                'discount' => 'nullable|numeric|min:0',
                'category_id' => 'sometimes|numeric',
                'instructor_id' => 'sometimes|numeric',
                'content_url' => 'nullable|string',
                'image_url' => 'nullable|string',
                'video_url' => 'nullable|string',
                'requirements' => 'nullable|array',
                'what_you_will_learn' => 'nullable|array',
                'target_audience' => 'nullable|array',
                'has_certificate' => 'boolean',
                'status' => 'sometimes|string'
            ]);

            // Vérifier si une nouvelle catégorie est spécifiée
            if (isset($validated['category_id'])) {
                $category = Category::find($validated['category_id']);
                if (!$category || !$category->is_active) {
                    return response()->json(['message' => 'La catégorie spécifiée n\'existe pas ou n\'est pas active'], 404);
                }
            }

            // Traiter l'image en base64 si elle est fournie
            if (isset($validated['image_url']) && preg_match('/^data:image\/(\w+);base64,/', $validated['image_url'])) {
                $imageData = substr($validated['image_url'], strpos($validated['image_url'], ',') + 1);
                $imageData = base64_decode($imageData);

                if ($imageData === false) {
                    return response()->json(['message' => 'Impossible de décoder l\'image en base64'], 400);
                }

                $filename = 'course_' . time() . '_' . Str::random(10) . '.jpg';
                $path = 'courses/images/' . $filename;

                Storage::disk('public')->put($path, $imageData);
                $validated['image_url'] = $path;
            }

            // Traiter la vidéo en base64 si elle est fournie
            if (isset($validated['video_url']) && preg_match('/^data:video\/(\w+);base64,/', $validated['video_url'])) {
                $videoData = substr($validated['video_url'], strpos($validated['video_url'], ',') + 1);

                // Pour les gros fichiers, traiter par morceaux
                $this->processLargeBase64File($videoData, 'courses/videos', function($path) use (&$validated) {
                    $validated['video_url'] = $path;
                });
            }

            // Traiter le contenu en base64 s'il est fourni (vidéo ou autre)
            if (isset($validated['content_url'])) {
                if (preg_match('/^data:video\/(\w+);base64,/', $validated['content_url'])) {
                    $contentData = substr($validated['content_url'], strpos($validated['content_url'], ',') + 1);

                    // Pour les gros fichiers, traiter par morceaux
                    $this->processLargeBase64File($contentData, 'courses/videos', function($path) use (&$validated) {
                        $validated['content_url'] = $path;
                    });
                }
                // Vérifier si c'est un document en base64 (PDF, etc.)
                else if (preg_match('/^data:application\/(\w+);base64,/', $validated['content_url'])) {
                    $contentData = substr($validated['content_url'], strpos($validated['content_url'], ',') + 1);
                    $decodedData = base64_decode($contentData);

                    if ($decodedData === false) {
                        return response()->json(['message' => 'Impossible de décoder le contenu en base64'], 400);
                    }

                    $extension = '.pdf'; // Par défaut
                    if (preg_match('/^data:application\/(\w+);base64,/', $validated['content_url'], $matches)) {
                        if ($matches[1] === 'pdf') {
                            $extension = '.pdf';
                        } else if ($matches[1] === 'msword' || strpos($matches[1], 'document') !== false) {
                            $extension = '.doc';
                        }
                    }

                    $filename = 'content_' . time() . '_' . Str::random(10) . $extension;
                    $path = 'courses/content/' . $filename;

                    Storage::disk('public')->put($path, $decodedData);
                    $validated['content_url'] = $path;
                }
            }

            // Mise à jour du cours avec les données validées
            $course->update($validated);

            // Mettre à jour la catégorie si spécifiée
            if (isset($validated['category_id'])) {
                $course->categories()->sync([$validated['category_id']]);
            }

            // Transformer les URLs relatives en URLs complètes
            if ($course->image_url) {
                $course->image_url = $this->getFullUrl($course->image_url);
            }
            if ($course->video_url) {
                $course->video_url = $this->getFullUrl($course->video_url);
            }
            if ($course->content_url) {
                $course->content_url = $this->getFullUrl($course->content_url);
            }

            return response()->json([
                'message' => 'Cours mis à jour avec succès',
                'data' => $course->load(['categories', 'tags'])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la mise à jour du cours',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function storeLesson(Request $request, Course $course, Section $section)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'content_type' => 'required|string',
                'duration' => 'required|integer|min:0',
                'order' => 'required|integer|min:0',
                'content_url' => 'nullable'
            ]);

            $lesson = $section->lessons()->create($validated);

            // Traiter le fichier base64 si fourni comme chaîne
            if (isset($validated['content_url']) && is_string($validated['content_url']) && strpos($validated['content_url'], 'data:') === 0) {
                // C'est une chaîne base64
                $contentData = substr($validated['content_url'], strpos($validated['content_url'], ',') + 1);

                // Déterminer le type et l'extension
                $extension = '.mp4';
                $folder = 'lessons/videos';

                // Cas d'une vidéo
                if (strpos($validated['content_url'], 'data:video/') === 0) {
                    $this->processLargeBase64File($contentData, $folder, function($path) use ($lesson) {
                        $lesson->content_url = $path;
                        $lesson->save();
                    });
                }
                // Cas d'un document (PDF, etc.)
                else if (strpos($validated['content_url'], 'data:application/') === 0) {
                    $extension = '.pdf';
                    $folder = 'lessons/content';

                    if (preg_match('/^data:application\/(\w+);base64,/', $validated['content_url'], $matches)) {
                        if ($matches[1] === 'pdf') {
                            $extension = '.pdf';
                        } else if ($matches[1] === 'msword' || strpos($matches[1], 'document') !== false) {
                            $extension = '.doc';
                        }
                    }

                    $decodedData = base64_decode($contentData);
                    if ($decodedData !== false) {
                        $filename = 'lesson_' . time() . '_' . Str::random(10) . $extension;
                        $path = $folder . '/' . $filename;
                        Storage::disk('public')->put($path, $decodedData);
                        $lesson->content_url = $path;
                        $lesson->save();
                    }
                }
            }
            // Traiter le fichier uploadé traditionnellement
            else if ($request->hasFile('content_url')) {
                $file = $request->file('content_url');
                $extension = $file->getClientOriginalExtension();
                $filename = 'lesson_' . time() . '_' . Str::random(10) . '.' . $extension;

                // Déterminer le dossier approprié
                if (in_array(strtolower($extension), ['mp4', 'mov', 'avi', 'webm'])) {
                    $lesson->content_url = $file->storeAs('lessons/videos', $filename, 'public');
                } else {
                    $lesson->content_url = $file->storeAs('lessons/content', $filename, 'public');
                }

                $lesson->save();
            }

            // Transformer l'URL relative en URL complète
            if ($lesson->content_url) {
                $lesson->content_url = $this->getFullUrl($lesson->content_url);
            }

            return response()->json([
                'message' => 'Leçon créée avec succès',
                'data' => $lesson
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la création de la leçon',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Transforme un chemin relatif en URL complète
     */
    private function getFullUrl($path)
    {
        if (!$path) {
            return null;
        }

        // Vérifie si l'URL est déjà complète
        if (strpos($path, 'http://') === 0 || strpos($path, 'https://') === 0) {
            return $path;
        }

        // Pour les chemins commençant par 'storage/', utiliser l'URL directe
        if (strpos($path, 'storage/') === 0) {
            return url($path);
        }

        // Pour les autres chemins relatifs dans le stockage public
        return url('storage/' . $path);
    }

    /**
     * Traite un fichier base64 volumineux par morceaux
     */
    private function processLargeBase64File($base64Data, $folder, $callback)
    {
        try {
            $decodedData = base64_decode($base64Data);

            if ($decodedData === false) {
                throw new \Exception("Impossible de décoder les données base64");
            }

            // Créer un nom de fichier unique
            $filename = time() . '_' . Str::random(10) . '.mp4';
            $path = $folder . '/' . $filename;

            // Écrire le fichier par morceaux de 1MB pour éviter les problèmes de mémoire
            $chunkSize = 1024 * 1024; // 1MB
            $totalLength = strlen($decodedData);
            $currentPosition = 0;

            // Créer ou vider le fichier
            Storage::disk('public')->put($path, '');

            while ($currentPosition < $totalLength) {
                $chunk = substr($decodedData, $currentPosition, $chunkSize);
                Storage::disk('public')->append($path, $chunk);
                $currentPosition += $chunkSize;
            }

            // Appeler le callback avec le chemin du fichier
            $callback($path);

            return true;
        } catch (\Exception $e) {
            throw new \Exception("Erreur lors du traitement du fichier: " . $e->getMessage());
        }
    }
}

