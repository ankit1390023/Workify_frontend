import React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import emailjs from '@emailjs/browser';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

emailjs.init('njHD48xNl8tkUu47J'); // Replace with your EmailJS user ID

const contactFormSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const ContactForm = ({ serviceId, templateId, userId }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, touchedFields, isSubmitting },
    } = useForm({
        resolver: zodResolver(contactFormSchema),
    });

    const onSubmit = async (data) => {
        const emailData = {
            from_name: data.name,
            reply_to: data.email,
            message: data.message,
        };

        try {
            await emailjs.send(serviceId, templateId, emailData, userId);
            toast.success('Message sent successfully!');
            reset();
        } catch (error) {
            console.error('EmailJS Error:', error);
            toast.error('Failed to send the message. Please try again.');
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
        >
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-foreground mb-2"
                >
                    Name
                </label>
                <Input
                    {...register('name')}
                    type="text"
                    id="name"
                    className={`w-full ${touchedFields.name && errors.name ? 'border-destructive focus:ring-destructive' : ''}`}
                />
                {touchedFields.name && errors.name && (
                    <p className="mt-2 text-sm text-destructive">
                        {errors.name.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground mb-2"
                >
                    Email
                </label>
                <Input
                    {...register('email')}
                    type="email"
                    id="email"
                    className={`w-full ${touchedFields.email && errors.email ? 'border-destructive focus:ring-destructive' : ''}`}
                />
                {touchedFields.email && errors.email && (
                    <p className="mt-2 text-sm text-destructive">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="message"
                    className="block text-sm font-medium text-foreground mb-2"
                >
                    Message
                </label>
                <Textarea
                    {...register('message')}
                    id="message"
                    rows={4}
                    className={`w-full ${touchedFields.message && errors.message ? 'border-destructive focus:ring-destructive' : ''}`}
                />
                {touchedFields.message && errors.message && (
                    <p className="mt-2 text-sm text-destructive">
                        {errors.message.message}
                    </p>
                )}
            </div>

            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
                {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
        </form>
    );
};
