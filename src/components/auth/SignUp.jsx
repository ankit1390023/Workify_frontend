import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { API_END_POINT } from "@/utils/constant";

const formSchema = z
    .object({
        fullName: z
            .string()
            .min(1, "Full Name is required")
            .max(25, "Max length is 25 characters"),
        email: z.string().email("Invalid email address"),
        phoneNumber: z
            .string()
            .min(8, "Phone Number must be at least 8 digits")
            .max(10, "Phone Number must be no more than 10 digits"),
        password: z
            .string()
            .min(6, "Password must be at least 6 characters")
            .max(10, "Password max length is 10 characters"),
        confirmPassword: z.string(),
        role: z.enum(["student", "recruiter"], "Role is required"),
        avatar: z
            .instanceof(FileList)
            .refine((fileList) => fileList.length === 0 || fileList[0].type.startsWith("image/"), {
                message: "Only image files are allowed",
            })
            .optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

const SignUp = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(formSchema),
    });
    const navigate = useNavigate();

    
    const onSubmit = async (data) => {
        // console.log("data from signup is",data);
        try {
            const formData = new FormData();
            formData.append("fullName", data.fullName);
            formData.append("email", data.email);
            formData.append("phoneNumber", data.phoneNumber);
            formData.append("password", data.password);
            formData.append("role", data.role);

            if (data?.avatar && data?.avatar[0]) {
                formData.append("avatar", data.avatar[0]);
            }

            const response = await axios.post(`${API_END_POINT}/user/register`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });

            if (response.data.success) {
                navigate("/login");
                toast.success(response.data.message || "Sign Up Successful!");
            } else {
                toast.error(response.data.message || "Sign Up Failed");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "An error occurred during sign up";
            toast.error(errorMessage);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 py-6">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 sm:p-10 transform transition-all duration-500 ease-in-out hover:scale-105">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center tracking-wide">
                    SignUp
                </h1>
                

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Full Name */}
                    <div>
                        <Label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            Full Name
                        </Label>
                        <Input
                            {...register("fullName")}
                            type="text"
                            placeholder="Enter your full name"
                            className="w-full px-4 py-3 border rounded-lg cursor-pointer shadow-sm text-gray-800 dark:text-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-300 ease-in-out"
                        />
                        {errors.fullName && (
                            <p className="text-red-600 text-sm mt-1">{errors.fullName.message}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <Label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email</Label>
                        <Input
                            {...register("email")}
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 border rounded-lg shadow-sm cursor-pointer text-gray-800 dark:text-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-300 ease-in-out"
                        />
                        {errors.email && (
                            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Phone Number */}
                    <div>
                        <Label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phone Number</Label>
                        <Input
                            {...register("phoneNumber")}
                            type="text"
                            placeholder="Enter your phone number"
                            className="w-full px-4 py-3 border rounded-lg shadow-sm cursor-pointer text-gray-800 dark:text-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-300 ease-in-out"
                        />
                        {errors.phoneNumber && (
                            <p className="text-red-600 text-sm mt-1">{errors.phoneNumber.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <Label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Password</Label>
                        <Input
                            {...register("password")}
                            type="password"
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 border rounded-lg shadow-sm cursor-pointer text-gray-800 dark:text-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-300 ease-in-out"
                        />
                        {errors.password && (
                            <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <Label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Confirm Password</Label>
                        <Input
                            {...register("confirmPassword")}
                            type="password"
                            placeholder="Confirm your password"
                            className="w-full px-4 py-3 border rounded-lg shadow-sm cursor-pointer text-gray-800 dark:text-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-300 ease-in-out"
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {/* Role and Avatar Layout */}
                    <div className="mb-4">
                        <Label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Select Your Role</Label>
                        <div className="flex gap-4 items-center">
                            <label className="flex items-center space-x-2">
                                <Input
                                    {...register("role")}
                                    type="radio"
                                    value="student"
                                    className="h-3 w-3 rounded-full text-blue-600 focus:ring-blue-500 border-gray-300 dark:bg-gray-700"
                                />
                                <span className="text-gray-700 dark:text-gray-300 text-sm">Student</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <Input
                                    {...register("role")}
                                    type="radio"
                                    value="recruiter"
                                    className="h-3 w-3 rounded-full text-blue-600 focus:ring-blue-500 border-gray-300 dark:bg-gray-700"
                                />
                                <span className="text-gray-700 dark:text-gray-300 text-sm">Recruiter</span>
                            </label>
                        </div>
                        {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
                    </div>

                    {/* Avatar */}
                    <div>
                        <Label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Avatar</Label>
                        <Input {...register("avatar")} type="file" />
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        className="w-full py-3 bg-indigo-500 text-white text-lg font-semibold rounded-lg transition-all duration-300 ease-in-out hover:bg-indigo-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Sign Up"}
                    </Button>
                </form>

                <p className="mt-4 text-sm text-center text-gray-700 dark:text-gray-300">
                    Already have an account? <Link to="/login" className="text-indigo-500">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
