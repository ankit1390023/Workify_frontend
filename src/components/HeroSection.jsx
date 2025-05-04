import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const HeroSection = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={containerRef} className="relative overflow-hidden bg-background min-h-screen">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
            
            {/* Animated Background Elements */}
            <motion.div
                className="absolute top-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full filter blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 50, 0],
                    y: [0, -50, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400/20 rounded-full filter blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, -50, 0],
                    y: [0, 50, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Floating Elements */}
            <motion.div
                className="absolute top-1/4 left-1/4 w-8 h-8 bg-primary/20 rounded-full"
                animate={{
                    y: [0, -20, 0],
                    x: [0, 20, 0],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="absolute bottom-1/4 right-1/4 w-12 h-12 bg-secondary/20 rounded-full"
                animate={{
                    y: [0, 20, 0],
                    x: [0, -20, 0],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Content */}
            <motion.div 
                style={{ y, opacity }}
                className="relative z-10 container mx-auto px-6 py-16 lg:py-24"
            >
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    {/* Text Content */}
                    <div className="max-w-2xl text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <motion.span
                                className="text-primary font-semibold text-lg mb-4 block"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                Welcome to Workify
                            </motion.span>
                            <motion.h1 
                                className="text-4xl lg:text-6xl font-bold leading-tight text-foreground"
                            >
                                Your <span className="text-primary">Dream Job</span> Awaits
                            </motion.h1>
                        </motion.div>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="mt-6 text-lg lg:text-xl text-muted-foreground"
                        >
                            Workify connects you with top companies and helps you unlock
                            your full potential. Start your journey to success today.
                        </motion.p>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start"
                        >
                            <Button
                                onClick={() => navigate(`/Jobs`)}
                                className="px-6 py-3 font-semibold text-lg bg-primary hover:bg-primary/90 text-white rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 group"
                            >
                                <span className="relative z-10">Explore Jobs</span>
                                <motion.span
                                    className="absolute inset-0 bg-primary/20 rounded-lg"
                                    initial={{ scale: 0 }}
                                    whileHover={{ scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => navigate(`/browse`)}
                                className="px-6 py-3 font-semibold text-lg border-2 border-primary text-primary hover:bg-primary/10 rounded-lg transform hover:scale-105 transition-all duration-300 group"
                            >
                                <span className="relative z-10">Browse Companies</span>
                                <motion.span
                                    className="absolute inset-0 bg-primary/10 rounded-lg"
                                    initial={{ scale: 0 }}
                                    whileHover={{ scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </Button>
                        </motion.div>
                    </div>

                    {/* Image Gallery */}
                    <div className="relative w-full lg:w-1/2">
                        <motion.div
                            className="grid grid-cols-2 gap-4"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <motion.div
                                className="relative h-48 rounded-xl overflow-hidden shadow-lg group"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                                    alt="Team Collaboration"
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                    <span className="text-white font-semibold">Team Collaboration</span>
                                </div>
                            </motion.div>
                            <motion.div
                                className="relative h-48 rounded-xl overflow-hidden shadow-lg group"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                                    alt="Career Growth"
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                    <span className="text-white font-semibold">Career Growth</span>
                                </div>
                            </motion.div>
                            <motion.div
                                className="relative h-48 rounded-xl overflow-hidden shadow-lg group"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                                    alt="Professional Development"
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                    <span className="text-white font-semibold">Professional Development</span>
                                </div>
                            </motion.div>
                            <motion.div
                                className="relative h-48 rounded-xl overflow-hidden shadow-lg group"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                                    alt="Work-Life Balance"
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                    <span className="text-white font-semibold">Work-Life Balance</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
