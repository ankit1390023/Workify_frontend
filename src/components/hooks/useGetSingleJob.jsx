import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner"
import { API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";

const useGetSingleJobs = (jobId) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSingleJobs = async () => {

            const response = await axios.get(`${API_END_POINT}//job/getJobById/${jobId}`,
                {
                    withCredentials: true,
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('acessToken')}`
                    }
                 });
            // console.log("response from customHooks is", response);
            if (response.data.success) {
                dispatch(setSingleJob(response.data.data)); // Dispatch jobs to Redux
                toast.success("Single Jobs fetched successfully!"); // Success toast
            } else {
                toast.error(`Failed to fetch Single jobs: ${response.data.message}`); // Error toast for API failure
            }

        };

        fetchSingleJobs();
    }, [dispatch]); // Ensure no stale dispatch
};

export default useGetSingleJobs;
