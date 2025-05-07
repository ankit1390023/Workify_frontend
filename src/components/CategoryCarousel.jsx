import { useNavigate } from "react-router-dom";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../components/ui/carousel";
import { Button } from './ui/button';
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { setSearchQuery, setCategoryFilter, setAllJobs } from "@/redux/jobSlice";
import { motion } from "framer-motion";

const categories = [
    {
        name: "Software Development",
        icon: "💻",
        color: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
        keywords: ["software", "developer", "programming", "coding"]
    },
    {
        name: "Data Science",
        icon: "📊",
        color: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
        keywords: ["data", "analyst", "machine learning", "ai"]
    },
    {
        name: "Web Development",
        icon: "🌐",
        color: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
        keywords: ["web", "frontend", "backend", "fullstack"]
    },
    {
        name: "DevOps",
        icon: "⚙️",
        color: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
        keywords: ["devops", "cloud", "infrastructure", "deployment"]
    },
    {
        name: "React Native",
        icon: "📱",
        color: "bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20",
        keywords: ["react", "mobile", "app", "react native"]
    },
    {
        name: "MERN Stack",
        icon: "🚀",
        color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
        keywords: ["mern", "mongodb", "express", "react", "node"]
    },
    {
        name: "Cloud Computing",
        icon: "☁️",
        color: "bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20",
        keywords: ["cloud", "aws", "azure", "gcp"]
    },
];

const CategoryCarousel = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeCategory, setActiveCategory] = useState(null);
    const { allJobs } = useSelector((state) => state.job);

    const searchJobHandler = (category) => {
        setActiveCategory(category.name);
        
        // Filter jobs based on category keywords
        const filteredJobs = allJobs.filter(job => {
            // Helper function to normalize search terms
            const normalizeSearchTerm = (term) => {
                if (!term) return '';
                return term.toLowerCase().replace(/\s+/g, '');
            };

            // Helper function to check if a job matches any of the keywords
            const matchesKeywords = (text, keywords) => {
                if (!text) return false;
                const normalizedText = normalizeSearchTerm(text);
                return keywords.some(keyword => {
                    const normalizedKeyword = normalizeSearchTerm(keyword);
                    return normalizedText.includes(normalizedKeyword);
                });
            };

            // Check if job matches any of the category keywords in any field
            const matchesTitle = matchesKeywords(job.title, category.keywords);
            const matchesDescription = matchesKeywords(job.description, category.keywords);
            const matchesRequirements = job.requirements && job.requirements.some(req => matchesKeywords(req, category.keywords));
            const matchesJobType = matchesKeywords(job.jobType, category.keywords);

            return matchesTitle || matchesDescription || matchesRequirements || matchesJobType;
        });

        // Update Redux state with filtered jobs
        dispatch(setAllJobs(filteredJobs));
        dispatch(setCategoryFilter(category.name));
        dispatch(setSearchQuery(''));
        
        // Navigate to browse page
        navigate("/browse");
    };

    // Get the count of jobs for each category
    const getJobCount = (category) => {
        if (!allJobs) return 0;
        
        // Helper function to normalize search terms
        const normalizeSearchTerm = (term) => {
            if (!term) return '';
            return term.toLowerCase().replace(/\s+/g, '');
        };

        // Helper function to check if a job matches any of the keywords
        const matchesKeywords = (text, keywords) => {
            if (!text) return false;
            const normalizedText = normalizeSearchTerm(text);
            return keywords.some(keyword => {
                const normalizedKeyword = normalizeSearchTerm(keyword);
                return normalizedText.includes(normalizedKeyword);
            });
        };

        // Filter jobs based on category keywords
        const filteredJobs = allJobs.filter(job => {
            // Check if job matches any of the category keywords in any field
            const matchesTitle = matchesKeywords(job.title, category.keywords);
            const matchesDescription = matchesKeywords(job.description, category.keywords);
            const matchesRequirements = job.requirements && job.requirements.some(req => matchesKeywords(req, category.keywords));
            const matchesJobType = matchesKeywords(job.jobType, category.keywords);

            return matchesTitle || matchesDescription || matchesRequirements || matchesJobType;
        });

        return filteredJobs.length;
    };

    return (
        <div className="max-w-4xl mx-auto px-4">
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                    skipSnaps: false,
                    dragFree: true,
                    containScroll: "trimSnaps",
                }}
                className="w-full relative"
            >
                <CarouselContent className="-ml-1">
                    {categories.map((category, index) => (
                        <CarouselItem
                            key={index}
                            className="pl-1 basis-1/2 sm:basis-1/3 md:basis-1/4"
                        >
                            <motion.div
                                className="p-1"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    onClick={() => searchJobHandler(category)}
                                    className={`w-full h-24 flex flex-col items-center justify-center gap-2 rounded-xl transition-all duration-300 ${category.color} ${
                                        activeCategory === category.name ? 'ring-2 ring-offset-2 ring-primary' : ''
                                    }`}
                                >
                                    <span className="text-2xl">{category.icon}</span>
                                    <span className="text-sm font-medium">{category.name}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {getJobCount(category)} jobs
                                    </span>
                                </Button>
                            </motion.div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <div className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-between pointer-events-none">
                    <CarouselPrevious className="static pointer-events-auto h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border-2 hover:bg-background/90" />
                    <CarouselNext className="static pointer-events-auto h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border-2 hover:bg-background/90" />
                </div>
            </Carousel>
        </div>
    );
};

export default CategoryCarousel;