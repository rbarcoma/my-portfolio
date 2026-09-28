<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactMessageRequest;
use App\Models\ContactMessage;
use App\Notifications\ContactMessageReceived;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Contact', [
            'contact' => config('portfolio.contact'),
            'socials' => config('portfolio.socials'),
        ]);
    }

    public function store(StoreContactMessageRequest $request): RedirectResponse
    {
        if ($request->hasFilledHoneypot()) {
            return back()->withErrors(['website' => 'Submission rejected.']);
        }

        $contactMessage = ContactMessage::create([
            ...$request->safe()->only(['name', 'email', 'subject', 'message']),
            'ip_address' => $request->ip(),
        ]);

        try {
            Notification::route('mail', config('portfolio.email'))
                ->notify(new ContactMessageReceived($contactMessage));
        } catch (\Throwable $exception) {
            Log::warning('Contact notification could not be sent.', [
                'contact_message_id' => $contactMessage->id,
                'exception' => $exception->getMessage(),
            ]);
        }

        return to_route('home')
            ->withFragment('contact')
            ->with('success', 'Message sent. I will get back to you shortly.');
    }
}
