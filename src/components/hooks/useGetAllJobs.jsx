import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner"
import { setAllJobs } from "@/redux/jobSlice";
import { API_END_POINT } from "@/utils/constant";

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { searchQuery } = useSelector((state) => state.job)
    useEffect(() => {
        const fetchAllJobs = async () => {

            const response = await axios.get(`${API_END_POINT}/job/allJobs?keyword=${searchQuery}`,
                { withCredentials: true });
            // console.log("response from customHooks is", response);
            if (response.data.success) {
                dispatch(setAllJobs(response.data.data)); // Dispatch jobs to Redux
                toast.success("Jobs fetched successfully!"); // Success toast
            } else {
                toast.error(`Failed to fetch jobs: ${response.data.message}`); // Error toast for API failure
            }

        };

        fetchAllJobs();
    }, [dispatch]); // Ensure no stale dispatch
};

export default useGetAllJobs;
