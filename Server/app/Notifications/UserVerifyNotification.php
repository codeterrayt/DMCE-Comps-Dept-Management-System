<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Auth;
use Illuminate\Support\Facades\URL;


class UserVerifyNotification extends Notification
{
    use Queueable;
    public $user;            //you'll need this to address the user

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($user='')
    {
        $this->user =  $user ?: Auth::user();         //if user is not supplied, get from session
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    protected function verificationUrl($notifiable)
    {
        // Change the base URL to localhost:3000
        $baseUrl = env("FRONTEND_URL");

        $url = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(config('auth.verification.expire', 60)),
            ['id' => $notifiable->getKey(), 'hash' => sha1($notifiable->getEmailForVerification())]
        );

        return preg_replace('/^http?:\/\/[^\/]+/i', $baseUrl, $url); 
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        \Log::error($notifiable);
        $actionUrl  =  URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $notifiable->id, 'hash' => sha1($notifiable->email)]
        ); //verificationUrl required for the verification link
        $actionText  = 'Click here to verify your email';
        return (new MailMessage)->subject('Verify your account')->view(
            'emails.user-verify',
            [
                'user'=> $this->user,
                'actionText' => $actionText,
                'actionUrl' => $actionUrl,
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
