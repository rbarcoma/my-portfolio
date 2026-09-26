<?php

namespace App\Notifications;

use App\Models\ContactMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ContactMessageReceived extends Notification
{
    use Queueable;

    public function __construct(public ContactMessage $contactMessage) {}

    /**
     * @return list<string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Portfolio contact: '.($this->contactMessage->subject ?? 'No subject'))
            ->replyTo($this->contactMessage->email, $this->contactMessage->name)
            ->greeting('New portfolio message')
            ->line("**From:** {$this->contactMessage->name} <{$this->contactMessage->email}>")
            ->line('**Subject:** '.($this->contactMessage->subject ?? '—'))
            ->line('**Message:**')
            ->line($this->contactMessage->message);
    }
}
