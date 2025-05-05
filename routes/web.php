<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// Route de test pour vérifier l'accès au stockage
Route::get('/test-storage', function() {
    return response()->json([
        'message' => 'URL de stockage de base',
        'storage_url' => asset('storage'),
        'examples' => [
            'Accès direct via storage' => url('/storage/lesson/content/zm9tV8Ii5KbPw4wuKRnOSSVGSOsRb5fMsppYqOBk.pdf'),
            'Accès via API avec le nom de fichier' => url('/api/files/zm9tV8Ii5KbPw4wuKRnOSSVGSOsRb5fMsppYqOBk.pdf'),
            'Accès sécurisé via API (leçon)' => url('/api/courses/1/sections/1/lessons/1/files/zm9tV8Ii5KbPw4wuKRnOSSVGSOsRb5fMsppYqOBk.pdf'),
        ]
    ]);
});
