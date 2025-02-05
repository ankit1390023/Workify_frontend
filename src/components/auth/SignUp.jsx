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
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { GrLinkedin } from "react-icons/gr";
import { FaGithub } from "react-icons/fa6";
import Loader from "../ui/Loader";

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
            .max(10, "Password max length is 10 characters"),
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
            className="flex flex-col items-center min-h-screen px-4 py-6 dark:bg-gray-900"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Header Section */}
            <motion.header className="w-full max-w-3xl text-center" variants={itemVariants}>
                <h1 className="text-3xl font-extrabold text-blue-600 dark:text-white">
                    Welcome to Workify
                </h1>
                <p className="font-semibold text-xl mt-2">
                    Start your journey today!{" "}
                    <motion.span
                        animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        style={{ display: "inline-block" }} // Ensures the span can be animated
                    >
                        👍
                    </motion.span>
                </p>
            </motion.header>

            {/* SignUp Section */}
            <motion.div
                className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between bg-white dark:bg-gray-800 rounded-lg px-6 py-6 md:px-8 md:py-8 shadow-lg"
                variants={itemVariants}
            >
                <motion.div className="w-full md:w-1/2 p-6" variants={itemVariants}>
                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">
                        Sign Up
                    </h2>
                    <p className="text-sm mb-6">
                        Already have an account?
                        <Link
                            to="/login"
                            className="text-indigo-600 hover:underline dark:text-indigo-400 font-bold"
                        >
                            {" "}
                            Login
                        </Link>
                    </p>
                    {isSubmitting && <Loader message="Submitting..." />}
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
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-600 focus:outline-none dark:bg-gray-700 dark:text-gray-200"
                            />
                            {errors.fullName && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.fullName.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <Label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                Email
                            </Label>
                            <Input
                                {...register("email")}
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-600 focus:outline-none dark:bg-gray-700 dark:text-gray-200"
                            />
                            {errors.email && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <Label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                Phone Number
                            </Label>
                            <Input
                                {...register("phoneNumber")}
                                type="text"
                                placeholder="Enter your phone number"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-600 focus:outline-none dark:bg-gray-700 dark:text-gray-200"
                            />
                            {errors.phoneNumber && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.phoneNumber.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <Label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                Password
                            </Label>
                            <Input
                                {...register("password")}
                                type="password"
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-600 focus:outline-none dark:bg-gray-700 dark:text-gray-200"
                            />
                            {errors.password && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <Label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                Confirm Password
                            </Label>
                            <Input
                                {...register("confirmPassword")}
                                type="password"
                                placeholder="Confirm your password"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-600 focus:outline-none dark:bg-gray-700 dark:text-gray-200"
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Role Selection */}
                        <div className="mb-4">
                            <Label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                                Select Your Role
                            </Label>
                            <div className="flex gap-4 items-center">
                                <label className="flex items-center space-x-2">
                                    <Input
                                        {...register("role")}
                                        type="radio"
                                        value="student"
                                        className="h-3 w-3 rounded-full cursor-pointer text-blue-600 focus:ring-blue-500 border-blue-300 dark:bg-gray-700"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                                        Student
                                    </span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <Input
                                        {...register("role")}
                                        type="radio"
                                        value="recruiter"
                                        className="h-3 w-3 rounded-full cursor-pointer text-blue-600 focus:ring-blue-500 border-blue-300 dark:bg-gray-700"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                                        Recruiter
                                    </span>
                                </label>
                            </div>
                            {errors.role && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.role.message}
                                </p>
                            )}
                        </div>

                        {/* Avatar */}
                        <div>
                            <Label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                Avatar
                            </Label>
                            <Input
                                {...register("avatar")}
                                type="file"
                                className="w-full px-4 py-2 border border-blue-300 rounded-lg shadow-sm cursor-pointer text-gray-800 dark:text-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition-all duration-300 ease-in-out"
                            />
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg transition-all duration-300 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Sign Up"}
                        </Button>
                    </form>
                    <div className="relative mt-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <div className="flex justify-center mt-4 gap-6">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <FcGoogle className="text-2xl cursor-pointer" />
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <GrLinkedin className="text-2xl text-blue-600 cursor-pointer" />
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <FaGithub className="text-2xl dark:text-gray-300 cursor-pointer" />
                        </motion.div>
                    </div>
                </motion.div>
                <motion.div className="hidden md:flex md:w-1/2 justify-center" variants={itemVariants}>
                    <motion.img
                        src="register.png"
                        alt="Sign Up Illustration"
                        className="max-w-full h-auto"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.8 }}
                    />
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default SignUp;
