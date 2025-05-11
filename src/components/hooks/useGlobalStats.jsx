import { useEffect, useRef } from 'react';
import axios from 'axios';
const API_END_POINT = import.meta.env.VITE_API_END_POINT;
import { useDispatch, useSelector } from 'react-redux';
import { setGlobalStats, setLoading, setError } from '@/redux/globalStatsSlice';

// Define refresh interval constant (100 seconds)
// This helps maintain consistency and makes it easy to modify the refresh rate
const REFRESH_INTERVAL = 100000;

/**
 * Custom hook for managing global statistics
 * This hook handles fetching, caching, and periodic updates of global stats
 * Optimized to prevent unnecessary API calls and handle route changes efficiently
 */
const useGlobalStats = () => {
    // Get dispatch function from Redux to update global state
    const dispatch = useDispatch();
    
    // Get lastFetched timestamp from Redux store to implement caching
    // This helps us know when the data was last updated
    const { lastFetched } = useSelector((state) => state.globalStats);
    
    // Create a ref to store the interval ID
    // useRef persists across re-renders and doesn't trigger re-renders when changed
    // This is crucial for maintaining the interval across route changes
    const intervalRef = useRef(null);

    /**
     * Function to fetch global statistics from the API
     * Handles loading states, success, and error cases
     */
    const fetchGlobalStats = async () => {
        try {
            // Set loading state to true before API call
            dispatch(setLoading());
            
            // Make API request with authentication
            const response = await axios.get(`${API_END_POINT}/dashboard/global-stats`,
                {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                    }
                }
            );
            
            // Check if the API call was successful
            if (response.data.success) {
                // Update Redux store with new data and current timestamp
                // This helps implement caching mechanism
                dispatch(setGlobalStats({
                    ...response.data.data,
                    lastFetched: Date.now()
                }));
            } else {
                // Handle API success: false case
                throw new Error(response.data.message || 'Failed to fetch global statistics');
            }
        } catch (err) {
            // Handle any errors during API call
            console.error('Error fetching global stats:', err);
            dispatch(setError(err.message || 'Failed to fetch global statistics'));
        }
    };

    /**
     * useEffect hook to manage data fetching and periodic updates
     * Implements smart fetching strategy and interval management
     */
    useEffect(() => {
        // Calculate if we need to fetch new data
        const now = Date.now();
        const shouldFetch = !lastFetched || (now - lastFetched > REFRESH_INTERVAL);

        // Fetch data if:
        // 1. No data exists (lastFetched is null)
        // 2. Data is older than REFRESH_INTERVAL
        if (shouldFetch) {
            fetchGlobalStats();
        }

        // Set up periodic updates only if interval doesn't exist
        // This prevents multiple intervals from being created
        if (!intervalRef.current) {
            intervalRef.current = setInterval(fetchGlobalStats, REFRESH_INTERVAL);
        }

        // Cleanup function to prevent memory leaks
        // Runs when component unmounts or dependencies change
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [lastFetched]); // Only re-run effect when lastFetched changes
    // This prevents unnecessary re-renders on route changes

    return null; // Hook doesn't need to return anything as it uses Redux for state management
};

export default useGlobalStats; 