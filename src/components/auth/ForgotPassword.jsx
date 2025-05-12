import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { Loader } from "lucide-react";
import { motion } from "framer-motion";

const API_END_POINT = import.meta.env.VITE_API_END_POINT;

const formSchema = z.object({
    email: z.string().email("Invalid email address"),
});

const ForgotPassword = () => {
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
            const response = await axios.post(`${API_END_POINT}/user/forgot-password`, data);
            
            if (response.data.success) {
                toast.success("Password reset link sent to your email");
                reset(); // Clear form after successful submission
            } else {
                toast.error(response.data.message || "Failed to send reset link");
            }
        } catch (error) {
            console.error("Forgot password error:", error);
            toast.error(error?.response?.data?.message || "Failed to send reset link. Please try again.");
        }
    };

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
                        <h1 className="text-3xl font-bold text-primary mb-2">Forgot Password</h1>
                        <p className="text-muted-foreground">Enter your email to reset your password</p>
                    </div>

                    {isSubmitting && (
                        <div className="fixed inset-0 bg-background/50 dark:bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
                            <div className="flex flex-col items-center space-y-4">
                                <Loader className="h-8 w-8 animate-spin text-primary" />
                                <span className="text-lg font-semibold text-primary animate-pulse">
                                    Sending reset link...
                                </span>
                            </div>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Email Field */}
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

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
                            disabled={isSubmitting}
                        >
                            Send Reset Link
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

export default ForgotPassword; 