import React from "react";
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
import { useNavigate } from "react-router-dom";
import { setLoading } from "@/redux/authSlice";
import Loader from "../ui/Loader";
import Header from "../shared/Header";
import Footer from "../shared/Footer";
import { useTheme } from '@/context/ThemeContext';

// Zod Schema for Validation
const jobPostSchema = z.object({
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

const JobPost = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(jobPostSchema),
  });
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { allCompanies } = useSelector((state) => state.company);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${API_END_POINT}/job/post`, data, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
        },
      });
      if (response.data.success) {
        toast.success('Job posted successfully');
        navigate(`/admin/jobs`);
      } else {
        toast.error(`Failed to post Job: ${response.data.message}`);
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
    if (selectedCompany) {
      setValue("companyId", selectedCompany?._id, { shouldValidate: true });
      setValue("companyName", selectedCompany?.companyName, { shouldValidate: true });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header/>
      <div className="max-w-4xl mx-auto p-8 my-10 bg-background rounded-lg border border-gray-200 dark:border-gray-800 shadow-lg">
        <h1 className="text-3xl font-semibold text-foreground mb-4 text-center">
          Create a Job Post
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Job Title</label>
              <Input
                type="text"
                {...register("title")}
                placeholder="e.g., Web Developer"
                className="w-full bg-background text-foreground border-gray-300 dark:border-gray-700"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Requirements */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Requirements</label>
              <Input
                type="text"
                {...register("requirements")}
                placeholder="e.g., React, Node.js, PHP"
                className="w-full bg-background text-foreground border-gray-300 dark:border-gray-700"
              />
              {errors.requirements && (
                <p className="text-red-500 text-sm mt-1">{errors.requirements.message}</p>
              )}
            </div>

            {/* Salary */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Salary</label>
              <Input
                type="number"
                {...register("salary", { valueAsNumber: true })}
                placeholder="e.g., 85000"
                className="w-full bg-background text-foreground border-gray-300 dark:border-gray-700"
              />
              {errors.salary && (
                <p className="text-red-500 text-sm mt-1">{errors.salary.message}</p>
              )}
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Experience (years)</label>
              <Input
                type="number"
                {...register("experience", { valueAsNumber: true })}
                placeholder="e.g., 3"
                className="w-full bg-background text-foreground border-gray-300 dark:border-gray-700"
              />
              {errors.experience && (
                <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Location</label>
              <Input
                type="text"
                {...register("location")}
                placeholder="e.g., Singapore"
                className="w-full bg-background text-foreground border-gray-300 dark:border-gray-700"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
              )}
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Open Positions</label>
              <Input
                type="number"
                {...register("position", { valueAsNumber: true })}
                placeholder="e.g., 9"
                className="w-full bg-background text-foreground border-gray-300 dark:border-gray-700"
              />
              {errors.position && (
                <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>
              )}
            </div>

            {/* Company Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Company</label>
              {allCompanies.length > 0 ? (
                <Select onValueChange={selectChangeHandler}>
                  <SelectTrigger className="w-full bg-background text-foreground border-gray-300 dark:border-gray-700">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-gray-300 dark:border-gray-700">
                    {allCompanies.map((company) => (
                      <SelectItem
                        key={company.companyId}
                        value={company.companyName.toLowerCase()}
                        className="text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        {company.companyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No companies available. Please add a company first.
                </p>
              )}
              {errors.companyId && (
                <p className="text-red-500 text-sm mt-1">{errors.companyId.message}</p>
              )}
            </div>

            {/* Job Type */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Job Type</label>
              <Select
                onValueChange={(value) => setValue("jobType", value, { shouldValidate: true })}
              >
                <SelectTrigger className="w-full bg-background text-foreground border-gray-300 dark:border-gray-700">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent className="bg-background border-gray-300 dark:border-gray-700">
                  <SelectItem value="Full-time" className="text-foreground hover:bg-gray-100 dark:hover:bg-gray-800">Full-time</SelectItem>
                  <SelectItem value="Part-time" className="text-foreground hover:bg-gray-100 dark:hover:bg-gray-800">Part-time</SelectItem>
                  <SelectItem value="Contract" className="text-foreground hover:bg-gray-100 dark:hover:bg-gray-800">Contract</SelectItem>
                  <SelectItem value="Freelance" className="text-foreground hover:bg-gray-100 dark:hover:bg-gray-800">Freelance</SelectItem>
                </SelectContent>
              </Select>
              {errors.jobType && (
                <p className="text-red-500 text-sm mt-1">{errors.jobType.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">Job Description</label>
            <Textarea
              {...register("description")}
              placeholder="Describe the job role and responsibilities..."
              className="w-full bg-background text-foreground border-gray-300 dark:border-gray-700"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-foreground rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => navigate('/admin/jobs')}
            >
              Back
            </Button>
            <Button
              type="submit"
              className={`${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'} px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800`}
            >
              {isSubmitting ? "Posting job..." : "Post job"}
            </Button>
          </div>
        </form>
        {isSubmitting && <Loader message="Posting job..." />}
      </div>
      <Footer/>
    </div>
  );
};

export default JobPost;