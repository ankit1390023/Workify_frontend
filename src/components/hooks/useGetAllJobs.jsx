import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setAllJobs } from "@/redux/jobSlice";
import { API_END_POINT } from "@/utils/constant";

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { searchQuery } = useSelector((state) => state.job);

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                const response = await axios.get(`${API_END_POINT}/job/allJobs?keyword=${searchQuery}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('acessToken')}`
                    }
                });

                if (response.data.success) {
                    dispatch(setAllJobs(response.data.data));
                    toast.success("Jobs fetched successfully!");
                } else {
                    toast.error(`Failed to fetch jobs: ${response.data.message}`);
                }
            } catch (error) {
                console.error("Error fetching jobs:", error);
                toast.error("Something went wrong while fetching jobs.");
            }
        };

        // Only fetch if there's a search query
        if (searchQuery) {
            fetchAllJobs();
        }
    }, [dispatch, searchQuery]);  // Add searchQuery as dependency
};

export default useGetAllJobs;
