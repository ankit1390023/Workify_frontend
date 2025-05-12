import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { Loader } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const API_END_POINT = import.meta.env.VITE_API_END_POINT;

const formSchema = z.object({
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isValidating, setIsValidating] = useState(true);
    const [isValidToken, setIsValidToken] = useState(false);
    const token = searchParams.get("token");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                toast.error("Invalid reset link");
                navigate("/forgot-password");
                return;
            }

            try {
                const response = await axios.get(`${API_END_POINT}/user/validate-reset-token?token=${token}`);
                if (response.data.success) {
                    setIsValidToken(true);
                } else {
                    toast.error("Invalid or expired reset link");
                    navigate("/forgot-password");
                }
            } catch (error) {
                console.error("Token validation error:", error);
                toast.error("Invalid or expired reset link");
                navigate("/forgot-password");
            } finally {
                setIsValidating(false);
            }
        };

        validateToken();
    }, [token, navigate]);

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(`${API_END_POINT}/user/reset-password`, {
                token,
                newPassword: data.password,
            });

            if (response.data.success) {
                toast.success("Password reset successful");
                reset(); // Clear form after successful submission
                navigate("/login");
            } else {
                toast.error(response.data.message || "Failed to reset password");
            }
        } catch (error) {
            console.error("Reset password error:", error);
            toast.error(error?.response?.data?.message || "Failed to reset password. Please try again.");
        }
    };

    if (isValidating) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <Loader className="h-8 w-8 animate-spin text-primary" />
                    <span className="text-lg font-semibold text-primary animate-pulse">
                        Validating reset link...
                    </span>
                </div>
            </div>
        );
    }

    if (!isValidToken) {
        return null; // Will redirect to forgot-password page
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
                        <h1 className="text-3xl font-bold text-primary mb-2">Reset Password</h1>
                        <p className="text-muted-foreground">Enter your new password</p>
                    </div>

                    {isSubmitting && (
                        <div className="fixed inset-0 bg-background/50 dark:bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
                            <div className="flex flex-col items-center space-y-4">
                                <Loader className="h-8 w-8 animate-spin text-primary" />
                                <span className="text-lg font-semibold text-primary animate-pulse">
                                    Resetting password...
                                </span>
                            </div>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">New Password</Label>
                            <Input
                                {...register("password")}
                                type="password"
                                placeholder="Enter new password"
                                className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                            />
                            {errors.password && (
                                <p className="text-sm text-destructive">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">Confirm Password</Label>
                            <Input
                                {...register("confirmPassword")}
                                type="password"
                                placeholder="Confirm new password"
                                className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                            />
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
                            Reset Password
                        </Button>

                        {/* Back to Login Link */}
                        <div className="text-center">
                            <Link
                                to="/login"
                                className="text-sm text-primary hover:underline"
                            >
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default ResetPassword; 