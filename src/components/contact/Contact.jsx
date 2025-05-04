import { motion } from 'framer-motion';
import { ContactInfo } from './ContactInfo';
import { ContactForm } from './ContactForm';
import { Toaster } from 'react-hot-toast';
import Header from '../shared/Header';
import Footer from '../shared/Footer';
import Chat from '../ai/Chat';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

const EMAILJS_CONFIG = {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    userId: import.meta.env.VITE_EMAILJS_USER_ID,
};

export default function Contact() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <section id="contact" className="py-20">
                <Toaster position="top-right" reverseOrder={false} />
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-6xl mx-auto"
                    >
                        <div className="text-center mb-16">
                            <motion.h2 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-5xl font-bold text-foreground mb-4"
                            >
                                Get in Touch
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="text-xl text-muted-foreground max-w-2xl mx-auto"
                            >
                                Have questions or want to work together? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                            </motion.p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className="space-y-8"
                            >
                                <div className="bg-card p-8 rounded-xl border border-border transition-all duration-300">
                                    <h3 className="text-2xl font-semibold text-foreground mb-6">Contact Information</h3>
                                    <div className="space-y-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="p-3 bg-primary/10 rounded-full">
                                                <Mail className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-foreground">Email</h4>
                                                <p className="text-muted-foreground">023.ankitsrivastav@gmail.com</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-4">
                                            <div className="p-3 bg-primary/10 rounded-full">
                                                <Phone className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-foreground">Phone</h4>
                                                <p className="text-muted-foreground">+91-9598579077</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-4">
                                            <div className="p-3 bg-primary/10 rounded-full">
                                                <MapPin className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-foreground">Location</h4>
                                                <p className="text-muted-foreground">Kanpur, Uttar Pradesh, India</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-card p-8 rounded-xl border border-border transition-all duration-300">
                                    <h3 className="text-2xl font-semibold text-foreground mb-6">Support Hours</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-foreground">Monday - Friday</span>
                                            <span className="text-muted-foreground">9:00 AM - 6:00 PM</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-foreground">Saturday</span>
                                            <span className="text-muted-foreground">10:00 AM - 4:00 PM</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-foreground">Sunday</span>
                                            <span className="text-muted-foreground">Closed</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                            >
                                <div className="bg-card p-8 rounded-xl border border-border transition-all duration-300">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="p-3 bg-primary/10 rounded-full">
                                            <MessageSquare className="w-6 h-6 text-primary" />
                                        </div>
                                        <h3 className="text-2xl font-semibold text-foreground">Send us a Message</h3>
                                    </div>
                                    <ContactForm
                                        serviceId={EMAILJS_CONFIG.serviceId}
                                        templateId={EMAILJS_CONFIG.templateId}
                                        userId={EMAILJS_CONFIG.userId}
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>
            <Chat />
            <Footer />
        </div>
    );
}
