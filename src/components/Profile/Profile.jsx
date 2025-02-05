import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { Contact, Mail, Pen, User } from "lucide-react";
import { Badge } from "../ui/badge";
import { Label } from "@radix-ui/react-dropdown-menu";
import AppliedJobsTable from "../AppliedJobsTable";
import UpdateProfileDialog from "../UpdateProfileDialog";
import { useSelector } from "react-redux";
import { API_END_POINT } from '@/utils/constant';
import Header from "../shared/Header";
import Footer from "../shared/Footer";
import Chat from "../ai/Chat";
const MAX_FILE_SIZE_MB = 5;

const Profile = () => {
    const hasResume = true; // Replace with dynamic logic if required
    const [open, setOpen] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const [resume, setResume] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];

            if (file.size / 1024 / 1024 > MAX_FILE_SIZE_MB) {
                alert("File size exceeds 5MB limit.");
                return;
            }

            setResume(file);
            console.log("Selected file:", file);

            const formData = new FormData();
            formData.append("resume", file);

            try {
                setIsUploading(true);
                const response = await axios.patch(
                    `${API_END_POINT}/user/update-account`,
                    formData,
                    {
                        headers: { 'Content-Type': 'multipart/form-data' },

                    }
                );

                console.log("File uploaded successfully:", response.data);
                alert("Resume uploaded successfully!");
            } catch (error) {
                console.error("Error uploading resume:", error.response?.data || error.message);
                alert("Failed to upload resume. Please try again.");
            } finally {
                setIsUploading(false);
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
            "application/msword": [".doc", ".docx"],
        },
    });

    const getDropzoneClasses = () =>
        `border-dashed border-2 p-4 rounded-lg ${isDragActive
            ? "border-blue-600 bg-blue-50"
            : "border-gray-400 bg-gray-100 dark:bg-gray-800"
        }`;

    return (
        <div>
            <Header/>
        <div className="max-w-6xl mx-auto my-8 bg-white dark:bg-gray-900 rounded-lg">
            <div className="relative h-48 bg-gradient-to-r from-blue-300 via-purple-400 to-pink-300 dark:from-blue-600 dark:via-purple-700 dark:to-pink-600 rounded-t-lg">
                {user?.profile?.coverImage && (
                    <img
                        src={user.profile.coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover rounded-t-lg"
                    />
                )}
                <div className="absolute bottom-0 left-8 transform translate-y-1/2">
                    <Avatar className="h-24 w-24 shadow-md border-4 border-white dark:border-gray-900">
                        <AvatarImage
                            src={user?.profile?.avatar}
                            alt={`${user?.fullName}'s avatar`}
                        />
                        <AvatarFallback>
                            <User />
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
            <div className="p-8 pt-16">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-black dark:text-white">{user?.fullName}</h1>
                            <p className="text-gray-600 dark:text-gray-400">{user?.profile?.bio}</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => setOpen(true)}
                        variant="outline"
                        className="text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <Pen className="mr-2" />
                        Update Profile
                    </Button>
                </div>

                <div className="mb-6">
                    <Label className="text-lg font-medium text-gray-800 dark:text-gray-200">Resume</Label>
                    {hasResume ? (
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-blue-600 dark:text-blue-400 hover:underline mt-1"
                            href={`${user?.profile?.resume}?fl_attachment=false`}
                        >
                            {user?.profile?.resumeOriginalName || "View Resume"}
                        </a>
                    ) : (
                        <span className="text-gray-500 dark:text-gray-400">Not available</span>
                    )}
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Upload Resume</h2>
                    <div
                        {...getRootProps()}
                        className={getDropzoneClasses()}
                        aria-label="Drop your resume here"
                    >
                        <input {...getInputProps()} />
                        {isUploading ? (
                            <p className="text-center text-gray-600 dark:text-gray-300">Uploading...</p>
                        ) : isDragActive ? (
                            <p className="text-center text-blue-600">Drop your resume here...</p>
                        ) : (
                            <p className="text-center text-gray-600 dark:text-gray-300">
                                Drag and drop your resume here, or click to browse
                            </p>
                        )}
                    </div>
                    {resume && (
                        <div className="mt-4 text-gray-700 dark:text-gray-300">
                            <p>Uploaded File: {resume.name}</p>
                        </div>
                    )}
                </div>
            </div>

            {user && user.role === "student" && (
                <div className="p-8 rounded-b-lg bg-white dark:bg-gray-900">
                    <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Applied Jobs</h2>
                    <AppliedJobsTable />
                </div>
            )}

            <UpdateProfileDialog open={open} setOpen={setOpen} />
            </div>
            <Chat />
            <Footer/>
        </div>
    );
};

export default Profile;
