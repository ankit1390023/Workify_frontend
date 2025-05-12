import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { Loader, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const API_END_POINT = import.meta.env.VITE_API_END_POINT;

const formSchema = z.object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(14, "Password max length is 14 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

const ChangePassword = () => {
    const navigate = useNavigate();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isTokenValid, setIsTokenValid] = useState(true);

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setIsTokenValid(false);
                toast.error("Please login to change your password");
                navigate("/login");
                return;
            }
        };
        checkToken();
    }, [navigate]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(
                `${API_END_POINT}/user/change-password`,
                {
                    oldPassword: data.oldPassword,
                    newPassword: data.newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                }
            );

            if (response.data.statusCode === 200) {
                toast.success(response.data.message || "Password changed successfully");
                reset(); // Clear form after successful submission
                navigate("/profile");
            } else {
                toast.error(response.data.message || "Failed to change password");
            }
        } catch (error) {
            console.error("Change password error:", error);
            if (error.response?.status === 401) {
                toast.error("Current password is incorrect");
            } else if (error.response?.status === 403) {
                toast.error("Session expired. Please login again");
                navigate("/login");
            } else {
                toast.error(error?.response?.data?.message || "Failed to change password. Please try again.");
            }
        }
    };

    if (!isTokenValid) {
        return null;
    }

    return (
        <motion.div 
            className="min-h-screen flex items-center justify-center p-4 bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="w-full max-w-md bg-card rounded-xl shadow-lg p-8">
                <motion.div 
                    className="w-full"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-primary mb-2">Change Password</h1>
                        <p className="text-muted-foreground">Enter your current and new password</p>
                    </div>

                    {isSubmitting && (
                        <div className="fixed inset-0 bg-background/50 dark:bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
                            <div className="flex flex-col items-center space-y-4">
                                <Loader className="h-8 w-8 animate-spin text-primary" />
                                <span className="text-lg font-semibold text-primary animate-pulse">
                                    Changing password...
                                </span>
                            </div>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Current Password Field */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">Current Password</Label>
                            <div className="relative">
                                <Input
                                    {...register("oldPassword")}
                                    type={showCurrentPassword ? "text" : "password"}
                                    placeholder="Enter current password"
                                    className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.oldPassword && (
                                <p className="text-sm text-destructive">{errors.oldPassword.message}</p>
                            )}
                        </div>

                        {/* New Password Field */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">New Password</Label>
                            <div className="relative">
                                <Input
                                    {...register("newPassword")}
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.newPassword && (
                                <p className="text-sm text-destructive">{errors.newPassword.message}</p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">Confirm New Password</Label>
                            <div className="relative">
                                <Input
                                    {...register("confirmPassword")}
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
                            disabled={isSubmitting}
                        >
                            <Lock className="w-4 h-4 mr-2" />
                            Change Password
                        </Button>

                        {/* Back to Profile Link */}
                        <div className="text-center">
                            <Link
                                to="/profile"
                                className="text-sm text-primary hover:underline"
                            >
                                Back to Profile
                            </Link>
                        </div>
                    </form>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default ChangePassword;
