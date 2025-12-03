<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;
use Illuminate\Cache\RateLimiting\Limit;

class RouteServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        $this->routes(function () {
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/api.php'));

            Route::middleware('web')
                ->group(base_path('routes/web.php'));
        });

        // Ajouter un lien symbolique pour les fichiers du stockage
        $this->mapStorageRoutes();
    }

    /**
     * Définir les routes pour accéder directement aux fichiers du stockage
     */
    protected function mapStorageRoutes(): void
    {
        Route::get('/storage/{path}', function ($path) {
            // Générer le chemin complet vers le fichier dans le stockage
            $storagePath = storage_path('app/public/' . $path);

            // Vérifier si le fichier existe
            if (!file_exists($storagePath)) {
                abort(404);
            }

            // Déterminer le type MIME
            $mimeType = mime_content_type($storagePath);

            // Servir le fichier directement
            return response()->file($storagePath, [
                'Content-Type' => $mimeType
            ]);
        })->where('path', '.*');
    }
}
