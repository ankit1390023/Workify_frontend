import { useState, useEffect } from 'react';
import axios from 'axios';
const API_END_POINT = import.meta.env.VITE_API_END_POINT;
import { useDispatch } from 'react-redux';
import { setDashboardData } from '@/redux/dashboardSlice';

export const useDashboardData = () => {
    const dispatch = useDispatch();
    const [retryCount, setRetryCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 240000; // 4 minutes in milliseconds

    const fetchDashboardData = async () => {
        setLoading(true);
        setError('');
        try {
            const [statsResponse, trendsResponse, skillsResponse] = await Promise.all([
                axios.get(`${API_END_POINT}/dashboard/stats`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                    },
                }),
                axios.get(`${API_END_POINT}/dashboard/trends`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                    },
                }),
                axios.get(`${API_END_POINT}/dashboard/skills`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                    },
                })
            ]);

            const dashboardData = {
                stats: {
                    totalAppliedJobs: statsResponse.data?.data?.totalAppliedJobs || 0,
                    totalInterviews: statsResponse.data?.data?.totalInterviews || 0,
                    totalPending: statsResponse.data?.data?.totalPending || 0,
                    totalRejected: statsResponse.data?.data?.totalRejected || 0,
                    totalJobs: statsResponse.data?.data?.totalJobs || 0,
                    profileScore: statsResponse.data?.data?.profileScore || 0,
                    totalSelected: statsResponse.data?.data?.totalSelected || 0
                },
                trends: trendsResponse.data?.data || [],
                skills: skillsResponse.data?.data || []
            };

            dispatch(setDashboardData(dashboardData));
            setRetryCount(0);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            if (retryCount < MAX_RETRIES) {
                setRetryCount(prev => prev + 1);
                setError(`Failed to load dashboard data. Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
                setTimeout(fetchDashboardData, RETRY_DELAY);
            } else {
                setError('Failed to load dashboard data. Please try refreshing the page.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, RETRY_DELAY); // 4 minutes interval
        return () => clearInterval(interval);
    }, []);

    return { loading, error };
}; 