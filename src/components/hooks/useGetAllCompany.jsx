import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner"
import { API_END_POINT } from "@/utils/constant";
import { setAllCompanies } from "@/redux/companySlice";

const useGetAllCompany = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllCompany = async () => {

            const response = await axios.get(`${API_END_POINT}/company/get`, {
                withCredentials: true,
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('acessToken')}`
                }
             });
            // console.log("response from customHooks is", response);
            if (response.data.success) {
                dispatch(setAllCompanies(response.data.data)); // Dispatch jobs to Redux
                toast.success("All Companies fetched successfully!"); // Success toast
            } else {
                toast.error(`Failed to fetch Companies: ${response.data.message}`); // Error toast for API failure
            }

        };

        fetchAllCompany();
    }, [dispatch]); // Ensure no stale dispatch
};

export default useGetAllCompany;
