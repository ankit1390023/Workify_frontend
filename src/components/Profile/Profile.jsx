import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { Contact, Mail, Pen, User, FileText, Upload, CheckCircle2, XCircle, Briefcase, GraduationCap, Award, Star, Image, Phone, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";        
import { Label } from "@radix-ui/react-dropdown-menu";
import UpdateProfileDialog from "../UpdateProfileDialog";
import { useSelector, useDispatch } from "react-redux";
import Header from "../shared/Header";
import Footer from "../shared/Footer";
import Chat from "../ai/Chat";
import { motion } from "framer-motion";
import { Progress } from "../ui/progress";
import { toast } from "sonner";
import { useDashboardData } from "../hooks/useDashboardData";
import Loader from '../ui/Loader';
import { setUser } from "@/redux/authSlice";

const MAX_FILE_SIZE_MB = 5;
const API_END_POINT = import.meta.env.VITE_API_END_POINT;
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
                                <Loader size="sm" variant="light" message="Uploading cover..." />
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
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300">
                                        <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <p className="text-gray-700 dark:text-gray-300">{user?.email}</p>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300">
                                        <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <p className="text-gray-700 dark:text-gray-300">{user?.phoneNumber || "Not provided"}</p>
                                    </div>
                                 
                                </div>
                            </motion.div>

                            {/* Skills Section */}
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Skills</h2>
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
                                                <Loader size="sm" message="Loading..." />
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
                                                <Loader size="sm" message="Loading..." />
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
                                                <Loader size="sm" message="Loading..." />
                                            ) : (
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{profileScore}%</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Resume Section */}
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Resume</h2>
                                {hasResume ? (
                                    <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            <span className="text-gray-700 dark:text-gray-300">
                                                {user?.profile?.resumeOriginalName || "View Resume"}
                                            </span>
                                        </div>
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href={`${user?.profile?.resume}?fl_attachment=false&preview=true`}
                                            className="text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            View Resume
                                        </a>
                                    </div>
                                ) : (
                                    <div 
                                        {...getRootProps()}
                                        className={`text-center p-8 rounded-lg border-2 border-dashed transition-all duration-300 ${getDropzoneClasses()}`}
                                    >
                                        <input {...getInputProps()} />
                                        {isUploading ? (
                                            <div className="text-center">
                                                <p className="text-gray-600 dark:text-gray-200 mb-2">Uploading...</p>
                                                <Progress value={uploadProgress} className="w-full" />
                                            </div>
                                        ) : isDragActive ? (
                                            <p className="text-blue-600 dark:text-blue-400">Drop your resume here...</p>
                                        ) : (
                                            <div className="space-y-4">
                                                <Upload className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500" />
                                                <p className="text-gray-500 dark:text-gray-400">No resume uploaded yet</p>
                                                <p className="text-gray-600 dark:text-gray-200">
                                                    Drag and drop your resume here, or click to browse
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
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
