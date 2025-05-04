import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useDispatch, useSelector } from "react-redux";
import { API_END_POINT } from '@/utils/constant';
import { toast } from "sonner";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../ui/Loader";
import useGetSingleJobs from "../hooks/useGetSingleJob";
import Header from "../shared/Header";
import Footer from "../shared/Footer";
import { useTheme } from '@/context/ThemeContext';

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
    companyName: z.string().nonempty("Company must be selected"),
    companyId: z.string().nonempty("Company must be selected"),
});

const JobDetailsUpdate = () => {
    const params = useParams();
    const jobId = params.id;
    console.log("jobId: " + jobId);
    useGetSingleJobs(jobId);
    const singleJob = useSelector(state => state.singleJob);
    console.log("singleJob: " + singleJob);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },

    } = useForm({
        resolver: zodResolver(jobUpdateSchema),
    });
    const navigate = useNavigate();
    const { allCompanies } = useSelector((state) => state.company);
    const { theme } = useTheme();

// Set form default values once company data is fetched
  useEffect(() => {
    if (singleJob) {
        setValue('title', singleJob?.companyName || '');
        setValue('requirements', singleJob?.requirements || '');
        setValue('salary', singleJob?.salary || '');
        setValue('description', singleJob?.description || '');
        setValue('experience', singleJob?.experience || '');
        setValue('location', singleJob?.location || '');
        setValue('jobType', singleJob?.jobType || '');
        setValue('position', singleJob?.position || '');
        setValue('companyName', singleJob?.companyName || '');
    }
  }, [singleJob, setValue]);

    const onSubmit = async (data) => {
        // console.log("Form submitted:", data);
        try {

            const response = await axios.post(`${API_END_POINT}/job/post`, data, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                },
            });
            console.log("response from JOB POSTING", data);
            if (response.data.success) {
                toast.success('Job posted successfully');
                navigate(`/admin/jobs`);
            } else {
                toast.error(`Failed to post Job: ${res.data.message}`);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "An error occurred during Job posting";
            toast.error(errorMessage);
        }
    };

    const selectChangeHandler = (value) => {
        const selectedCompany = allCompanies.find(
            (company) => company.companyName.toLowerCase() === value
        );
        console.log(selectedCompany);
        if (selectedCompany) {
            setValue("companyId", selectedCompany?._id, { shouldValidate: true });
            setValue("companyName", selectedCompany?.companyName, { shouldValidate: true });
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header/>
            <div className="max-w-4xl mx-auto p-8 my-10 bg-background rounded-lg border border-gray-200 dark:border-gray-800 shadow-lg">
                <h1 className="text-3xl font-semibold text-foreground mb-4">Update Job Details</h1>
                <p className="text-muted-foreground text-sm mb-6">
                    Please update the job details below.
                </p>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Title */}
                        <div>
                            <Label htmlFor="title" className="text-foreground">Job Title</Label>
                            <Input
                                id="title"
                                type="text"
                                {...register("title")}
                                placeholder="Enter job title"
                                className="mt-1 bg-background text-foreground border-gray-300 dark:border-gray-700"
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                            )}
                        </div>

                        {/* Company */}
                        <div>
                            <Label htmlFor="company" className="text-foreground">Company</Label>
                            <Input
                                id="company"
                                type="text"
                                {...register("companyName")}
                                placeholder="Enter company name"
                                className="mt-1 bg-background text-foreground border-gray-300 dark:border-gray-700"
                            />
                            {errors.companyName && (
                                <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Location */}
                        <div>
                            <Label htmlFor="location" className="text-foreground">Location</Label>
                            <Input
                                id="location"
                                type="text"
                                {...register("location")}
                                placeholder="Enter location"
                                className="mt-1 bg-background text-foreground border-gray-300 dark:border-gray-700"
                            />
                            {errors.location && (
                                <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                            )}
                        </div>

                        {/* Salary */}
                        <div>
                            <Label htmlFor="salary" className="text-foreground">Salary</Label>
                            <Input
                                id="salary"
                                type="text"
                                {...register("salary", { valueAsNumber: true })}
                                placeholder="Enter salary"
                                className="mt-1 bg-background text-foreground border-gray-300 dark:border-gray-700"
                            />
                            {errors.salary && (
                                <p className="text-red-500 text-sm mt-1">{errors.salary.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <Label htmlFor="description" className="text-foreground">Description</Label>
                        <Textarea
                            id="description"
                            {...register("description")}
                            placeholder="Enter job description"
                            className="mt-1 bg-background text-foreground border-gray-300 dark:border-gray-700"
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Requirements */}
                    <div>
                        <Label htmlFor="requirements" className="text-foreground">Requirements</Label>
                        <Textarea
                            id="requirements"
                            {...register("requirements")}
                            placeholder="Enter job requirements"
                            className="mt-1 bg-background text-foreground border-gray-300 dark:border-gray-700"
                        />
                        {errors.requirements && (
                            <p className="text-red-500 text-sm mt-1">{errors.requirements.message}</p>
                        )}
                    </div>

                    {/* Position */}
                    <div>
                        <Label htmlFor="position" className="text-foreground">Open Positions</Label>
                        <Input
                            id="position"
                            type="number"
                            {...register("position", { valueAsNumber: true })}
                            placeholder="e.g., 9"
                            className="mt-1 bg-background text-foreground border-gray-300 dark:border-gray-700"
                        />
                        {errors.position && (
                            <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>
                        )}
                    </div>

                    {/* Company Selection */}
                    <div>
                        <Label htmlFor="companyId" className="text-foreground">Company</Label>
                        {allCompanies.length > 0 ? (
                            <Select onValueChange={selectChangeHandler}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a company" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-50">
                                    {allCompanies.map((company) => (
                                        <SelectItem
                                            key={company.companyId}
                                            value={company.companyName.toLowerCase()}
                                        >
                                            {company.companyName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <p className="text-gray-500 text-sm">
                                No companies available. Please add a company first.
                            </p>
                        )}
                        {errors.companyId && (
                            <p className="text-red-500 text-sm mt-1">{errors.companyId.message}</p>
                        )}
                    </div>

                    {/* Job Type */}
                    <div>
                        <Label htmlFor="jobType" className="text-foreground">Job Type</Label>
                        <Select
                            id="jobType"
                            onValueChange={(value) => setValue("jobType", value, { shouldValidate: true })}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select job type" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-50">
                                <SelectItem value="Full-time">Full-time</SelectItem>
                                <SelectItem value="Part-time">Part-time</SelectItem>
                                <SelectItem value="Contract">Contract</SelectItem>
                                <SelectItem value="Freelance">Freelance</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.jobType && (
                            <p className="text-red-500 text-sm mt-1">{errors.jobType.message}</p>
                        )}
                    </div>

                    {/* Experience */}
                    <div>
                        <Label htmlFor="experience" className="text-foreground">Experience (years)</Label>
                        <Input
                            id="experience"
                            type="number"
                            {...register("experience", { valueAsNumber: true })}
                            placeholder="e.g., 3"
                            className="mt-1 bg-background text-foreground border-gray-300 dark:border-gray-700"
                        />
                        {errors.experience && (
                            <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-4">
                        <Button
                            variant="outline"
                            className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-foreground rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                            onClick={() => navigate('/admin/jobs')}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className={`${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'} px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800`}
                        >
                            {isSubmitting ? "Updating..." : "Update"}
                        </Button>
                    </div>
                </form>
                {isSubmitting && <Loader message="Updating..." />}
            </div>
            <Footer/>
        </div>
    );
};

export default JobDetailsUpdate;