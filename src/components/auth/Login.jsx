import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import Loader from "../ui/Loader";
import { API_END_POINT } from "@/utils/constant";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { GrLinkedin } from "react-icons/gr";
import { FaGithub } from "react-icons/fa6";

const formSchema = z.object({
    identifier: z
        .string()
        .refine(
            (value) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) || /^[6-9]\d{9}$/.test(value),
            { message: "Invalid email or phone number" }
        ),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(10, "Password max length is 10 characters"),
    role: z.enum(["student", "recruiter"], { message: "Role is required" }),
});

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(formSchema),
    });
    const dispatch = useDispatch();
    const { loginWithRedirect } = useAuth0();
    const navigate = useNavigate();
    const onSubmit = async (data) => {
        try {
            const response = await axios.post(`${API_END_POINT}/user/login`, data);
            if (response.data.success) {
                dispatch(setUser(response.data.data.user));
                localStorage.setItem("accessToken", response.data.data.accessToken);
                localStorage.setItem("refreshToken", response.data.data.refreshToken);
                navigate('/')
                toast.success(response.data.message || "Login successful");
            } else {
                toast.error(response.data.message || "Invalid credentials");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message || "An error occurred while logging in");
        }
    };

    return (
        <motion.div className="flex flex-col items-center min-h-screen px-4 py-6 dark:bg-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Header Section */}
            {/* Header Section */}
            <motion.header
                className="w-full max-w-3xl text-center"
                variants={itemVariants}
            >
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

            {/* Login Section */}
            <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between bg-white dark:bg-gray-800 rounded-lg px-6 py-6 md:px-8 md:py-8">
                <div className="w-full md:w-1/2 p-6">
                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">Login</h2>
                    <p className="text-sm mb-6">
                        Don&apos;t have an account?
                        <Link to="/signUp" className="text-blue-700 hover:underline dark:text-blue-400 font-bold"> Sign Up</Link>
                    </p>
                    {isSubmitting && <Loader message="Submitting..." />}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Identifier */}
                        <div>
                            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email or Phone Number
                            </Label>
                            <Input
                                {...register("identifier")}
                                type="text"
                                placeholder="Enter your email or phone number"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-600 focus:outline-none dark:bg-gray-700 dark:text-gray-200"
                            />
                            {errors.identifier && <p className="text-red-500 text-sm mt-1">{errors.identifier.message}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</Label>
                            <Input
                                {...register("password")}
                                type="password"
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-600 focus:outline-none dark:bg-gray-700 dark:text-gray-200"
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                        </div>
                        <div className="mb-4">
                            <Label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Select Your Role</Label>
                            <div className="flex items-center justify-between">
                                <div className="flex gap-4 items-center">
                                    <label className="flex items-center space-x-2">
                                        <Input
                                            {...register("role")}
                                            type="radio"
                                            value="student"
                                            className="h-3 w-3 rounded-full text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <span className="text-gray-700 dark:text-gray-300 text-sm">Student</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <Input
                                            {...register("role")}
                                            type="radio"
                                            value="recruiter"
                                            className="h-3 w-3 rounded-full text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <span className="text-gray-700 dark:text-gray-300 text-sm">Recruiter</span>
                                    </label>
                                </div>
                                <div className="text-sm text-end">
                                    <Link className="font-medium text-indigo-600 hover:text-indigo-500">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>
                            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
                        </div>
                        {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
                        <Button type="submit" disabled={isSubmitting} className="w-full py-3  bg-blue-600 text-white text-lg font-semibold rounded-lg transition-all duration-300 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800">
                            {isSubmitting ? "Submitting..." : "Login"}
                        </Button>
                    </form>
                    <div className="relative mt-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>
                    <div className="flex justify-center mt-4 gap-6">
                        <FcGoogle className="text-2xl cursor-pointer" />
                        <GrLinkedin className="text-2xl text-blue-600 cursor-pointer" />
                        <FaGithub className="text-2xl dark:text-gray-300 cursor-pointer" />
                    </div>
                </div>
                <div className="hidden md:flex md:w-1/2 justify-center">
                    <motion.img src="login.png" alt="Login Illustration" className="max-w-full h-auto" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.8 }} />
                </div>
            </div>
        </motion.div>
    );
};

export default Login;



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
        transition: { duration: 0.6 }
    },
};
