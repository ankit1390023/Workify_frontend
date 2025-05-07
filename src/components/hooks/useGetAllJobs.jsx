import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner"
import { setAllJobs, setLoading, setError } from "@/redux/jobSlice";
import { API_END_POINT } from "@/utils/constant";

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { searchQuery } = useSelector((state) => state.job);

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                dispatch(setLoading(true));
                const response = await axios.get(`${API_END_POINT}/job/allJobs`,
                    {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                        }
                    });
                console.log("response from useGetAllJobs",response.data.data);
                if (response.data.success) {
                    // Ensure each job has an applications array
                    const jobsWithApplications = response.data.data.map(job => ({
                        ...job,
                        applications: job.applications || []
                    }));
                    dispatch(setAllJobs(jobsWithApplications));
                } else {
                    dispatch(setError(response.data.message));
                    toast.error(`Failed to fetch jobs: ${response.data.message}`);
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
                dispatch(setError(error.message));
                toast.error('An error occurred while fetching jobs');
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchAllJobs();
    }, [dispatch, searchQuery]);
};

export default useGetAllJobs;
