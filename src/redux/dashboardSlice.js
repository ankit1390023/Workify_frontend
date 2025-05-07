import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    stats: {
        totalAppliedJobs: 0,
        totalInterviews: 0,
        totalPending: 0,
        totalRejected: 0,
        totalJobs: 0,
        profileScore: 0,
        totalSelected: 0
    },
    trends: [],
    skills: []
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setDashboardData: (state, action) => {
            state.stats = action.payload.stats;
            state.trends = action.payload.trends;
            state.skills = action.payload.skills;
        },
        resetDashboardData: (state) => {
            state.stats = initialState.stats;
            state.trends = initialState.trends;
            state.skills = initialState.skills;
        }
    }
});

export const { setDashboardData, resetDashboardData } = dashboardSlice.actions;
export default dashboardSlice.reducer; 