import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { GrLinkedin } from "react-icons/gr";
import { FaGithub } from "react-icons/fa6";
import { Loader } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const API_END_POINT = import.meta.env.VITE_API_END_POINT;

// Framer Motion variants for staggered animations
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            when: "beforeChildren",
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 },
    },
};

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
            .max(14, "Password max length is 14 characters"),
        confirmPassword: z.string(),
        role: z.enum(["student", "recruiter"], "Role is required"),
        avatar: z
            .instanceof(FileList)
            .refine(
                (fileList) =>
                    fileList.length === 0 || fileList[0].type.startsWith("image/"),
                { message: "Only image files are allowed" }
            )
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
    const { theme } = useTheme();

    const onSubmit = async (data) => {
        console.log("data from signup is", data);
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

            const response = await axios.post(
                `${API_END_POINT}/user/register`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data.success) {
                navigate("/login");
                toast.success(response.data.message || "Sign Up Successful!");
            } else {
                toast.error(response.data.message || "Sign Up Failed");
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "An error occurred during sign up";
            toast.error(errorMessage);
        }
    };

    return (
        <motion.div
            className="min-h-screen flex items-center justify-center p-4 bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="w-full max-w-md bg-card rounded-xl dark:shadow-lg overflow-hidden">
                {/* Form */}
                <motion.div
                    className="w-full p-8 bg-gradient-to-br from-background to-background/95"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-primary mb-2">Join Workify</h1>
                        <p className="text-xl font-semibold text-primary/80 mb-3">AI-Powered Career Platform</p>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                            Start your journey with intelligent career guidance. Experience AI-driven resume optimization, personalized job recommendations, and career insights.
                        </p>
                    </div>

                    {isSubmitting && (
                        <div className="fixed inset-0 bg-background/50 dark:bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
                            <div className="flex flex-col items-center space-y-4">
                                <Loader className="h-8 w-8 animate-spin text-primary" />
                                <span className="text-lg font-semibold text-primary animate-pulse">
                                    Creating account...
                                </span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-6">
                                {/* Full Name */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-foreground">Full Name</Label>
                                    <Input
                                        {...register("fullName")}
                                        type="text"
                                        placeholder="Enter your full name"
                                        className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                                    />
                                    {errors.fullName && (
                                        <p className="text-sm text-destructive">{errors.fullName.message}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-foreground">Email</Label>
                                    <Input
                                        {...register("email")}
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-destructive">{errors.email.message}</p>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-foreground">Password</Label>
                                    <Input
                                        {...register("password")}
                                        type="password"
                                        placeholder="Enter your password"
                                        className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-destructive">{errors.password.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                {/* Phone Number */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-foreground">Phone Number</Label>
                                    <Input
                                        {...register("phoneNumber")}
                                        type="text"
                                        placeholder="Enter your phone number"
                                        className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                                    />
                                    {errors.phoneNumber && (
                                        <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-foreground">Confirm Password</Label>
                                    <Input
                                        {...register("confirmPassword")}
                                        type="password"
                                        placeholder="Confirm your password"
                                        className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                                    )}
                                </div>

                                {/* Role Selection */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-foreground">Select Your Role</Label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                {...register("role")}
                                                type="radio"
                                                value="student"
                                                className="h-4 w-4 text-primary focus:ring-primary border-input"
                                            />
                                            <span className="text-sm text-foreground">Student</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                {...register("role")}
                                                type="radio"
                                                value="recruiter"
                                                className="h-4 w-4 text-primary focus:ring-primary border-input"
                                            />
                                            <span className="text-sm text-foreground">Recruiter</span>
                                        </label>
                                    </div>
                                    {errors.role && (
                                        <p className="text-sm text-destructive">{errors.role.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Avatar Upload - Full Width */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">Profile Picture</Label>
                            <Input
                                {...register("avatar")}
                                type="file"
                                accept="image/*"
                                className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 cursor-pointer"
                            />
                            {errors.avatar && (
                                <p className="text-sm text-destructive">{errors.avatar.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating account..." : "Sign Up"}
                        </Button>
                    </form>

                    {/* Social Sign Up */}
                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-card text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-center mt-4 gap-6">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-3 rounded-full bg-background border border-input hover:bg-accent transition-colors"
                            >
                                <FcGoogle className="text-2xl" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-3 rounded-full bg-background border border-input hover:bg-accent transition-colors"
                            >
                                <GrLinkedin className="text-2xl text-blue-600" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-3 rounded-full bg-background border border-input hover:bg-accent transition-colors"
                            >
                                <FaGithub className="text-2xl text-foreground" />
                            </motion.button>
                        </div>
                    </div>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-primary hover:underline font-medium"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default SignUp;
