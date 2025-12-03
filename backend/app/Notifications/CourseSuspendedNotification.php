<?php

namespace App\Notifications;

use App\Models\Course;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CourseSuspendedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    private Course $course;

    /**
     * Create a new notification instance.
     */
    public function __construct(Course $course)
    {
        $this->course = $course;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Votre cours a été suspendu')
            ->line('Votre cours "' . $this->course->title . '" a été suspendu.')
            ->line('Un administrateur examinera votre cours et vous contactera pour plus d\'informations.')
            ->action('Voir le cours', url('/courses/' . $this->course->id))
            ->line('Si vous pensez qu\'il s\'agit d\'une erreur, veuillez contacter notre support.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'course_suspended',
            'course_id' => $this->course->id,
            'course_title' => $this->course->title,
            'suspended_at' => now()
        ];
    }
}
