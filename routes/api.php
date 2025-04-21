<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TagController;
use App\Http\Controllers\testController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\uploadController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TagCourseController;
use App\Http\Controllers\DashboardStudentController;

Route::get('/users', function (Request $request) {
   $users = DB::table('users')
   ->select('*')
   ->get();
   return response()->json($users);
});

Route::post('/register',[AuthController::class,'register']);
Route::post('/login',[AuthController::class,'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->name('password.email');
Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.reset');
Route::post('/upload' ,[uploadController::class , 'upload']);

Route::middleware('auth:sanctum')->group(function()
{
    Route::post('/courses/{course}/sections', [SectionController::class, 'store']);


Route::post('/logout',[AuthController::class,'logout']);
Route::post('/profile/{user_id}',[ProfileController::class , 'store']);
Route::get('/profile/{user_id}',[ProfileController::class , 'show']);
Route::put('/profile/{user_id}',[ProfileController::class , 'update']);
Route::delete('/profile/{user_id}',[ProfileController::class , 'destroy']);
Route::get('/user',[AuthController::class , 'getUser']);
Route::middleware(['role:student'])->prefix('student')->group(function () {
    Route::get('/dashboard', [StudentController::class, 'dashboard']);
    Route::get('/dashboard-student', [DashboardStudentController::class, 'index']);
});

// Routes pour les enseignants
Route::middleware(['role:teacher'])->prefix('teacher')->group(function () {
    Route::get('/dashboard', [TeacherController::class, 'dashboard']);
    Route::post('/courses', [CourseController::class, 'create']);
});

// Routes pour les administrateurs
Route::middleware(['role:admin' || 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
    Route::delete('/courses/{id}',[courseController::class, 'destroy']);

});
Route::post('/categories', [CategoryController::class, 'store']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);
Route::put('/categories/{category}', [CategoryController::class, 'update']);
Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
Route::patch('/categories/{category}/toggle-active', [CategoryController::class, 'toggleActive']);
Route::post('/categories/reorder', [CategoryController::class, 'reorder']);
Route::get('/categories/{category}/subcategories', [CategoryController::class, 'getSubcategories']);
Route::get('/categories/{category}/courses', [CategoryController::class, 'getCourses']);

// Routes pour les catégories
// Route::prefix('categories')->group(function () {
//     Route::get('/', [CategoryController::class, 'index']);
//     Route::post('/', [CategoryController::class, 'store']);
//     Route::get('/{category}', [CategoryController::class, 'show']);
//     Route::put('/{category}', [CategoryController::class, 'update']);
//     Route::delete('/{category}', [CategoryController::class, 'destroy']);
//     Route::patch('/{category}/toggle-active', [CategoryController::class, 'toggleActive']);
//     Route::post('/reorder', [CategoryController::class, 'reorder']);
//     Route::get('/{category}/subcategories', [CategoryController::class, 'getSubcategories']);
//     Route::get('/{category}/courses', [CategoryController::class, 'getCourses']);
// });

Route::get('/courses', [CourseController::class, 'index']);

// Routes pour le tableau de bord
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard-student', [DashboardStudentController::class, 'index']);
});
});
Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{id}', [CourseController::class, 'show']);
Route::post('/courses', [CourseController::class, 'store']);

// les routes de section
Route::post('/courses/{course}/sections', [SectionController::class, 'store']);
Route::put('/courses/{course}/sections/{section}', [SectionController::class, 'update']);
Route::delete('/courses/{course}/sections/{section}', [SectionController::class, 'destroy']);
Route::post('/courses/{course}/sections/reorder', [SectionController::class, 'reorder']);
Route::patch('/courses/{course}/sections/{section}/toggle-publish', [SectionController::class, 'togglePublish']);

Route::post('/courses/{course}/sections/{section}/lessons', [LessonController::class, 'store']);
Route::put('/courses/{course}/sections/{section}/lessons/{lesson}', [LessonController::class, 'update']);
Route::delete('/courses/{course}/sections/{section}/lessons/{lesson}', [LessonController::class, 'destroy']);
Route::post('/courses/{course}/sections/{section}/lessons/reorder', [LessonController::class, 'reorder']);
Route::patch('/courses/{course}/sections/{section}/lessons/{lesson}/toggle-publish', [LessonController::class, 'togglePublish']);

Route::get('/test ', [testController::class , 'index']);

// ====== route des tags =======
Route::post('/courses/{course}/tags',[TagController::class , 'store']);

// Routes pour la gestion des tags et cours
Route::post('/courses/{course}/tags/{tag}', [TagCourseController::class, 'attachTagsToCourse']);
// Route::delete('/courses/{course}/tags', [TagCourseController::class, 'detachTagsFromCourse']);
// Route::put('/courses/{course}/tags', [TagCourseController::class, 'syncTagsForCourse']);
// Route::get('/courses/{course}/tags', [TagCourseController::class, 'getCourseTags']);

// Routes pour Stripe et les paiements de cours
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/courses/{course}/checkout', [App\Http\Controllers\StripeController::class, 'createCheckoutSession']);
    Route::get('/stripe/success', [App\Http\Controllers\StripeController::class, 'success'])->name('stripe.success');
    Route::get('/stripe/cancel', [App\Http\Controllers\StripeController::class, 'cancel'])->name('stripe.cancel');
});

// Route pour le webhook Stripe (pas besoin d'authentification)
Route::post('/stripe/webhook', [App\Http\Controllers\StripeController::class, 'webhook']);

//=====route pour dashboard de teacher
Route::get('/dashboard-teacher/{id}',[TeacherController::class ,'index']);
