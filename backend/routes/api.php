<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TagController;
use App\Http\Controllers\testController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\uploadController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TagCourseController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\ShoppingCartController;
use App\Http\Controllers\DashboardStudentController;
use App\Http\Controllers\FileController;
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
Route::middleware(['role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
    Route::put('users/{user}/ban', [AdminController::class, 'toggleUserBan']);

    // Routes pour l'approbation des enseignants
    Route::get('/pending-teachers', [AdminController::class, 'getPendingTeachers']);
    Route::post('/approve-teacher/{id}', [AdminController::class, 'approveTeacher']);
});

Route::post('/categories', [CategoryController::class, 'store']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);
Route::put('/categories/{category}', [CategoryController::class, 'update']);
// Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
Route::patch('/categories/{category}/toggle-active', [CategoryController::class, 'toggleActive']);
Route::post('/categories/reorder', [CategoryController::class, 'reorder']);
Route::get('/categories/{category}/subcategories', [CategoryController::class, 'getSubcategories']);
Route::get('/categories/{category}/courses', [CategoryController::class, 'getCourses']);

// Routes pour les catégories
Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
    Route::post('/', [CategoryController::class, 'store']);
    Route::get('/{category}', [CategoryController::class, 'show']);
    Route::put('/{category}', [CategoryController::class, 'update']);
    Route::delete('/{category}', [CategoryController::class, 'destroy']);
    Route::patch('/{category}/toggle-active', [CategoryController::class, 'toggleActive']);
    Route::post('/reorder', [CategoryController::class, 'reorder']);
    Route::get('/{category}/subcategories', [CategoryController::class, 'getSubcategories']);
    Route::get('/{category}/courses', [CategoryController::class, 'getCourses']);
});

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
Route::delete('/courses/{course}/sections/{section}', [SectionController::class, 'destroy']);
Route::post('/courses/{course}/sections/reorder', [SectionController::class, 'reorder']);
Route::patch('/courses/{course}/sections/{section}/toggle-publish', [SectionController::class, 'togglePublish']);

Route::post('/courses/{course}/sections/{section}/lessons', [LessonController::class, 'store']);
Route::put('/courses/{course}/sections/{section}/lessons/{lesson}', [LessonController::class, 'update']);
Route::delete('/courses/{course}/sections/{section}/lessons/{lesson}', [LessonController::class, 'destroy']);
Route::post('/courses/{course}/sections/{section}/lessons/reorder', [LessonController::class, 'reorder']);
Route::patch('/courses/{course}/sections/{section}/lessons/{lesson}/toggle-publish', [LessonController::class, 'togglePublish']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/courses/{course}/sections/{section}/lessons/{lesson}/watch', [LessonController::class, 'watch']);
});

Route::get('/test ', [testController::class , 'index']);

// ====== Routes pour la gestion des tags =======
Route::middleware('auth:sanctum')->group(function () {
    // Routes pour les tags
    Route::get('/courses/{course}/tags', [TagController::class, 'getCourseTags']);
    Route::post('/courses/{course}/tags', [TagController::class, 'attachTags']);
    Route::put('/courses/{course}/tags', [TagController::class, 'syncTags']);
    Route::delete('/courses/{course}/tags/{tag}', [TagController::class, 'detach']);

    // Routes pour la recherche et la gestion des tags
    Route::get('/tags/search', [TagController::class, 'search']);
    Route::get('/tags/popular', [TagController::class, 'getPopularTags']);
    Route::post('/tags', [TagController::class, 'store']);
    Route::put('/tags/{tag}', [TagController::class, 'update']);
    Route::delete('/tags/{tag}', [TagController::class, 'destroy']);
    Route::get('/tags', [TagController::class, 'index']);
});

// Routes pour la gestion des tags et cours
Route::post('/courses/{course}/tags/{tag}', [TagCourseController::class, 'attachTagsToCourse']);
Route::delete('/courses/{course}/tags', [TagCourseController::class, 'detachTagsFromCourse']);
Route::put('/courses/{course}/tags', [TagCourseController::class, 'syncTagsForCourse']);
Route::get('/courses/{course}/tags', [TagCourseController::class, 'getCourseTags']);

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

 //======= Wishlist routes==========
 Route::get('/wishlist', [WishlistController::class, 'index']);
 Route::post('/wishlist', [WishlistController::class, 'store']);
 Route::get('/wishlist/{id}', [WishlistController::class, 'show']);
 Route::put('/wishlist/{id}', [WishlistController::class, 'update']);
 Route::delete('/wishlist/{id}', [WishlistController::class, 'destroy']);
 Route::post('/wishlist/toggle', [WishlistController::class, 'toggle']);
 Route::patch('/wishlist/{id}/notifications', [WishlistController::class, 'toggleNotifications']);
 Route::delete('/wishlist', [WishlistController::class, 'clear']);
 Route::get('/wishlist/check/{courseId}', [WishlistController::class, 'check']);

