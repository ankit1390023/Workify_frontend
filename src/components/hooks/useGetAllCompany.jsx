import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner"
const API_END_POINT = import.meta.env.VITE_API_END_POINT;
import { setAllCompanies } from "@/redux/companySlice";

const useGetAllCompany = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllCompany = async () => {
            try {
                const response = await axios.get(`${API_END_POINT}/company/get`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });

                if (response.data.success) {
                    dispatch(setAllCompanies(response.data.data || []));
                    if (response.data.data?.length > 0) {
                        toast.success("Companies fetched successfully!");
                    }
                } else {
                    toast.error(`Failed to fetch companies: ${response.data.message}`);
                }
            } catch (error) {
                console.error("Error fetching companies:", error);
                if (error.response?.status === 401) {
                    toast.error("Please login to view companies");
                } else if (error.response?.status === 404) {
                    toast.error("No companies found");
                } else {
                    toast.error("Failed to fetch companies due to an error");
                }
                dispatch(setAllCompanies([]));
            }
        };

        fetchAllCompany();
    }, [dispatch]);
};

export default useGetAllCompany;
