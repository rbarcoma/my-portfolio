<?php

namespace Tests\Feature;

use App\Models\ContactMessage;
use App\Notifications\ContactMessageReceived;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\RateLimiter;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class ContactFormTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array<string, mixed>
     */
    private function payload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Ada Lovelace',
            'email' => 'ada@example.com',
            'subject' => 'Full-stack role',
            'message' => 'I would like to talk about a full-stack position on my team.',
            'website' => '',
        ], $overrides);
    }

    public function test_contact_page_renders(): void
    {
        $this->get(route('contact'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Contact')
                ->has('contact.headline')
                ->has('socials')
            );
    }

    public function test_valid_submission_is_persisted_and_notified(): void
    {
        Notification::fake();

        $response = $this->from(route('contact'))->post(route('contact.store'), $this->payload());

        $response->assertRedirect(route('contact'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('contact_messages', [
            'name' => 'Ada Lovelace',
            'email' => 'ada@example.com',
            'subject' => 'Full-stack role',
        ]);

        Notification::assertSentOnDemand(ContactMessageReceived::class);
    }

    public function test_email_is_normalised_before_storage(): void
    {
        Notification::fake();

        $this->post(route('contact.store'), $this->payload(['email' => '  ADA@Example.COM ']));

        $this->assertDatabaseHas('contact_messages', ['email' => 'ada@example.com']);
    }

    public function test_invalid_submission_is_rejected_and_stores_nothing(): void
    {
        Notification::fake();

        $response = $this->from(route('contact'))->post(route('contact.store'), $this->payload([
            'email' => 'not-an-email',
            'message' => 'short',
        ]));

        $response->assertRedirect(route('contact'));
        $response->assertSessionHasErrors(['email', 'message']);

        $this->assertSame(0, ContactMessage::count());
        Notification::assertNothingSent();
    }

    public function test_honeypot_submissions_are_rejected(): void
    {
        $response = $this->from(route('contact'))->post(route('contact.store'), $this->payload([
            'website' => 'https://spam.example',
        ]));

        $response->assertSessionHasErrors('website');

        $this->assertSame(0, ContactMessage::count());
    }

    public function test_submissions_are_rate_limited(): void
    {
        Notification::fake();

        foreach (range(1, 4) as $attempt) {
            $this->post(route('contact.store'), $this->payload([
                'message' => "Message number {$attempt} with enough characters to pass validation.",
            ]));
        }

        $response = $this->post(route('contact.store'), $this->payload([
            'message' => 'One message too many, which should be rejected by the throttle.',
        ]));

        $response->assertStatus(429);

        $this->assertSame(4, ContactMessage::count());
    }

    protected function setUp(): void
    {
        parent::setUp();

        RateLimiter::clear('127.0.0.1');
    }
}
