import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    allJobs: [],
    allAdminJobs: [],
    singleJob: {},
    searchJobByText: "",
    searchQuery: "",
    categoryFilter: "",
    isLoading: false,
    error: null,
    lastFetched: null,
};

const jobSlice = createSlice({
    name: "job",
    initialState,
    reducers: {
        //actions
        setAllJobs: (state, action) => {
            state.allJobs = action.payload;
            state.lastFetched = Date.now();
            state.error = null;
        },
        setSingleJob: (state, action) => {
            state.singleJob = action.payload;
        },
        setAllAdminJobs: (state, action) => {
            state.allAdminJobs = action.payload;
        },
        setSearchJobByText: (state, action) => {
            state.searchJobByText = action.payload;
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        setCategoryFilter: (state, action) => {
            state.categoryFilter = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const {
    setAllJobs,
    setSingleJob,
    setAllAdminJobs,
    setSearchJobByText,
    setSearchQuery,
    setCategoryFilter,
    setLoading,
    setError } = jobSlice.actions;
export default jobSlice.reducer;