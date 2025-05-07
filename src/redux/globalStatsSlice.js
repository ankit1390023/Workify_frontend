import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    totalJobs: 0,
    totalUsers: 0,
    totalApplications: 0,
    averageProfileScore: 0,
    loading: false,
    error: null
};

const globalStatsSlice = createSlice({
    name: 'globalStats',
    initialState,
    reducers: {
        setGlobalStats: (state, action) => {
            return {
                ...state,
                ...action.payload,
                loading: false,
                error: null
            };
        },
        setLoading: (state) => {
            state.loading = true;
            state.error = null;
        },
        setError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const { setGlobalStats, setLoading, setError } = globalStatsSlice.actions;
export default globalStatsSlice.reducer; 