import { motion } from 'framer-motion';
import { ContactInfo } from './ContactInfo';
import { ContactForm } from './ContactForm';
import { Toaster } from 'react-hot-toast';
import Header from '../shared/Header';
import Footer from '../shared/Footer';
import Chat from '../ai/Chat';

const EMAILJS_CONFIG = {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    userId: import.meta.env.VITE_EMAILJS_USER_ID,
};

export default function Contact() {
    return (
        <div>
            <Header />
            <section id="contact" className="py-20 bg-background dark:bg-gray-800">
                <Toaster position="top-right" reverseOrder={false} />
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto"
                    >
                        <h2 className="text-4xl font-bold text-center mb-16 text-foreground dark:text-white">
                            Get in Touch
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <ContactInfo
                                email="023.ankitsrivastav@gmail.com"
                                phone="+91-9598579077"
                                location="Kanpur, Uttar Pradesh, India"
                            />
                            <ContactForm
                                serviceId={EMAILJS_CONFIG.serviceId}
                                templateId={EMAILJS_CONFIG.templateId}
                                userId={EMAILJS_CONFIG.userId}
                            />
                        </div>
                    </motion.div>
                </div>
                <Chat />
            </section>
            <Footer />
        </div>
    );
}
