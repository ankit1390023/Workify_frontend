import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useDispatch, useSelector } from "react-redux";
const API_END_POINT = import.meta.env.VITE_API_END_POINT;
import { toast } from "sonner";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Loader, Briefcase } from "lucide-react";
import useGetSingleJobs from "../hooks/useGetSingleJob";
import Header from "../shared/Header";
import Footer from "../shared/Footer";
import { useTheme } from '@/context/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";

// Zod Schema for Validation
const jobUpdateSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    requirements: z.string().min(5, "Requirements must be at least 5 characters long"),
    salary: z.number().positive("Salary must be a positive number"),
    experience: z.number().min(0, "Experience cannot be negative"),
    location: z.string().min(2, "Location must be valid"),
    jobType: z.enum(["Full-time", "Part-time", "Contract", "Freelance"], "Job type is required"),
    position: z.number().min(1, "Position must be at least 1"),
    companyId: z.string().nonempty("Company must be selected"),
});

const JobDetailsUpdate = () => {
    const params = useParams();
    const jobId = params.id;
    const { isLoading } = useGetSingleJobs(jobId);
    const singleJob = useSelector(state => state.job.singleJob); // Updated to access from job slice
    const { allCompanies } = useSelector((state) => state.company);
    const { theme } = useTheme();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(jobUpdateSchema),
    });

    // Set form default values once job data is fetched
    useEffect(() => {
        if (singleJob && Object.keys(singleJob).length > 0) {
            console.log("Setting form values with job data:", singleJob);
            setValue('title', singleJob.title || '');
            setValue('requirements', Array.isArray(singleJob.requirements) 
                ? singleJob.requirements.join(', ') 
                : singleJob.requirements || '');
            setValue('salary', singleJob.salary || '');
            setValue('description', singleJob.description || '');
            setValue('experience', singleJob.experience || '');
            setValue('location', Array.isArray(singleJob.location)
                ? singleJob.location.join(', ')
                : singleJob.location || '');
            setValue('jobType', singleJob.jobType || '');
            setValue('position', singleJob.position || '');
            setValue('companyId', singleJob.company?._id || '');
        }
    }, [singleJob, setValue]);

    const onSubmit = async (data) => {
        try {
            // Format the data to match backend expectations exactly
            const formattedData = {
                title: data.title,
                description: data.description,
                requirements: Array.isArray(data.requirements) 
                    ? data.requirements.join(',') 
                    : data.requirements,
                salary: Number(data.salary),
                location: Array.isArray(data.location)
                    ? data.location.join(',')
                    : data.location,
                jobType: data.jobType,
                experience: Number(data.experience),
                position: Number(data.position),
                companyId: data.companyId
            };

            console.log('Sending update data:', formattedData); // Debug log

            const response = await axios.put(`${API_END_POINT}/job/update/${jobId}`, formattedData, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                },
            });
            console.log("response from update job", response);

            if (response.data.success) {
                toast.success('Job updated successfully');
                navigate(`/admin/jobs`);
            } else {
                toast.error(`Failed to update job: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Update error:', error.response?.data || error); // Debug log
            const errorMessage = error.response?.data?.message || error.message || "An error occurred during job update";
            toast.error(errorMessage);
        }
    };

    const selectChangeHandler = (value) => {
        const selectedCompany = allCompanies.find(
            (company) => company._id === value
        );
        if (selectedCompany) {
            setValue("companyId", selectedCompany._id, { shouldValidate: true });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">Loading job details...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header/>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card className="border-border">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Briefcase className="w-8 h-8 text-primary" />
                            <div>
                                <CardTitle className="text-2xl font-bold text-foreground">
                                    Update Job Details
                                </CardTitle>
                                <p className="text-muted-foreground">
                                    Update the job information below
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-foreground">Job Title</Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        {...register("title")}
                                        placeholder="Enter job title"
                                        className="bg-background"
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-destructive">{errors.title.message}</p>
                                    )}
                                </div>

                                {/* Company Selection */}
                                <div className="space-y-2">
                                    <Label htmlFor="companyId" className="text-foreground">Select Company</Label>
                                    {allCompanies.length > 0 ? (
                                        <Select onValueChange={selectChangeHandler} defaultValue={singleJob?.company?._id}>
                                            <SelectTrigger className="bg-background">
                                                <SelectValue placeholder="Select a company" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {allCompanies.map((company) => (
                                                    <SelectItem
                                                        key={company._id}
                                                        value={company._id}
                                                    >
                                                        {company.companyName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            No companies available. Please add a company first.
                                        </p>
                                    )}
                                    {errors.companyId && (
                                        <p className="text-sm text-destructive">{errors.companyId.message}</p>
                                    )}
                                </div>

                                {/* Location */}
                                <div className="space-y-2">
                                    <Label htmlFor="location" className="text-foreground">Location</Label>
                                    <Input
                                        id="location"
                                        type="text"
                                        {...register("location")}
                                        placeholder="Enter locations (comma-separated)"
                                        className="bg-background"
                                    />
                                    {errors.location && (
                                        <p className="text-sm text-destructive">{errors.location.message}</p>
                                    )}
                                </div>

                                {/* Salary */}
                                <div className="space-y-2">
                                    <Label htmlFor="salary" className="text-foreground">Salary</Label>
                                    <Input
                                        id="salary"
                                        type="number"
                                        {...register("salary", { valueAsNumber: true })}
                                        placeholder="Enter salary"
                                        className="bg-background"
                                    />
                                    {errors.salary && (
                                        <p className="text-sm text-destructive">{errors.salary.message}</p>
                                    )}
                                </div>

                                {/* Experience */}
                                <div className="space-y-2">
                                    <Label htmlFor="experience" className="text-foreground">Experience (years)</Label>
                                    <Input
                                        id="experience"
                                        type="number"
                                        {...register("experience", { valueAsNumber: true })}
                                        placeholder="Enter years of experience"
                                        className="bg-background"
                                    />
                                    {errors.experience && (
                                        <p className="text-sm text-destructive">{errors.experience.message}</p>
                                    )}
                                </div>

                                {/* Position */}
                                <div className="space-y-2">
                                    <Label htmlFor="position" className="text-foreground">Open Positions</Label>
                                    <Input
                                        id="position"
                                        type="number"
                                        {...register("position", { valueAsNumber: true })}
                                        placeholder="Enter number of positions"
                                        className="bg-background"
                                    />
                                    {errors.position && (
                                        <p className="text-sm text-destructive">{errors.position.message}</p>
                                    )}
                                </div>

                                {/* Job Type */}
                                <div className="space-y-2">
                                    <Label htmlFor="jobType" className="text-foreground">Job Type</Label>
                                    <Select
                                        onValueChange={(value) => setValue("jobType", value, { shouldValidate: true })}
                                        defaultValue={singleJob?.jobType}
                                    >
                                        <SelectTrigger className="bg-background">
                                            <SelectValue placeholder="Select job type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Full-time">Full-time</SelectItem>
                                            <SelectItem value="Part-time">Part-time</SelectItem>
                                            <SelectItem value="Contract">Contract</SelectItem>
                                            <SelectItem value="Freelance">Freelance</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.jobType && (
                                        <p className="text-sm text-destructive">{errors.jobType.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-foreground">Job Description</Label>
                                <Textarea
                                    id="description"
                                    {...register("description")}
                                    placeholder="Enter job description"
                                    className="bg-background min-h-[150px]"
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">{errors.description.message}</p>
                                )}
                            </div>

                            {/* Requirements */}
                            <div className="space-y-2">
                                <Label htmlFor="requirements" className="text-foreground">Requirements</Label>
                                <Textarea
                                    id="requirements"
                                    {...register("requirements")}
                                    placeholder="Enter requirements (comma-separated)"
                                    className="bg-background min-h-[150px]"
                                />
                                {errors.requirements && (
                                    <p className="text-sm text-destructive">{errors.requirements.message}</p>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/admin/jobs')}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="gap-2"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader className="h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Briefcase className="h-4 w-4" />
                                            Update Job
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
            <Footer/>
        </div>
    );
};

export default JobDetailsUpdate;