<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends ResetPassword
{
    protected $url;

    public function __construct($token)
    {
        parent::__construct($token);
        $this->url = config('app.frontend_url', 'http://localhost:5173') .
                    '/reset-password?token=' . $token;
    }

    public function toMail($notifiable)
    {
        $url = $this->url . '&email=' . urlencode($notifiable->email);

        return (new MailMessage)
            ->subject('Réinitialisation de mot de passe')
            ->line('Vous recevez cet email car nous avons reçu une demande de réinitialisation de mot de passe pour votre compte.')
            ->action('Réinitialiser le mot de passe', $url)
            ->line('Si vous n\'avez pas demandé de réinitialisation de mot de passe, aucune action n\'est requise.');
    }
}
