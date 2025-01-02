import React, { useEffect } from 'react';
import { API_END_POINT } from "@/utils/constant";
import { useDispatch } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';
import axios from 'axios';
import { toast } from 'sonner';


const useGetAllApplicants = (jobId) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const response = await axios.get(`${API_END_POINT}/application/${jobId}/getApplicants`, {
                    withCredentials: true
                });
                console.log("Response from fetchAllApplicants:", response?.data?.data?.applications);
                if (response.data.success) {
                    dispatch(setAllApplicants(response?.data?.data?.applications));
                    toast.success("All applicants fetched successfully!");
                } else {
                    toast.error(`Failed to fetch applicants: ${response.data.message}`); // Handle unexpected response structure
                }
            } catch (error) {
                console.error("Error fetching applicants:", error);
                toast.error("Failed to fetch applicants. Please try again.");
            }
        };

        if (jobId) {
            fetchAllApplicants();
        }
    }, [jobId, dispatch]);
};

export default useGetAllApplicants;
