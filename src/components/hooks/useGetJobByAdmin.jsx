import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setAllAdminJobs } from "@/redux/jobSlice";
import { API_END_POINT } from "@/utils/constant";

const useGetJobByAdmin = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchGetAdminJobs = async () => {
            try {
                const response = await axios.get(`${API_END_POINT}/job/getJobByAdmin`, { withCredentials: true });
                // console.log("response from getJobByAdmin", response);
                if (response?.data?.success) { // Safely access response.data.success
                    console.log("useGetAllJObByAdmin", response.data.data);
                    dispatch(setAllAdminJobs(response.data.data)); // Dispatch jobs to Redux
                    toast.success("All admin Jobs fetched successfully!"); // Success toast
                } else {
                    toast.error(`Failed to fetch all jobs created by admin: ${response?.data?.message || "Unknown error"}`); // Handle unexpected response structure
                }
            } catch (error) {
                dispatch(setAllAdminJobs({}))
                console.log("Failed to fetch all jobs created by admin", error); 
                const errorMessage = error.response?.data?.message || error.message || "Failed to fetch all jobs created by admin";
                toast.error(errorMessage);
            }
        };

        fetchGetAdminJobs();
    }, [dispatch]); // Ensure no stale dispatch
};

export default useGetJobByAdmin;
