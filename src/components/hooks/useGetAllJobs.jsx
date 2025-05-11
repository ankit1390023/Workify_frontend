import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner"
import { setAllJobs, setLoading, setError } from "@/redux/jobSlice";
const API_END_POINT = import.meta.env.VITE_API_END_POINT;

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { searchQuery, allJobs } = useSelector((state) => state.job);

    // Memoize the filtered jobs based on search query
    const filteredJobs = useMemo(() => {
        if (!searchQuery) return allJobs;
        
        return allJobs.filter(job => 
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.location.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [allJobs, searchQuery]);

    const fetchAllJobs = async () => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));

            const response = await axios.get(`${API_END_POINT}/job/allJobs`,
                {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });

            if (!response?.data) {
                throw new Error('No data received from server');
            }

            if (response.data.success) {
                const jobsWithApplications = Array.isArray(response.data.data) 
                    ? response.data.data.map(job => ({
                        ...job,
                        applications: Array.isArray(job.applications) ? job.applications : []
                    }))
                    : [];
                
                dispatch(setAllJobs(jobsWithApplications));
            } else {
                const errorMessage = response.data.message || 'Failed to fetch jobs';
                dispatch(setError(errorMessage));
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
            const errorMessage = error.response?.data?.message || error.message || 'An error occurred while fetching jobs';
            dispatch(setError(errorMessage));
            toast.error(errorMessage);
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        fetchAllJobs();
    }, [dispatch, searchQuery]);

    return filteredJobs;
};

export default useGetAllJobs;
