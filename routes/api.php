<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\CategoryController;

Route::get('/user', function (Request $request) {
   $users = DB::table('users')
   ->select('role', DB::raw('count(*) as total'))
   ->groupBy('role')
   ->get();
   return response()->json($users);
});

Route::post('/register',[AuthController::class,'register']);
Route::post('/login',[AuthController::class,'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->name('password.email');
Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.reset');


Route::middleware('auth:sanctum')->group(function(){

Route::post('/logout',[AuthController::class,'logout']);
Route::post('/profile/{user_id}',[ProfileController::class , 'store']);
Route::get('/profile/{user_id}',[ProfileController::class , 'show']);
Route::put('/profile/{user_id}',[ProfileController::class , 'update']);
Route::delete('/profile/{user_id}',[ProfileController::class , 'destroy']);
Route::get('/user',[AuthController::class , 'getUser']);
Route::middleware(['role:student'])->prefix('student')->group(function () {
    Route::get('/dashboard', [StudentController::class, 'dashboard']);
});

// Routes pour les enseignants
Route::middleware(['role:teacher'])->prefix('teacher')->group(function () {
    Route::get('/dashboard', [TeacherController::class, 'dashboard']);
    Route::post('/courses', [CourseController::class, 'create']);
});

// Routes pour les administrateurs
Route::middleware(['role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard']);

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
Route::post('/courses', [CourseController::class, 'store']);
});