// Routes pour les notes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/ratings', [RatingController::class, 'index']);
    Route::post('/ratings', [RatingController::class, 'store']);
    Route::put('/ratings/{rating}', [RatingController::class, 'update']);
    Route::delete('/ratings/{rating}', [RatingController::class, 'destroy']);
    Route::get('/ratings/user', [RatingController::class, 'getUserRatings']);
    Route::get('/courses/{course}/ratings', [RatingController::class, 'getCourseRatings']);
});

// Routes pour le panier d'achat
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/cart', [ShoppingCartController::class, 'index']);
    Route::post('/cart/add', [ShoppingCartController::class, 'addToCart']);
    Route::put('/cart/update', [ShoppingCartController::class, 'updateCart']);
    Route::delete('/cart/remove', [ShoppingCartController::class, 'removeFromCart']);
    Route::delete('/cart/clear', [ShoppingCartController::class, 'clearCart']);
    Route::get('/cart/check/{courseId}', [ShoppingCartController::class, 'checkCourseInCart']);
    Route::get('/cart/total', [ShoppingCartController::class, 'getCartTotal']);
    Route::get('/cart/count', [ShoppingCartController::class, 'getCartCount']);
});

Route::get('/teacher/{id}/dashboard', [TeacherController::class, 'dashboard']);

Route::get('/success', function () {
    return 'Paiement réussi !';
})->name('success');

Route::get('/cancel', function () {
    return 'Paiement annulé.';
})->name('cancel');

// Routes pour le paiement du panier complet
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/cart/checkout', [App\Http\Controllers\StripeController::class, 'createCartCheckoutSession']);
    Route::get('/stripe/cart/success', [App\Http\Controllers\StripeController::class, 'cartSuccess'])->name('stripe.cart.success');
    Route::get('/stripe/cart/cancel', [App\Http\Controllers\StripeController::class, 'cartCancel'])->name('stripe.cart.cancel');
});

// Route pour le paiement depuis le frontend React
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/frontend/checkout', [App\Http\Controllers\StripeController::class, 'createFrontendCheckoutSession']);
});
Route::put('/courses/{id}',[courseController::class, 'update']);
Route::put('/courses/{course}/sections/{section}/lessons/{lesson}', [LessonController::class, 'update']);
Route::put('/courses/{course}/sections/{section}', [SectionController::class, 'update']);
Route::delete('/courses/{id}',[courseController::class, 'destroy']);
Route::get('/payments', [PaymentController::class, 'index']);

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::put('courses/{course}/status', [AdminController::class, 'updateCourseStatus']);
    // Route::put('users/{user}/ban', [AdminController::class, 'toggleUserBan']);
    Route::get('banned-users', [AdminController::class, 'getBannedUsers']);
});

Route::get('/api/profile', [ProfileController::class, 'index']);
Route::get('/api/profile/{id}', [ProfileController::class, 'show']);
Route::put('/api/profile/{id}', [ProfileController::class, 'update']);
Route::delete('/api/profile/{id}', [ProfileController::class, 'destroy']);
Route::post('/api/profile', [ProfileController::class, 'store']);
Route::get('/api/enrollments', [EnrollmentController::class, 'index']);
Route::get('/api/enrollments/{id}', [EnrollmentController::class, 'show']);
Route::put('/api/enrollments/{id}', [EnrollmentController::class, 'update']);
Route::delete('/api/enrollments/{id}', [EnrollmentController::class, 'destroy']);
Route::post('/api/enrollments', action: [EnrollmentController::class, 'store']);

// Routes pour la gestion des fichiers
Route::post('/upload', [FileController::class, 'upload']);
Route::get('/files/{fileName}', [FileController::class, 'getFile']);
Route::delete('/files/{fileName}', [FileController::class, 'deleteFile'])->middleware('auth:sanctum');
Route::get('/courses/{course}/sections/{section}/lessons/{lesson}/files/{fileName}', [FileController::class, 'getLessonFile']);

Route::get('/course-images/{filename}', function ($filename) {
    $path = storage_path('app/public/courses/images/' . $filename);

    if (!file_exists($path)) {
        abort(404);
    }

    return response()->file($path);
});

Route::get('/api/courses/{course}/lessons', [LessonController::class, 'getLessonsByCourse']);

// Route pour marquer une leçon comme complétée

Route::middleware('auth:sanctum')->post('/courses/{course}/sections/{section}/lessons/{lesson}/complete', [LessonController::class, 'complete']);
