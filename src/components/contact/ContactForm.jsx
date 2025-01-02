import React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import emailjs from '@emailjs/browser';
import { toast } from 'react-hot-toast';

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
            className="space-y-6 p-6 rounded-lg shadow-md bg-white dark:bg-gray-800 transition-colors"
        >
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Name
                </label>
                <input
                    {...register('name')}
                    type="text"
                    id="name"
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${touchedFields.name && errors.name ? 'border-red-600 focus:border-red-600 focus:ring-red-500' : 'border-gray-300'
                        }`}
                />
                {touchedFields.name && errors.name && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {errors.name.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Email
                </label>
                <input
                    {...register('email')}
                    type="email"
                    id="email"
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${touchedFields.email && errors.email ? 'border-red-600 focus:border-red-600 focus:ring-red-500' : 'border-gray-300'
                        }`}
                />
                {touchedFields.email && errors.email && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Message
                </label>
                <textarea
                    {...register('message')}
                    id="message"
                    rows={4}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${touchedFields.message && errors.message ? 'border-red-600 focus:border-red-600 focus:ring-red-500' : 'border-gray-300'
                        }`}
                ></textarea>
                {touchedFields.message && errors.message && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {errors.message.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
                {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
        </form>
    );
};
