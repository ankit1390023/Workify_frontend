import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { Clock, MapPin, Briefcase, DollarSign, Award } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const API_END_POINT = import.meta.env.VITE_API_END_POINT;

const LatestJobCard = ({ job }) => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const { title, description, salary, location, jobType, experience, position, company, _id, createdAt, applications } = job;
    
    // Initialize isApplied state based on whether user has already applied
    const [isApplied, setIsApplied] = useState(false);

    // Update isApplied state when job or user changes
    useEffect(() => {
        if (applications && user?._id) {
            const hasApplied = applications.some(application => application.applicant === user._id);
            setIsApplied(hasApplied);
        }
    }, [applications, user?._id]);

    // Format the posted date to show relative time (e.g., "1 day ago", "Today")
    const formatDate = (date) => {
        const timeDiff = Math.floor((new Date() - new Date(date)) / (24*60*60*1000));
        if (timeDiff < 1) return "Today";
        if (timeDiff === 1) return "1 day ago";
        return `${timeDiff} days ago`;
    };

    const applyJobHandler = async (e) => {
        e.stopPropagation();
        if (!user) {
            toast.error("Please login to apply for jobs");
            return;
        }
        
        try {
            const response = await axios.get(`${API_END_POINT}/application/applyJob/${_id}`,
                {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                    },
                }
            );

            if (response.data.success) {
                setIsApplied(true);
                toast.success('Application submitted successfully!');
                // Update the applications array to include the current user
                job.applications = [...(job.applications || []), { applicant: user._id }];
            } else {
                toast.error(`Unable to apply: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Error applying for the job:', error);
            toast.error(error?.response?.data?.message || error.message || "An error occurred while submitting your application. Please try again.");
        }
    };

    return (
        <motion.div
            onClick={() => navigate(`/jobDescription/${_id}`)}
            whileHover={{ y: -5 }}
            className="group relative w-full h-full max-w-lg mx-auto bg-gradient-to-tr from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer"
        >
            {/* Decorative Ribbon */}
            <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-primary/80 text-white text-xs font-medium px-4 py-1 rounded-bl-lg shadow-md">
                <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(createdAt) || "Featured"}</span>
                </div>
            </div>

            {/* Card Content */}
            <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start space-x-4">
                    {/* Company Logo */}
                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 flex items-center justify-center overflow-hidden border border-primary/10">
                        {company?.logo ? (
                            <img 
                                src={company.logo} 
                                alt={company.companyName} 
                                className="object-cover h-full w-full"
                            />
                        ) : (
                            <span className="text-2xl font-bold text-primary">
                                {company?.companyName?.[0] || "C"}
                            </span>
                        )}
                    </div>

                    {/* Job Info */}
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-primary transition-colors duration-300">
                            {title || "NA"}
                        </h2>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            {company?.companyName || "Company Name"}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {location?.join(", ") || "Location not available"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">
                    {description || "Job description not available"}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                    <Badge 
                        className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-800/30 transition-colors"
                    >
                        <Briefcase className="w-3 h-3" />
                        {jobType || "Full-time"}
                    </Badge>
                    <Badge 
                        className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 border border-green-200 dark:border-green-800 hover:bg-green-200 dark:hover:bg-green-800/30 transition-colors"
                    >
                        <DollarSign className="w-3 h-3" />
                        {salary ? `$${salary}` : "Negotiable"}
                    </Badge>
                    <Badge 
                        className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-200 dark:hover:bg-purple-800/30 transition-colors"
                    >
                        <Award className="w-3 h-3" />
                        {experience ? `${experience}+ yrs` : "Entry Level"}
                    </Badge>
                    {position && (
                        <Badge 
                            className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 border border-orange-200 dark:border-orange-800 hover:bg-orange-200 dark:hover:bg-orange-800/30 transition-colors"
                        >
                            <span className="text-xs">👥</span>
                            {position} positions
                        </Badge>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default LatestJobCard;