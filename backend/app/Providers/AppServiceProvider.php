<?php

namespace App\Providers;

use App\Faker\VideoUrlProvider;
use Faker\Factory;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Enregistrer le provider Faker personnalisé
        $this->app->singleton(VideoUrlProvider::class, function ($app) {
            return new VideoUrlProvider($app['faker']);
        });

        // Enregistrer le singleton Faker avec notre provider
        $this->app->singleton('faker', function ($app) {
            $faker = Factory::create('fr_FR');
            $faker->addProvider(new VideoUrlProvider($faker));
            return $faker;
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Ajouter le provider au démarrage de l'application
        $faker = $this->app['faker'];
        $faker->addProvider(new VideoUrlProvider($faker));
    }
}
