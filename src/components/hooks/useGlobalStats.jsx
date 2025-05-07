import { useEffect } from 'react';
import axios from 'axios';
import { API_END_POINT } from '@/utils/constant';
import { useDispatch } from 'react-redux';
import { setGlobalStats, setLoading, setError } from '@/redux/globalStatsSlice';

const useGlobalStats = () => {
    const dispatch = useDispatch();

    const fetchGlobalStats = async () => {
        dispatch(setLoading());
        try {
            const response = await axios.get(`${API_END_POINT}/dashboard/global-stats`,
                {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                    }
                }
            );
            console.log("response from useGlobalStats",response.data.data);
            dispatch(setGlobalStats(response.data.data));
        } catch (err) {
            console.error('Error fetching global stats:', err);
            dispatch(setError(err.message || 'Failed to fetch global statistics'));
        }
    };

    useEffect(() => {
        fetchGlobalStats();
        const interval = setInterval(fetchGlobalStats, 100000); // Update every 30 seconds
        return () => clearInterval(interval);
    }, []);

    return null; // We don't need to return anything as we're using Redux
};

export default useGlobalStats; 