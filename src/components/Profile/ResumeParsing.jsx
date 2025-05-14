import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, FileText } from "lucide-react";
import { toast } from "sonner";
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import { setUser } from "@/redux/authSlice";

const HRFLOW_API_KEY = 'askw_c4ba0f746c87df04482946d072169c1b';
const API_END_POINT = import.meta.env.VITE_API_END_POINT;

const ResumeParsing = () => {
    const [file, setFile] = useState(null);
    const [isParsing, setIsParsing] = useState(false);
    const [parsedData, setParsedData] = useState(null);
    const dispatch = useDispatch();

    const onDrop = useCallback((acceptedFiles) => {
        const selectedFile = acceptedFiles[0];
        if (selectedFile) {
            if (selectedFile.type === 'application/pdf' || 
                selectedFile.type === 'application/msword' || 
                selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                setFile(selectedFile);
            } else {
                toast.error('Please upload a PDF or Word document');
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        maxSize: 5 * 1024 * 1024, // 5MB
        multiple: false
    });

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type === 'application/pdf' || 
                selectedFile.type === 'application/msword' || 
                selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                setFile(selectedFile);
            } else {
                toast.error('Please upload a PDF or Word document');
            }
        }
    };

    const updateProfileWithParsedData = async (parsedData) => {
        try {
            const profileData = {
                fullName: parsedData.name,
                email: parsedData.email,
                phoneNumber: parsedData.phone,
                profile: {
                    skills: parsedData.skills || [],
                    experience: parsedData.experience?.map(exp => ({
                        position: exp.title,
                        company: exp.company,
                        startDate: exp.startDate,
                        endDate: exp.endDate || null,
                        current: !exp.endDate,
                        description: exp.description || ''
                    })) || [],
                    education: parsedData.education?.map(edu => ({
                        institution: edu.school,
                        degree: edu.degree,
                        fieldOfStudy: edu.fieldOfStudy,
                        startDate: edu.startDate,
                        endDate: edu.endDate || null,
                        current: !edu.endDate,
                        description: edu.description || ''
                    })) || []
                }
            };

            const response = await axios.patch(
                `${API_END_POINT}/user/update-profile`,
                profileData,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                }
            );

            if (response.data.success) {
                dispatch(setUser(response.data.data));
                toast.success('Profile updated successfully with resume data!');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile with resume data');
        }
    };

    const parseResume = async () => {
        if (!file) {
            toast.error('Please select a resume file first');
            return;
        }

        setIsParsing(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post(
                'https://api.hrflow.ai/v1/document/parsing',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${HRFLOW_API_KEY}`,
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );

            if (response.data) {
                const parsedData = response.data;
                setParsedData(parsedData);
                await updateProfileWithParsedData(parsedData);
                toast.success('Resume parsed and profile updated successfully!');
            }
        } catch (error) {
            console.error('Error parsing resume:', error);
            toast.error(error.response?.data?.message || 'Error parsing resume');
        } finally {
            setIsParsing(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Resume Parsing</CardTitle>
                <CardDescription>
                    Upload your resume to automatically extract and update your profile information
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
                    >
                        <input {...getInputProps()} />
                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        {isDragActive ? (
                            <p className="text-blue-500">Drop your resume here...</p>
                        ) : (
                            <div>
                                <p className="text-gray-600">Drag and drop your resume here, or click to select</p>
                                <p className="text-sm text-gray-500 mt-2">Supports PDF, DOC, DOCX (max 5MB)</p>
                            </div>
                        )}
                    </div>

                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="resume">Or select file manually</Label>
                        <Input
                            id="resume"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="cursor-pointer"
                        />
                    </div>

                    {file && (
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Selected file: {file.name}
                            </p>
                        </div>
                    )}

                    <Button
                        onClick={parseResume}
                        disabled={!file || isParsing}
                        className="w-full"
                    >
                        {isParsing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Parsing Resume...
                            </>
                        ) : (
                            <>
                                <Upload className="mr-2 h-4 w-4" />
                                Parse Resume & Update Profile
                            </>
                        )}
                    </Button>

                    {parsedData && (
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <h3 className="font-semibold mb-2">Parsed Information:</h3>
                            <div className="space-y-2">
                                {parsedData.name && (
                                    <p><strong>Name:</strong> {parsedData.name}</p>
                                )}
                                {parsedData.email && (
                                    <p><strong>Email:</strong> {parsedData.email}</p>
                                )}
                                {parsedData.phone && (
                                    <p><strong>Phone:</strong> {parsedData.phone}</p>
                                )}
                                {parsedData.skills && parsedData.skills.length > 0 && (
                                    <p><strong>Skills:</strong> {parsedData.skills.join(', ')}</p>
                                )}
                                {parsedData.experience && parsedData.experience.length > 0 && (
                                    <div>
                                        <strong>Experience:</strong>
                                        <ul className="list-disc list-inside">
                                            {parsedData.experience.map((exp, index) => (
                                                <li key={index}>
                                                    {exp.title} at {exp.company} ({exp.startDate} - {exp.endDate || 'Present'})
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default ResumeParsing;
