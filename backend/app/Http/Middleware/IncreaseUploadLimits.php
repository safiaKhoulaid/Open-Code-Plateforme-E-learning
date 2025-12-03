<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IncreaseUploadLimits
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Augmenter les limites de téléchargement
        ini_set('upload_max_filesize', '256M');
        ini_set('post_max_size', '258M');
        ini_set('max_execution_time', '300');
        ini_set('memory_limit', '512M');
        
        return $next($request);
    }
} 