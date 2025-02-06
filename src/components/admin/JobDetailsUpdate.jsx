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
        <div>
            <Header/>
        <div className="p-10 max-w-5xl mx-auto bg-white rounded-lg">
            <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
                Update a Job Post
            </h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-2 gap-x-8 gap-y-6"
            >
                {/* Title */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                    <Input
                        type="text"
                        {...register("title")}
                        placeholder="e.g., Web Developer"
                        className="w-full"
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                    )}
                </div>

                {/* Requirements */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                    <Input
                        type="text"
                        {...register("requirements")}
                        placeholder="e.g., React, Node.js, PHP"
                        className="w-full"
                    />
                    {errors.requirements && (
                        <p className="text-red-500 text-sm mt-1">{errors.requirements.message}</p>
                    )}
                </div>

                {/* Salary */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
                    <Input
                        type="number"
                        {...register("salary", { valueAsNumber: true })}
                        placeholder="e.g., 85000"
                        className="w-full"
                    />
                    {errors.salary && (
                        <p className="text-red-500 text-sm mt-1">{errors.salary.message}</p>
                    )}
                </div>

                {/* Experience */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience (years)</label>
                    <Input
                        type="number"
                        {...register("experience", { valueAsNumber: true })}
                        placeholder="e.g., 3"
                        className="w-full"
                    />
                    {errors.experience && (
                        <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>
                    )}
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <Input
                        type="text"
                        {...register("location")}
                        placeholder="e.g., Singapore"
                        className="w-full"
                    />
                    {errors.location && (
                        <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                    )}
                </div>

                {/* Position */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Open Positions</label>
                    <Input
                        type="number"
                        {...register("position", { valueAsNumber: true })}
                        placeholder="e.g., 9"
                        className="w-full"
                    />
                    {errors.position && (
                        <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>
                    )}
                </div>

                {/* Company Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                    <Select
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

                {/* Description */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                    <Textarea
                        {...register("description")}
                        placeholder="Describe the job role and responsibilities..."
                        className="w-full"
                    />
                    {errors.description && (
                        <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                    )}
                </div>
                {
                    isSubmitting && (
                        <Loader message="Posting job..." />
                    )
                }

                {/* Submit Button */}
                <div className="col-span-2 flex justify-end gap-4">
                    <Button variant="outline">Back</Button>
                    <Button
                        type="submit"
                        className={`${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'} px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700`}
                    >
                        {isSubmitting ? "Updating..." : "Update"}
                    </Button>
                </div>
            </form>
            </div>
            <Footer/>
        </div>
    );
};

export default JobDetailsUpdate;