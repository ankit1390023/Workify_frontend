import React from "react";
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
import { useNavigate } from "react-router-dom";
import { setLoading } from "@/redux/authSlice";
import { Loader, Briefcase } from "lucide-react";
import Header from "../shared/Header";
import Footer from "../shared/Footer";
import { useTheme } from '@/context/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  Create New Job Post
                </CardTitle>
                <p className="text-muted-foreground">
                  Fill in the details below to create a new job posting
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

                {/* Company */}
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-foreground">Company</Label>
                  <Input
                    id="company"
                    type="text"
                    {...register("companyName")}
                    placeholder="Enter company name"
                    className="bg-background"
                  />
                  {errors.companyName && (
                    <p className="text-sm text-destructive">{errors.companyName.message}</p>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-foreground">Location</Label>
                  <Input
                    id="location"
                    type="text"
                    {...register("location")}
                    placeholder="Enter location"
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

                {/* Company Selection */}
                <div className="space-y-2">
                  <Label htmlFor="companyId" className="text-foreground">Select Company</Label>
                  {allCompanies.length > 0 ? (
                    <Select onValueChange={selectChangeHandler}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select a company" />
                      </SelectTrigger>
                      <SelectContent>
                        {allCompanies.map((company) => (
                          <SelectItem
                            key={company._id}
                            value={company.companyName.toLowerCase()}
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
                  placeholder="Enter job requirements"
                  className="bg-background min-h-[150px]"
                />
                {errors.requirements && (
                  <p className="text-sm text-destructive">{errors.requirements.message}</p>
                )}
              </div>

              {/* Submit Button */}
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
                      Posting...
                    </>
                  ) : (
                    <>
                      <Briefcase className="h-4 w-4" />
                      Post Job
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

export default JobPost;