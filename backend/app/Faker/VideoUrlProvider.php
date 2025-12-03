<?php

namespace App\Faker;

use Faker\Provider\Base;

class VideoUrlProvider extends Base
{
    /**
     * Génère une URL vidéo aléatoire
     */
    public function videoUrl(): string
    {
        $providers = [
            'youtube' => function() {
                $videoId = $this->generator->regexify('[A-Za-z0-9_-]{11}');
                return "https://www.youtube.com/watch?v={$videoId}";
            },
            'vimeo' => function() {
                $videoId = $this->generator->numberBetween(100000000, 999999999);
                return "https://vimeo.com/{$videoId}";
            },
            'dailymotion' => function() {
                $videoId = $this->generator->regexify('[A-Za-z0-9]{7}');
                return "https://www.dailymotion.com/video/{$videoId}";
            }
        ];

        $provider = $this->generator->randomElement(array_keys($providers));
        return $providers[$provider]();
    }
}
