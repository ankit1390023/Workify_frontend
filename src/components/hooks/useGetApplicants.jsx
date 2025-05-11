import React, { useEffect } from 'react';
const API_END_POINT = import.meta.env.VITE_API_END_POINT;
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
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                console.log("Response from fetchAllApplicants:", response?.data?.data?.applications);
                if (response.data.success) {
                    dispatch(setAllApplicants(response?.data?.data?.applications));
                    toast.success("All applicants fetched successfully!");
                } else {
                    toast.error(`Failed to fetch applicants: ${response.data.message}`); // Handle unexpected response structure
                }
            } catch (error) {
                dispatch(setAllApplicants({}));
                console.log("Failed to fetch applicants. Please try again.", error); 
                const errorMessage = error.response?.data?.message || error.message || "Failed to fetch applicants. Please try again.";
                                toast.error(errorMessage);
            }
        };

        if (jobId) {
            fetchAllApplicants();
        }
    }, [jobId, dispatch]);
};

export default useGetAllApplicants;
