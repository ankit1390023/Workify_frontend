import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setAllAdminJobs, setLoading } from "@/redux/jobSlice";
const API_END_POINT = import.meta.env.VITE_API_END_POINT;

const useGetJobByAdmin = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchGetAdminJobs = async () => {
            try {
                dispatch(setLoading(true)); // Set loading to true before the request
                const response = await axios.get(`${API_END_POINT}/job/getJobByAdmin`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                    }
                 });
                
                if (response?.data?.success) {
                    dispatch(setAllAdminJobs(response.data.data)); // Dispatch jobs to Redux
                    toast.success("All admin Jobs fetched successfully!"); // Success toast
                } else {
                    dispatch(setAllAdminJobs([])); // Dispatch empty array on failure
                    toast.error(`Failed to fetch all jobs created by admin: ${response?.data?.message || "Unknown error"}`);
                }
            } catch (error) {
                dispatch(setAllAdminJobs([])); // Dispatch empty array on error
                console.error("Failed to fetch all jobs created by admin:", error); 
                const errorMessage = error.response?.data?.message || error.message || "Failed to fetch all jobs created by admin";
                toast.error(errorMessage);
            } finally {
                dispatch(setLoading(false)); // Set loading to false after the request completes
            }
        };

        fetchGetAdminJobs();
    }, [dispatch]);
};

export default useGetJobByAdmin;
