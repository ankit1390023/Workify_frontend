import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { API_END_POINT } from '@/utils/constant';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/authSlice';

const UpdateProfileDialog = ({ open, setOpen, onSave }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [input, setInput] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        bio: user?.profile?.bio || '',
        skills: user?.profile?.skills || [],
        resume: null,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({ ...prev, [name]: value }));
    };

    const handleSkillsChange = (e) => {
        const skillsString = e.target.value;
        const skillsArray = skillsString
            .split(',')
            .map((skill) => skill.trim())
            .filter((skill) => skill !== '');
        setInput((prev) => ({ ...prev, skills: skillsArray }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        setInput((prev) => ({ ...prev, resume: file }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('fullName', input.fullName);
        formData.append('email', input.email);
        formData.append('phoneNumber', input.phoneNumber);
        formData.append('bio', input.bio);
        formData.append('skills', input.skills.join(',')); // Convert array to comma-separated string
        if (input.resume) {
            formData.append('resume', input.resume);
        }

        try {
            const response = await axios.patch(
                `${API_END_POINT}/user/update-account`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                    },
                }
            );

            if (response.data.success) {
                dispatch(setUser(response.data.user));
                toast.success('Profile updated successfully!');
                onSave && onSave(response.data.user);
                setOpen(false);  // Close the dialog after saving
            } else {
                toast.error(response.data.message || 'Failed to update profile.');
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                'Something went wrong while updating the profile.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl shadow-lg transition-all ease-in-out transform duration-300 max-h-[75vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold text-indigo-600">Update Your Profile</DialogTitle>
                    <DialogDescription className="text-lg text-gray-600">
                        Update your profile information below. Click "Save" when you're done.
                    </DialogDescription>
                </DialogHeader>

                <form className="space-y-6 p-4" onSubmit={handleFormSubmit}>
                    <div>
                        <Label htmlFor="fullName" className="text-lg font-medium text-gray-700 dark:text-gray-300">Name</Label>
                        <Input
                            id="fullName"
                            name="fullName"
                            value={input.fullName}
                            onChange={handleInputChange}
                            placeholder="Enter your name"
                            className="mt-2 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    <div>
                        <Label htmlFor="email" className="text-lg font-medium text-gray-700 dark:text-gray-300">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            value={input.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            type="email"
                            className="mt-2 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    <div>
                        <Label htmlFor="phoneNumber" className="text-lg font-medium text-gray-700 dark:text-gray-300">Phone Number</Label>
                        <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            value={input.phoneNumber}
                            onChange={handleInputChange}
                            placeholder="Enter your phone number"
                            className="mt-2 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    <div>
                        <Label htmlFor="skills" className="text-lg font-medium text-gray-700 dark:text-gray-300">Skills</Label>
                        <Input
                            id="skills"
                            name="skills"
                            value={input.skills.join(', ')} // Convert array to comma-separated string
                            onChange={handleSkillsChange}
                            placeholder="Enter your skills (comma-separated)"
                            className="mt-2 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    <div>
                        <Label htmlFor="resume" className="text-lg font-medium text-gray-700 dark:text-gray-300">Resume</Label>
                        <Input
                            id="resume"
                            name="resume"
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            className="mt-2 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                        {user?.profile?.resumeOriginalName ? (
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Current Resume: <span className='text-blue-600 hover:underline'>{user.profile.resumeOriginalName}</span></p>
                        ) : (
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">No resume uploaded</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="bio" className="text-lg font-medium text-gray-700 dark:text-gray-300">Bio</Label>
                        <Textarea
                            id="bio"
                            name="bio"
                            value={input.bio}
                            onChange={handleInputChange}
                            placeholder="Tell us about yourself"
                            className="mt-2 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg shadow-md hover:from-indigo-700 hover:to-blue-700 transition-all ease-in-out"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateProfileDialog;
