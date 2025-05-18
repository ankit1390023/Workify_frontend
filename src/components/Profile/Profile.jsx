import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { Contact, Mail, Pen, User, FileText, Upload, CheckCircle2, XCircle, Briefcase, GraduationCap, Award, Star, Image, Phone, Trash2, MapPin, DollarSign, Link2, Heart, Languages, Loader } from "lucide-react";
import { Badge } from "../ui/badge";        

import UpdateProfileDialog from "../UpdateProfileDialog";
import { useSelector, useDispatch } from "react-redux";
import Header from "../shared/Header";
import Footer from "../shared/Footer";
import Chat from "../ai/Chat";
import { motion } from "framer-motion";
import { Progress } from "../ui/progress";
import { toast } from "sonner";
import { useDashboardData } from "../hooks/useDashboardData";
import { setUser } from "@/redux/authSlice";


const MAX_FILE_SIZE_MB = 5;
const API_END_POINT = import.meta.env.VITE_API_END_POINT;

// Add date formatting function
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
    });
};

const Profile = () => {
    const hasResume = true;
    const [open, setOpen] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const [resume, setResume] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isCoverUploading, setIsCoverUploading] = useState(false);
    const [coverUploadProgress, setCoverUploadProgress] = useState(0);
    const { stats: { totalAppliedJobs, totalInterviews, totalPending, totalRejected, totalSelected, profileScore } } = useSelector((state) => state.dashboard);
    const { loading, error } = useDashboardData();
    const dispatch = useDispatch();

    // Default professional cover image
    const defaultCoverImage = "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80";



    const getDropzoneClasses = () =>
        `border-dashed border-2 p-4 rounded-lg transition-all duration-300 ${
            isDragActive
                ? "border-blue-600 bg-blue-50 dark:bg-black/40"
                : "border-gray-400 bg-gray-100 dark:bg-black/40 hover:border-blue-500"
        }`;

    const onCoverDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];

            if (file.size / 1024 / 1024 > 5) {
                toast.error("Cover image size exceeds 5MB limit.");
                return;
            }

            const formData = new FormData();
            formData.append("coverImage", file);

            try {
                setIsCoverUploading(true);
                setCoverUploadProgress(0);
                console.log("Uploading cover image.123..");
                const response = await axios.patch(
                    `${API_END_POINT}/user/update-cover-image`,
                    formData,
                    {
                        headers: { 
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                        },
                        onUploadProgress: (progressEvent) => {
                            const progress = Math.round(
                                (progressEvent.loaded * 100) / progressEvent.total
                            );
                            setCoverUploadProgress(progress);
                        },
                    }
                );

                if (response.data.success) {
                    // Update the user state with new cover image
                    dispatch(setUser(response.data.data));
                    toast.success("Cover image updated successfully!");
                } else {
                    throw new Error(response.data.message || "Failed to update cover image");
                }
            } catch (error) {
                console.error("Error uploading cover image:", error.response?.data || error.message);
                toast.error(error.response?.data?.message || "Failed to upload cover image. Please try again.");
            } finally {
                setIsCoverUploading(false);
                setCoverUploadProgress(0);
            }
        }
    }, [dispatch]);

    const { getRootProps: getCoverRootProps, getInputProps: getCoverInputProps, isDragActive: isCoverDragActive } = useDropzone({
        onDrop: onCoverDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
        },
        maxSize: 5 * 1024 * 1024, // 5MB
        multiple: false
    });

    const getCoverDropzoneClasses = () =>
        `absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            isCoverDragActive
                ? "bg-black/60"
                : "bg-black/0 hover:bg-black/40"
        }`;

    const handleDeleteCoverImage = async () => {
        try {
            const response = await axios.delete(
                `${API_END_POINT}/user/delete-cover-image`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                }
            );

            if (response.data.success) {
                dispatch(setUser(response.data.data));
                toast.success("Cover image removed successfully!");
            } else {
                throw new Error(response.data.message || "Failed to remove cover image");
            }
        } catch (error) {
            console.error("Error removing cover image:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Failed to remove cover image. Please try again.");
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black"
        >
            <Header/>
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-7xl mx-auto my-8 p-6"
            >
                {/* Enhanced Cover Section with Upload */}
                <div className="relative w-full h-72 rounded-2xl  shadow-xl group">
                    <div className="absolute inset-0 z-0">
                        <img 
                            src={user?.profile?.coverImage || defaultCoverImage} 
                            alt="Cover" 
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 dark:to-black/80" />
                    </div>
                    
                    {/* Cover Image Upload Overlay */}
                    <div {...getCoverRootProps()} className={getCoverDropzoneClasses()}>
                        <input {...getCoverInputProps()} />
                        {isCoverUploading ? (
                            <div className="text-center text-white">
                                <div className="flex flex-col items-center space-y-4">
                                    <Loader className="h-8 w-8 animate-spin text-white" />
                                    <span className="text-lg font-semibold text-white animate-pulse">
                                        Uploading cover...
                                    </span>
                                </div>
                                <Progress value={coverUploadProgress} className="w-48 mt-2" />
                            </div>
                        ) : isCoverDragActive ? (
                            <div className="text-center text-white">
                                <Image className="w-12 h-12 mx-auto mb-2" />
                                <p>Drop your cover image here...</p>
                            </div>
                        ) : (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                                <Button
                                    className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Image className="w-4 h-4 mr-2" />
                                    Change Cover
                                </Button>
                                {user?.profile?.coverImage && (
                                    <Button
                                        variant="destructive"
                                        className="bg-red-500/20 hover:bg-red-500/30 text-white backdrop-blur-sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteCoverImage();
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Remove Cover
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="absolute left-8 bottom-[-60px] z-10">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            className="relative z-20"
                        >
                            <Avatar className="h-40 w-40 border-4 border-white dark:border-gray-800 shadow-2xl bg-white">
                                <AvatarImage src={user?.profile?.avatar} alt={`${user?.fullName}'s avatar`} />
                                <AvatarFallback>
                                    <User className="h-20 w-20 text-gray-400" />
                                </AvatarFallback>
                            </Avatar>
                        </motion.div>
                    </div>
                </div>

                {/* Profile Content */}
                <div className="mt-24">
                    {/* Main Content Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-8">
                            
                            {/* About Section */}
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">{user?.fullName}</h2>
                                    <Button
                                        onClick={() => setOpen(true)}
                                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                                    >
                                        <Pen className="w-4 h-4" />
                                        Edit Profile
                                    </Button>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 text-lg mb-6 leading-relaxed">{user?.profile?.bio}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300">
                                        <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <p className="text-gray-700 dark:text-gray-300">{user?.email}</p>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300">
                                        <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <p className="text-gray-700 dark:text-gray-300">{user?.phoneNumber || "Not provided"}</p>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300">
                                        <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <p className="text-gray-700 dark:text-gray-300">
                                            {user?.profile?.location?.city && user?.profile?.location?.country 
                                                ? `${user.profile.location.city}, ${user.profile.location.country}`
                                                : "Location not specified"}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300">
                                        <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <p className="text-gray-700 dark:text-gray-300">
                                            {user?.profile?.expectedSalary?.amount 
                                                ? `${user.profile.expectedSalary.amount} ${user.profile.expectedSalary.currency}`
                                                : "Salary not specified"}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Skills Section */}
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.7 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center gap-2 mb-6">
                                    <Star className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Skills</h2>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {user?.profile?.skills?.map((skill, index) => (
                                        <Badge 
                                            key={index}
                                            className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 dark:from-blue-900 dark:to-purple-900 dark:text-blue-200 hover:scale-105 transition-all duration-300"
                                        >
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </motion.div>
                            {/* Education Section */}
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center gap-2 mb-6">
                                    <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Education</h2>
                                </div>
                                <div className="space-y-6">
                                    {user?.profile?.education?.map((edu, index) => (
                                        <div key={index} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{edu.institution}</h3>
                                            <p className="text-gray-600 dark:text-gray-300">{edu.degree} in {edu.fieldOfStudy}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                                            </p>
                                            {edu.description && (
                                                <p className="mt-2 text-gray-700 dark:text-gray-300">{edu.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Experience Section */}
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center gap-2 mb-6">
                                    <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Experience</h2>
                                </div>
                                <div className="space-y-6">
                                    {user?.profile?.experience?.map((exp, index) => (
                                        <div key={index} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{exp.position}</h3>
                                            <p className="text-gray-600 dark:text-gray-300">{exp.company}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                                            </p>
                                            {exp.description && (
                                                <p className="mt-2 text-gray-700 dark:text-gray-300">{exp.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            {/* Stats Section */}
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.7 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Stats</h2>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 hover:scale-[1.02] transition-all duration-300">
                                        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                                            <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400">Applied Jobs</p>
                                            {loading ? (
                                                <Loader className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalAppliedJobs}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 hover:scale-[1.02] transition-all duration-300">
                                        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                                            <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400">Interviews</p>
                                            {loading ? (
                                                <Loader className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalInterviews}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/30 dark:to-teal-900/30 hover:scale-[1.02] transition-all duration-300">
                                        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                                            <Star className="w-6 h-6 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400">Profile Score</p>
                                            {loading ? (
                                                <Loader className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{profileScore}%</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>


                            {/* Social Links Section */}
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 1.0 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                             >
                                <div className="flex items-center gap-2 mb-6">
                                    <Link2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Social Links</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {user?.profile?.socialLinks?.linkedin && (
                                        <a 
                                            href={user.profile.socialLinks.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                                        >
                                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                            </svg>
                                            <span className="text-gray-700 dark:text-gray-300">LinkedIn</span>
                                        </a>
                                    )}
                                    {user?.profile?.socialLinks?.github && (
                                        <a 
                                            href={user.profile.socialLinks.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                                        >
                                            <svg className="w-5 h-5 text-gray-900 dark:text-gray-100" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                            </svg>
                                            <span className="text-gray-700 dark:text-gray-300">GitHub</span>
                                        </a>
                                    )}
                                    {user?.profile?.socialLinks?.portfolio && (
                                        <a 
                                            href={user.profile.socialLinks.portfolio}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                                        >
                                            <Link2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            <span className="text-gray-700 dark:text-gray-300">Portfolio</span>
                                        </a>
                                    )}
                                    {user?.profile?.socialLinks?.twitter && (
                                        <a 
                                            href={user.profile.socialLinks.twitter}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                                        >
                                            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                            </svg>
                                            <span className="text-gray-700 dark:text-gray-300">Twitter</span>
                                        </a>
                                    )}
                                </div>
                            </motion.div>

                            {/* Certifications Section */}
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.9 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center gap-2 mb-6">
                                    <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Certifications</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {user?.profile?.certifications?.map((cert, index) => (
                                        <div key={index} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{cert.name}</h3>
                                            <p className="text-gray-600 dark:text-gray-300">Issued by: {cert.issuer}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {formatDate(cert.date)} - {cert.expiryDate ? formatDate(cert.expiryDate) : 'No expiry'}
                                            </p>
                                            {cert.credentialId && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400">ID: {cert.credentialId}</p>
                                            )}
                                            {cert.credentialUrl && (
                                                <a 
                                                    href={cert.credentialUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                                                >
                                                    View Credential
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Languages Section */}
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 1.0 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center gap-2 mb-6">
                                    <Languages className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Languages</h2>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    {user?.profile?.languages?.map((item, index) => (
                                        item.language && (
                                            <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50">
                                                        <span className="text-lg font-semibold text-blue-600 dark:text-blue-300">
                                                            {item.language.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                            {item.language}
                                                        </h3>
                                                    </div>
                                                </div>
                                                <Badge 
                                                    className={`px-3 py-1 text-sm font-medium ${
                                                        item.proficiency === 'Native' || item.proficiency === 'Fluent'
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                                                            : item.proficiency === 'Advanced'
                                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                                                            : item.proficiency === 'Intermediate'
                                                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                                    }`}
                                                >
                                                    {item.proficiency}
                                                </Badge>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </motion.div>

                            {/* Job Preferences Section */}
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 1.2 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center gap-2 mb-6">
                                    <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Job Preferences</h2>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Preferred Job Types</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {user?.profile?.preferredJobTypes?.map((type, index) => (
                                                <Badge 
                                                    key={index}
                                                    className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-green-100 to-blue-100 text-green-800 dark:from-green-900 dark:to-blue-900 dark:text-green-200 hover:scale-105 transition-all duration-300"
                                                >
                                                    {type}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Expected Salary</h3>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            {user?.profile?.expectedSalary?.amount 
                                                ? `${user.profile.expectedSalary.amount} ${user.profile.expectedSalary.currency}`
                                                : "Not specified"}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>


                            {/* Interests Section */}
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 1.1 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center gap-2 mb-6">
                                    <Heart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Interests</h2>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {user?.profile?.interests?.map((interest, index) => (
                                        <Badge 
                                            key={index}
                                            className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-pink-100 to-purple-100 text-pink-800 dark:from-pink-900 dark:to-purple-900 dark:text-pink-200 hover:scale-105 transition-all duration-300"
                                        >
                                            {interest}
                                        </Badge>
                                    ))}
                                </div>
                            </motion.div>

                           


                        </div>
                    </div>
                </div>
            </motion.div>
            <Chat />
            <Footer/>
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </motion.div>
    );
};

export default Profile;
