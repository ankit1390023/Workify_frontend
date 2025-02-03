import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { GrLinkedin } from "react-icons/gr";
import { FaGithub } from "react-icons/fa6";
import axios from "axios";
import Loader from "../ui/Loader";
import { API_END_POINT } from "@/utils/constant";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";

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


    const navigate = useNavigate();
    const { loginWithRedirect } = useAuth0();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(`${API_END_POINT}/user/login`, data);
            if (response.data.success) {
                dispatch(setUser(response.data.data.user));
                localStorage.setItem("acessToken", response.data.data.accessToken)
                localStorage.setItem("refreshToken", response.data.data.refreshToken)
                toast.success(response.data.message || "Login successful");
                navigate("/");
            } else {
                toast.error(response.data.message || "Invalid credentials");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message || "An error occurred while logging in");
        }
    };


    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 py-6 transition-all duration-500">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 sm:p-10 transition-transform transform hover:scale-105 hover:shadow-2xl">
                {isSubmitting && <Loader message="Submitting..." />}



                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 text-center mb-6 transform transition-all duration-500 ease-in-out hover:text-indigo-600">
                        Login
                    </h1>

                    {/* Identifier */}
                    <div>
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email or Phone Number</Label>
                        <Input
                            {...register("identifier")}
                            type="text"
                            placeholder="Enter your email or phone number"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-600 focus:outline-none dark:bg-gray-700 dark:text-gray-200 transition-all duration-300 ease-in-out transform hover:scale-105"
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
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-600 focus:outline-none dark:bg-gray-700 dark:text-gray-200 transition-all duration-300 ease-in-out transform hover:scale-105"
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </div>

                    {/* Role Selection */}
                    <div className="mb-4">
                        <Label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Select Your Role</Label>
                        <div className="flex gap-4 items-center">
                            <label className="flex items-center space-x-2">
                                <Input
                                    {...register("role")}
                                    type="radio"
                                    value="student"
                                    className="h-3 w-3 rounded-full text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:text-blue-400"
                                />
                                <span className="text-gray-700 dark:text-gray-300 text-sm">Student</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <Input
                                    {...register("role")}
                                    type="radio"
                                    value="recruiter"
                                    className="h-3 w-3 rounded-full text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:text-blue-400"
                                />
                                <span className="text-gray-700 dark:text-gray-300 text-sm">Recruiter</span>
                            </label>
                        </div>
                        {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-indigo-800 text-white font-semibold text-lg rounded-lg shadow-lg hover:bg-indigo-900 transition-all duration-500 ease-in-out hover:shadow-2xl"
                    >
                        {isSubmitting ? "Submitting..." : "Login"}
                    </Button>

                    {/* Social Logins */}
                    <div className="space-y-4 mt-4">
                        <Button
                            type="button"
                            className="w-full flex items-center justify-center py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300"
                            onClick={() => loginWithRedirect()}
                        >
                            <FcGoogle className="mr-2 text-xl" /> Login with Google
                        </Button>
                        <Button
                            type="button"
                            className="w-full flex items-center justify-center py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300"
                        >
                            <GrLinkedin className="mr-2 text-xl text-blue-600" /> Login with LinkedIn
                        </Button>
                        <Button
                            type="button"
                            className="w-full flex items-center justify-center py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300"
                        >
                            <FaGithub className="mr-2 text-xl text-gray-700 dark:text-gray-300" /> Login with GitHub
                        </Button>
                    </div>

                    {/* Sign Up Link */}
                    <p className="text-center text-sm mt-6">
                        Don&apos;t have an account?{" "}
                        <Link to="/signUp" className="text-indigo-600 hover:underline dark:text-indigo-400">
                            Sign Up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;