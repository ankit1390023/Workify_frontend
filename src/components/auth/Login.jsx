import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { Loader } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { GrLinkedin } from "react-icons/gr";
import { FaGithub } from "react-icons/fa6";
import { useTheme } from "@/context/ThemeContext";
const API_END_POINT = import.meta.env.VITE_API_END_POINT;
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
        .max(14, "Password max length is 14 characters"),
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
    const { theme } = useTheme();

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
                        <h1 className="text-3xl font-bold text-primary mb-2">Welcome to Workify</h1>
                        <p className="text-xl font-semibold text-primary/80 mb-3">AI-Powered Career Platform</p>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                            Your intelligent partner for career growth. Get personalized insights, ATS optimization, and smart job matching.
                        </p>
                    </div>

                    {isSubmitting && (
                        <div className="fixed inset-0 bg-background/50 dark:bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
                            <div className="flex flex-col items-center space-y-4">
                                <Loader className="h-8 w-8 animate-spin text-primary" />
                                <span className="text-lg font-semibold text-primary animate-pulse">
                                    Logging in...
                                </span>
                            </div>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Email/Phone Field */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">Email or Phone Number</Label>
                            <Input
                                {...register("identifier")}
                                type="text"
                                placeholder="Enter your email or phone number"
                                className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                            />
                            {errors.identifier && (
                                <p className="text-sm text-destructive">{errors.identifier.message}</p>
                            )}
                        </div>

                        {/* Password Field */}
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

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Logging in..." : "Login"}
                        </Button>

                        {/* Forgot Password Link */}
                        <div className="text-center">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-primary hover:underline"
                            >
                                Forgot your password?
                            </Link>
                        </div>
                    </form>

                    {/* Social Login */}
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

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Link
                                to="/signUp"
                                className="text-primary hover:underline font-medium"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </motion.div>
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
