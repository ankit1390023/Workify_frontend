import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner"
const API_END_POINT = import.meta.env.VITE_API_END_POINT;
import { setSingleJob, setLoading, setError } from "@/redux/jobSlice";

const useGetSingleJobs = (jobId) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSingleJobs = async () => {
            if (!jobId) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                dispatch(setLoading(true));
                dispatch(setError(null));

                const response = await axios.get(`${API_END_POINT}/job/getJobById/${jobId}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });

                if (response.data.success) {
                    // Format the job data before dispatching
                    const formattedJob = {
                        ...response.data.data,
                        requirements: Array.isArray(response.data.data.requirements) 
                            ? response.data.data.requirements 
                            : response.data.data.requirements?.split(',').map(req => req.trim()) || [],
                        location: Array.isArray(response.data.data.location)
                            ? response.data.data.location
                            : response.data.data.location?.split(',').map(loc => loc.trim()) || [],
                    };

                    dispatch(setSingleJob(formattedJob));
                    toast.success("Job details loaded successfully!");
                } else {
                    dispatch(setSingleJob({}));
                    dispatch(setError(response.data.message));
                    toast.error(`Failed to fetch job details: ${response.data.message}`);
                }
            } catch (error) {
                console.error("Error fetching job details:", error);
                dispatch(setSingleJob({}));
                const errorMessage = error.response?.data?.message || error.message || "Failed to fetch job details";
                dispatch(setError(errorMessage));
                toast.error(errorMessage);
            } finally {
                setIsLoading(false);
                dispatch(setLoading(false));
            }
        };

        fetchSingleJobs();
    }, [dispatch, jobId]);

    return { isLoading };
};

export default useGetSingleJobs;
