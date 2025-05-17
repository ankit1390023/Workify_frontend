import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/authSlice';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MapPin, GraduationCap, Briefcase, Languages, Award, Link2, Heart, DollarSign, Plus, Trash2, FileText, Loader } from 'lucide-react';

const API_END_POINT = import.meta.env.VITE_API_END_POINT;

const UpdateProfileDialog = ({ open, setOpen, onSave }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('basic');

    const [input, setInput] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        bio: user?.profile?.bio || '',
        skills: user?.profile?.skills || [],
        resume: null,
        location: user?.profile?.location || { city: '', country: '', address: '' },
        education: user?.profile?.education || [],
        experience: user?.profile?.experience || [],
        languages: user?.profile?.languages || [],
        certifications: user?.profile?.certifications || [],
        socialLinks: user?.profile?.socialLinks || { linkedin: '', github: '', portfolio: '', twitter: '' },
        interests: user?.profile?.interests || [],
        preferredJobTypes: user?.profile?.preferredJobTypes || [],
        expectedSalary: user?.profile?.expectedSalary || { amount: '', currency: 'USD' }
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

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type === 'application/pdf' || 
                file.type === 'application/msword' || 
                file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                
                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    toast.error('File size should be less than 5MB');
                    return;
                }

                setLoading(true);
                const formData = new FormData();
                formData.append('file', file);

                try {
                    // First, parse the resume
                    const parseResponse = await axios.post('http://localhost:8000/parse-resume', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        withCredentials: false,
                    });

                    console.log("Response from parse resume:", parseResponse.data);
                    
                    if (parseResponse.data.error) {
                        toast.error(parseResponse.data.details || parseResponse.data.error);
                        return;
                    }

                    // Update the form with parsed data
                    const parsedData = parseResponse.data;
                    updateProfileWithParsedData(parsedData);

                    // Create a new FormData for profile update
                    const updateFormData = new FormData();
                    
                    // Add all profile fields
                    updateFormData.append('fullName', input.fullName);
                    updateFormData.append('email', input.email);
                    updateFormData.append('phoneNumber', input.phoneNumber);
                    updateFormData.append('bio', input.bio);
                    updateFormData.append('skills', input.skills.join(','));
                    updateFormData.append('location', JSON.stringify(input.location));
                    updateFormData.append('education', JSON.stringify(input.education));
                    updateFormData.append('experience', JSON.stringify(input.experience));
                    updateFormData.append('languages', JSON.stringify(input.languages));
                    updateFormData.append('certifications', JSON.stringify(input.certifications));
                    updateFormData.append('socialLinks', JSON.stringify(input.socialLinks));
                    updateFormData.append('interests', JSON.stringify(input.interests));
                    updateFormData.append('preferredJobTypes', JSON.stringify(input.preferredJobTypes));
                    updateFormData.append('expectedSalary', JSON.stringify(input.expectedSalary));
                    updateFormData.append('resume', file); // Add resume to the same request

                    // Update profile with resume
                    const updateResponse = await axios.patch(
                        `${API_END_POINT}/user/update-account`,
                        updateFormData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                            },
                        }
                    );

                    if (updateResponse.data.success) {
                        // Update Redux store with new user data
                        dispatch(setUser(updateResponse.data.user));
                        toast.success('Resume parsed and profile updated successfully!');
                        onSave && onSave(updateResponse.data.user);
                        setOpen(false);
                    } else {
                        toast.error(updateResponse.data.message || 'Failed to update profile.');
                    }
                } catch (error) {
                    console.error('Error details:', error);
                    if (!error.response) {
                        toast.error('Network error: Please check if the backend server is running at http://localhost:8000');
                    } else if (error.response.status === 413) {
                        toast.error('File size too large. Please upload a smaller file.');
                    } else if (error.response.status === 415) {
                        toast.error('Unsupported file type. Please upload a PDF or Word document.');
                    } else {
                        const errorMessage = error.response?.data?.details || 
                                           error.response?.data?.error || 
                                           error.message || 
                                           'Error parsing resume. Please try again.';
                        toast.error(errorMessage);
                    }
                } finally {
                    setLoading(false);
                }
            } else {
                toast.error('Please upload a PDF or Word document');
            }
        }
    };

    const updateProfileWithParsedData = (parsedData) => {
        if (!parsedData) return;

        const newInput = { ...input };

        // Update personal information
        if (parsedData.personal_info) {
            const { full_name, location, contact } = parsedData.personal_info;
            if (full_name) newInput.fullName = full_name;
            if (location) newInput.location = { ...newInput.location, address: location };
            if (contact) {
                if (contact.email) newInput.email = contact.email;
                if (contact.phone) newInput.phoneNumber = contact.phone;
                if (contact.professional_links) {
                    newInput.socialLinks = {
                        ...newInput.socialLinks,
                        linkedin: contact.professional_links.linkedin || '',
                        github: contact.professional_links.github || '',
                        portfolio: contact.professional_links.portfolio || '',
                        twitter: contact.professional_links.twitter || ''
                    };
                }
            }
        }

        // Update education
        if (parsedData.education && Array.isArray(parsedData.education)) {
            newInput.education = parsedData.education.map(edu => ({
                institution: edu.institute || '',
                degree: edu.degree || '',
                fieldOfStudy: edu.board_university || '',
                startDate: edu.year ? edu.year.split('-')[0] : '',
                endDate: edu.year ? edu.year.split('-')[1] || '' : '',
                current: edu.year?.includes('Present') || false,
                description: edu.score ? `Score: ${edu.score}` : ''
            }));
        }

        // Update skills
        if (parsedData.skills && typeof parsedData.skills === 'object') {
            const allSkills = [];
            Object.entries(parsedData.skills).forEach(([category, skills]) => {
                if (Array.isArray(skills)) {
                    allSkills.push(...skills);
                }
            });
            newInput.skills = [...new Set(allSkills)];
        }

        // Update experience
        if (parsedData.experience && Array.isArray(parsedData.experience)) {
            newInput.experience = parsedData.experience.map(exp => ({
                company: exp.company || '',
                position: exp.title || '',
                startDate: exp.duration ? exp.duration.split('-')[0].trim() : '',
                endDate: exp.duration ? exp.duration.split('-')[1]?.trim() || '' : '',
                current: exp.duration?.includes('Present') || false,
                description: exp.achievements ? exp.achievements.join('\n') : ''
            }));
        }

        // Update achievements
        if (parsedData.achievements && Array.isArray(parsedData.achievements)) {
            // Add achievements to bio or create a new section
            const achievementsText = parsedData.achievements.join('\n');
            newInput.bio = newInput.bio ? `${newInput.bio}\n\nAchievements:\n${achievementsText}` : `Achievements:\n${achievementsText}`;
        }

        // Update positions of responsibility
        if (parsedData.positions_of_responsibility && Array.isArray(parsedData.positions_of_responsibility)) {
            const positionsText = parsedData.positions_of_responsibility.join('\n');
            newInput.bio = newInput.bio ? `${newInput.bio}\n\nPositions of Responsibility:\n${positionsText}` : `Positions of Responsibility:\n${positionsText}`;
        }

        // Update projects
        if (parsedData.projects && Array.isArray(parsedData.projects)) {
            const projectsText = parsedData.projects.map(project => {
                let projectText = `Project: ${project.name || 'N/A'}\n`;
                if (project.technologies) {
                    projectText += `Technologies: ${project.technologies.join(', ')}\n`;
                }
                if (project.achievements) {
                    projectText += `Achievements:\n${project.achievements.join('\n')}\n`;
                }
                return projectText;
            }).join('\n');
            newInput.bio = newInput.bio ? `${newInput.bio}\n\nProjects:\n${projectsText}` : `Projects:\n${projectsText}`;
        }

        setInput(newInput);
    };

    const handleLocationChange = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            location: { ...prev.location, [name]: value }
        }));
    };

    const handleSocialLinksChange = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            socialLinks: { ...prev.socialLinks, [name]: value }
        }));
    };

    const handleExpectedSalaryChange = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            expectedSalary: { ...prev.expectedSalary, [name]: value }
        }));
    };

    const handleEducationChange = (index, field, value) => {
        const newEducation = [...input.education];
        newEducation[index] = { ...newEducation[index], [field]: value };
        setInput(prev => ({ ...prev, education: newEducation }));
    };

    const addEducation = () => {
        setInput(prev => ({
            ...prev,
            education: [...prev.education, {
                institution: '',
                degree: '',
                fieldOfStudy: '',
                startDate: '',
                endDate: '',
                current: false,
                description: ''
            }]
        }));
    };

    const removeEducation = (index) => {
        setInput(prev => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index)
        }));
    };

    const handleExperienceChange = (index, field, value) => {
        const newExperience = [...input.experience];
        newExperience[index] = { ...newExperience[index], [field]: value };
        setInput(prev => ({ ...prev, experience: newExperience }));
    };

    const addExperience = () => {
        setInput(prev => ({
            ...prev,
            experience: [...prev.experience, {
                company: '',
                position: '',
                startDate: '',
                endDate: '',
                current: false,
                description: ''
            }]
        }));
    };

    const removeExperience = (index) => {
        setInput(prev => ({
            ...prev,
            experience: prev.experience.filter((_, i) => i !== index)
        }));
    };

    const handleLanguageChange = (index, field, value) => {
        const newLanguages = [...input.languages];
        newLanguages[index] = { ...newLanguages[index], [field]: value };
        setInput(prev => ({ ...prev, languages: newLanguages }));
    };

    const addLanguage = () => {
        setInput(prev => ({
            ...prev,
            languages: [...prev.languages, { language: '', proficiency: 'Beginner' }]
        }));
    };

    const removeLanguage = (index) => {
        setInput(prev => ({
            ...prev,
            languages: prev.languages.filter((_, i) => i !== index)
        }));
    };

    const handleCertificationChange = (index, field, value) => {
        const newCertifications = [...input.certifications];
        newCertifications[index] = { ...newCertifications[index], [field]: value };
        setInput(prev => ({ ...prev, certifications: newCertifications }));
    };

    const addCertification = () => {
        setInput(prev => ({
            ...prev,
            certifications: [...prev.certifications, {
                name: '',
                issuer: '',
                date: '',
                expiryDate: '',
                credentialId: '',
                credentialUrl: ''
            }]
        }));
    };

    const removeCertification = (index) => {
        setInput(prev => ({
            ...prev,
            certifications: prev.certifications.filter((_, i) => i !== index)
        }));
    };

    const handleInterestsChange = (e) => {
        const interestsString = e.target.value;
        const interestsArray = interestsString
            .split(',')
            .map((interest) => interest.trim())
            .filter((interest) => interest !== '');
        setInput(prev => ({ ...prev, interests: interestsArray }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate required fields
            if (!input.fullName || !input.email) {
                toast.error('Name and email are required fields');
                setLoading(false);
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.email)) {
                toast.error('Please enter a valid email address');
                setLoading(false);
                return;
            }

            // Validate phone number if provided
            if (input.phoneNumber) {
                const phoneRegex = /^\+?[\d\s-]{10,}$/;
                if (!phoneRegex.test(input.phoneNumber)) {
                    toast.error('Please enter a valid phone number');
                    setLoading(false);
                    return;
                }
            }

            const formData = new FormData();
            formData.append('fullName', input.fullName);
            formData.append('email', input.email);
            formData.append('phoneNumber', input.phoneNumber);
            formData.append('bio', input.bio);
            formData.append('skills', input.skills.join(','));
            formData.append('location', JSON.stringify(input.location));
            formData.append('education', JSON.stringify(input.education));
            formData.append('experience', JSON.stringify(input.experience));
            formData.append('languages', JSON.stringify(input.languages));
            formData.append('certifications', JSON.stringify(input.certifications));
            formData.append('socialLinks', JSON.stringify(input.socialLinks));
            formData.append('interests', JSON.stringify(input.interests));
            formData.append('preferredJobTypes', JSON.stringify(input.preferredJobTypes));
            formData.append('expectedSalary', JSON.stringify(input.expectedSalary));

            if (input.resume) {
                // Validate file size (max 5MB)
                if (input.resume.size > 5 * 1024 * 1024) {
                    toast.error('Resume file size should be less than 5MB');
                    setLoading(false);
                    return;
                }
                formData.append('resume', input.resume);
            }

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
                setOpen(false);
            } else {
                toast.error(response.data.message || 'Failed to update profile.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Something went wrong while updating the profile.';
            toast.error(errorMessage);
            
            // Handle specific error cases
            if (error.response?.status === 400) {
                toast.error('Please check your input data and try again.');
            } else if (error.response?.status === 401) {
                toast.error('Your session has expired. Please log in again.');
                // Optionally redirect to login page
            } else if (error.response?.status === 413) {
                toast.error('File size too large. Please upload a smaller file.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-2xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl shadow-lg transition-all ease-in-out transform duration-300 max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Update Your Profile</DialogTitle>
                    <DialogDescription className="text-lg text-gray-600 dark:text-gray-400">
                        Update your profile information below. Click "Save" when you're done.
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                        <TabsTrigger value="basic" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400">Basic Info</TabsTrigger>
                        <TabsTrigger value="education" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400">Education</TabsTrigger>
                        <TabsTrigger value="experience" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400">Experience</TabsTrigger>
                        <TabsTrigger value="skills" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400">Skills & Languages</TabsTrigger>
                        <TabsTrigger value="certifications" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400">Certifications</TabsTrigger>
                        <TabsTrigger value="preferences" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400">Preferences</TabsTrigger>
                    </TabsList>

                    <form onSubmit={handleFormSubmit} className="space-y-6 p-4">
                        <TabsContent value="basic" className="space-y-4">
                            <div>
                                <Label htmlFor="resume" className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <FileText className="w-5 h-5" /> Upload Resume
                                </Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Input
                                        id="resume"
                                        name="resume"
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                                    />
                                    {input.resume && (
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                            {input.resume.name}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Upload your resume to automatically update your profile information.
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="fullName">Name</Label>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    value={input.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={input.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div>
                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={input.phoneNumber}
                                    onChange={handleInputChange}
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            <div>
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    name="bio"
                                    value={input.bio}
                                    onChange={handleInputChange}
                                    placeholder="Tell us about yourself"
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div>
                                <Label htmlFor="skills">Skills</Label>
                                <Input
                                    id="skills"
                                    name="skills"
                                    value={input.skills.join(', ')}
                                    onChange={handleSkillsChange}
                                    placeholder="Enter your skills (comma-separated)"
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="education" className="space-y-4">
                            <div className="space-y-4">
                                {input.education.map((edu, index) => (
                                    <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Education #{index + 1}</h3>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => removeEducation(index)}
                                                className="bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/50 dark:hover:bg-red-900 dark:text-red-400"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="text-gray-700 dark:text-gray-300">Institution</Label>
                                                <Input
                                                    value={edu.institution}
                                                    onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                                                    placeholder="Enter institution name"
                                                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-gray-700 dark:text-gray-300">Degree</Label>
                                                <Input
                                                    value={edu.degree}
                                                    onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                                    placeholder="Enter degree"
                                                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-gray-700 dark:text-gray-300">Field of Study</Label>
                                                <Input
                                                    value={edu.fieldOfStudy}
                                                    onChange={(e) => handleEducationChange(index, 'fieldOfStudy', e.target.value)}
                                                    placeholder="Enter field of study"
                                                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-gray-700 dark:text-gray-300">Start Date</Label>
                                                <Input
                                                    type="date"
                                                    value={edu.startDate}
                                                    onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                                                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-gray-700 dark:text-gray-300">End Date</Label>
                                                <Input
                                                    type="date"
                                                    value={edu.endDate}
                                                    onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                                                    disabled={edu.current}
                                                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                                                />
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={edu.current}
                                                    onChange={(e) => handleEducationChange(index, 'current', e.target.checked)}
                                                    className="rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                                                />
                                                <Label className="text-gray-700 dark:text-gray-300">Currently Studying</Label>
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-gray-700 dark:text-gray-300">Description</Label>
                                            <Textarea
                                                value={edu.description}
                                                onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                                                placeholder="Enter description"
                                                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                                            />
                                        </div>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    onClick={addEducation}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Education
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="experience" className="space-y-4">
                            <div className="space-y-4">
                                {input.experience.map((exp, index) => (
                                    <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Experience #{index + 1}</h3>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => removeExperience(index)}
                                                className="bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/50 dark:hover:bg-red-900 dark:text-red-400"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="text-gray-700 dark:text-gray-300">Company</Label>
                                                <Input
                                                    value={exp.company}
                                                    onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                                    placeholder="Enter company name"
                                                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-gray-700 dark:text-gray-300">Position</Label>
                                                <Input
                                                    value={exp.position}
                                                    onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                                                    placeholder="Enter position"
                                                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-gray-700 dark:text-gray-300">Start Date</Label>
                                                <Input
                                                    type="date"
                                                    value={exp.startDate}
                                                    onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                                                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-gray-700 dark:text-gray-300">End Date</Label>
                                                <Input
                                                    type="date"
                                                    value={exp.endDate}
                                                    onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                                                    disabled={exp.current}
                                                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                                                />
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={exp.current}
                                                    onChange={(e) => handleExperienceChange(index, 'current', e.target.checked)}
                                                    className="rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                                                />
                                                <Label className="text-gray-700 dark:text-gray-300">Currently Working</Label>
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-gray-700 dark:text-gray-300">Description</Label>
                                            <Textarea
                                                value={exp.description}
                                                onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                                                placeholder="Enter description"
                                                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                                            />
                                        </div>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    onClick={addExperience}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Experience
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="skills" className="space-y-4">
                            <div>
                                <Label htmlFor="skills" className="text-gray-700 dark:text-gray-300">Skills</Label>
                                <Input
                                    id="skills"
                                    name="skills"
                                    value={input.skills.join(', ')}
                                    onChange={handleSkillsChange}
                                    placeholder="Enter your skills (comma-separated)"
                                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                                />
                            </div>
                            <div className="space-y-4">
                                {input.languages.map((lang, index) => (
                                    <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Language #{index + 1}</h3>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => removeLanguage(index)}
                                                className="bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/50 dark:hover:bg-red-900 dark:text-red-400"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="text-gray-700 dark:text-gray-300">Language</Label>
                                                <Input
                                                    value={lang.language}
                                                    onChange={(e) => handleLanguageChange(index, 'language', e.target.value)}
                                                    placeholder="Enter language"
                                                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-gray-700 dark:text-gray-300">Proficiency</Label>
                                                <Select
                                                    value={lang.proficiency}
                                                    onValueChange={(value) => handleLanguageChange(index, 'proficiency', value)}
                                                >
                                                    <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400">
                                                        <SelectValue placeholder="Select proficiency" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                                        <SelectItem value="Beginner" className="text-gray-900 dark:text-gray-100">Beginner</SelectItem>
                                                        <SelectItem value="Intermediate" className="text-gray-900 dark:text-gray-100">Intermediate</SelectItem>
                                                        <SelectItem value="Advanced" className="text-gray-900 dark:text-gray-100">Advanced</SelectItem>
                                                        <SelectItem value="Native" className="text-gray-900 dark:text-gray-100">Native</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    onClick={addLanguage}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Language
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="certifications" className="space-y-4">
                            <div className="space-y-4">
                                {input.certifications.map((cert, index) => (
                                    <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Certification #{index + 1}</h3>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => removeCertification(index)}
                                                className="bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/50 dark:hover:bg-red-900 dark:text-red-400"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="text-gray-700 dark:text-gray-300">Name</Label>
                                                <Input
                                                    value={cert.name}
                                                    onChange={(e) => handleCertificationChange(index, 'name', e.target.value)}
                                                    placeholder="Enter certification name"
                                                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-gray-700 dark:text-gray-300">Issuer</Label>
                                                <Input
                                                    value={cert.issuer}
                                                    onChange={(e) => handleCertificationChange(index, 'issuer', e.target.value)}
                                                    placeholder="Enter issuer name"
                                                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-gray-700 dark:text-gray-300">Date</Label>
                                                <Input
                                                    type="date"
                                                    value={cert.date}
                                                    onChange={(e) => handleCertificationChange(index, 'date', e.target.value)}
                                                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-gray-700 dark:text-gray-300">Expiry Date</Label>
                                                <Input
                                                    type="date"
                                                    value={cert.expiryDate}
                                                    onChange={(e) => handleCertificationChange(index, 'expiryDate', e.target.value)}
                                                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-gray-700 dark:text-gray-300">Credential ID</Label>
                                                <Input
                                                    value={cert.credentialId}
                                                    onChange={(e) => handleCertificationChange(index, 'credentialId', e.target.value)}
                                                    placeholder="Enter credential ID"
                                                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-gray-700 dark:text-gray-300">Credential URL</Label>
                                                <Input
                                                    value={cert.credentialUrl}
                                                    onChange={(e) => handleCertificationChange(index, 'credentialUrl', e.target.value)}
                                                    placeholder="Enter credential URL"
                                                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    onClick={addCertification}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Certification
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="preferences" className="space-y-4">
                            <div>
                                <Label htmlFor="interests" className="text-gray-700 dark:text-gray-300">Interests</Label>
                                <Input
                                    id="interests"
                                    name="interests"
                                    value={input.interests.join(', ')}
                                    onChange={handleInterestsChange}
                                    placeholder="Enter your interests (comma-separated)"
                                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                                />
                            </div>
                            <div>
                                <Label htmlFor="preferredJobTypes" className="text-gray-700 dark:text-gray-300">Preferred Job Types</Label>
                                <Select
                                    value={input.preferredJobTypes.join(',')}
                                    onValueChange={(value) => {
                                        setInput(prev => ({
                                            ...prev,
                                            preferredJobTypes: value.split(',')
                                        }));
                                    }}
                                >
                                    <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400">
                                        <SelectValue placeholder="Select job types" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                        <SelectItem value="Full-time" className="text-gray-900 dark:text-gray-100">Full-time</SelectItem>
                                        <SelectItem value="Part-time" className="text-gray-900 dark:text-gray-100">Part-time</SelectItem>
                                        <SelectItem value="Contract" className="text-gray-900 dark:text-gray-100">Contract</SelectItem>
                                        <SelectItem value="Internship" className="text-gray-900 dark:text-gray-100">Internship</SelectItem>
                                        <SelectItem value="Remote" className="text-gray-900 dark:text-gray-100">Remote</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="expectedSalary" className="text-gray-700 dark:text-gray-300">Expected Salary</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="amount"
                                        name="amount"
                                        type="number"
                                        value={input.expectedSalary.amount}
                                        onChange={handleExpectedSalaryChange}
                                        placeholder="Enter amount"
                                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                                    />
                                    <Select
                                        value={input.expectedSalary.currency}
                                        onValueChange={(value) => {
                                            setInput(prev => ({
                                                ...prev,
                                                expectedSalary: { ...prev.expectedSalary, currency: value }
                                            }));
                                        }}
                                    >
                                        <SelectTrigger className="w-[100px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400">
                                            <SelectValue placeholder="Currency" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                            <SelectItem value="USD" className="text-gray-900 dark:text-gray-100">USD</SelectItem>
                                            <SelectItem value="EUR" className="text-gray-900 dark:text-gray-100">EUR</SelectItem>
                                            <SelectItem value="GBP" className="text-gray-900 dark:text-gray-100">GBP</SelectItem>
                                            <SelectItem value="INR" className="text-gray-900 dark:text-gray-100">INR</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </TabsContent>

                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white"
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateProfileDialog;
