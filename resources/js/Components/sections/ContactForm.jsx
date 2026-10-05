import { useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Check, Send } from 'lucide-react';
import { useRoute } from '../../lib/route';
import { Button } from '../ui/button';
import { FieldError, Input, Label, Textarea } from '../ui/input';
import { cn } from '../../lib/utils';

export function ContactForm() {
    const route = useRoute();
    const { errors, flash } = usePage().props;
    const { data, setData, post, processing, reset, wasSuccessful } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
        website: '',
    });

    useEffect(() => {
        if (wasSuccessful && flash?.success) {
            reset();
        }
    }, [flash?.success, reset, wasSuccessful]);

    const submit = (event) => {
        event.preventDefault();
        post(route('contact.store'));
    };

    return (
        <form onSubmit={submit} noValidate className="rounded-card border border-hairline bg-surface p-5 sm:p-7">
            {flash?.success && (
                <div
                    role="status"
                    aria-live="polite"
                    className="mb-6 flex items-center gap-3 rounded-xl border border-hairline bg-surface-2 px-4 py-3 text-sm text-foreground"
                >
                    <Check className="size-4" aria-hidden="true" />
                    {flash.success}
                </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        name="name"
                        value={data.name}
                        onChange={(event) => setData('name', event.target.value)}
                        autoComplete="name"
                        required
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        className="mt-2"
                    />
                    <FieldError id="name-error">{errors.name}</FieldError>
                </div>

                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={data.email}
                        onChange={(event) => setData('email', event.target.value)}
                        autoComplete="email"
                        required
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        className="mt-2"
                    />
                    <FieldError id="email-error">{errors.email}</FieldError>
                </div>
            </div>

            <div className="mt-5">
                <Label htmlFor="subject">Subject</Label>
                <Input
                    id="subject"
                    name="subject"
                    value={data.subject}
                    onChange={(event) => setData('subject', event.target.value)}
                    className="mt-2"
                    aria-invalid={Boolean(errors.subject)}
                    aria-describedby={errors.subject ? 'subject-error' : undefined}
                />
                <FieldError id="subject-error">{errors.subject}</FieldError>
            </div>

            <div className="mt-5">
                <Label htmlFor="message">Message</Label>
                <Textarea
                    id="message"
                    name="message"
                    value={data.message}
                    onChange={(event) => setData('message', event.target.value)}
                    required
                    rows={6}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    className="mt-2"
                />
                <FieldError id="message-error">{errors.message}</FieldError>
            </div>

            <div className={cn('absolute -left-[9999px]', 'h-px w-px overflow-hidden')} aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                    id="website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={data.website}
                    onChange={(event) => setData('website', event.target.value)}
                />
            </div>

            <div className="mt-7">
                <Button type="submit" size="lg" disabled={processing}>
                    <Send aria-hidden="true" />
                    {processing ? 'Sending…' : 'Send message'}
                </Button>
            </div>
        </form>
    );
}

export default ContactForm;
