import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { Contact, Mail, Pen, User } from "lucide-react";
import { Badge } from "../ui/badge";
import { Label } from "@radix-ui/react-dropdown-menu";
import AppliedJobsTable from "../AppliedJobsTable";
import UpdateProfileDialog from "../UpdateProfileDialog";
import { useSelector } from "react-redux";

const Profile = () => {
    const hasResume = true;
    const [open, setOpen] = useState(false);
    const { user } = useSelector(state => state.auth);

    return (
        <div className="max-w-6xl mx-auto my-8 bg-white dark:bg-gray-900 rounded-lg">
            <div className="relative h-48 bg-gradient-to-r from-blue-300 via-purple-400 to-pink-300 dark:from-blue-600 dark:via-purple-700 dark:to-pink-600 rounded-t-lg">
                {user.profile.coverImage && (
                    <img
                        src={user?.profile?.coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover rounded-t-lg"
                    />
                )}
                <div className="absolute bottom-0 left-8 transform translate-y-1/2">
                    <Avatar className="h-24 w-24 shadow-md border-4 border-white dark:border-gray-900">
                        <AvatarImage src={user.profile.avatar} />
                        <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                </div>
            </div>
            <div className="p-8 pt-16">
                {/* Profile Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-black dark:text-white">{user.fullName}</h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {user?.profile?.bio}
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => setOpen(true)} // This triggers the update profile dialog
                        variant="outline"
                        className="text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <Pen className="mr-2" />
                        Update Profile
                    </Button>
                </div>

                {/* Contact Information */}
                <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                        <Mail className="w-5 h-5" />
                        <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                        <Contact className="w-5 h-5" />
                        <span>{user.phoneNumber}</span>
                    </div>
                </div>

                {/* Skills */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Skills</h2>
                    {user?.profile?.skills?.length ? (
                        <div className="flex flex-wrap gap-2">
                            {user?.profile?.skills.map((skill, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="px-3 py-1 bg-black dark:bg-gray-700 text-white rounded-full"
                                >
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        <span className="text-gray-500 dark:text-gray-400">No skills added yet.</span>
                    )}
                </div>

                {/* Resume */}
                <div className="mb-6">
                    <Label className="text-lg font-medium text-gray-800 dark:text-gray-200">Resume</Label>
                    {hasResume ? (
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-blue-600 dark:text-blue-400 hover:underline mt-1"
                            href={`${user?.profile?.resume}?fl_attachment=false`}
                        >
                            {user?.profile?.resumeOriginalName}
                        </a>
                    ) : (
                        <span className="text-gray-500 dark:text-gray-400">Not available</span>
                    )}
                </div>
            </div>

            {/* Applied Jobs Table */}
            <div className="p-8 rounded-b-lg bg-white dark:bg-gray-900">
                <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Applied Jobs</h2>
                <AppliedJobsTable />
            </div>

            {/* Update Profile Dialog */}
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    );
};

export default Profile;
