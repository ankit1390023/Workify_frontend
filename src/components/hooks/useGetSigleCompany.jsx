import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner"
import { API_END_POINT } from "@/utils/constant";
import { setSingleCompany } from "@/redux/companySlice";


const useGetSingleCompany = (companyId) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSingleCompany = async () => {

           try {
               const response = await axios.get(`${API_END_POINT}/company/get/${companyId}`, {
                   headers: {
                       "Authorization": `Bearer ${localStorage.getItem('acessToken')}`
                   }
              });
             // console.log("response from customHooks is", response);
             if (response.data.success) {
                 dispatch(setSingleCompany(response.data.data)); // Dispatch jobs to Redux
                 toast.success("All Companies fetched successfully!"); // Success toast
             } else {
                 toast.error(`Failed to fetch Companies: ${response.data.message}`); // Error toast for API failure
             }
           } catch (error) {
               console.error("Error fetching Companies:", error);
               toast.error("Failed to fetch Companies due to an error"); // Error toast for API failure
           }

        };

        fetchSingleCompany();
    }, [dispatch]); // Ensure no stale dispatch
};

export default useGetSingleCompany;
