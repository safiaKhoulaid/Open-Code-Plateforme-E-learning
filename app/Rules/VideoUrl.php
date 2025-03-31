<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class VideoUrl implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Liste des domaines vidéo autorisés
        $allowedDomains = [
            'youtube.com',
            'youtu.be',
            'vimeo.com',
            'dailymotion.com',
            'vimeo.com'
        ];

        $url = parse_url($value);

        if (!$url || !isset($url['host'])) {
            $fail('L\'URL de la vidéo n\'est pas valide.');
            return;
        }

        $domain = $url['host'];
        $isAllowed = false;

        foreach ($allowedDomains as $allowedDomain) {
            if (str_contains($domain, $allowedDomain)) {
                $isAllowed = true;
                break;
            }
        }

        if (!$isAllowed) {
            $fail('Le domaine de la vidéo n\'est pas autorisé. Les domaines autorisés sont : ' . implode(', ', $allowedDomains));
        }
    }
}
