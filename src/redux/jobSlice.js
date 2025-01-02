import { createSlice } from "@reduxjs/toolkit";
const initialState={
    allJobs: [],
    allAdminJobs: [],
    singleJob: {},
    searchJobByText: "",
    searchQuery: "",
}
const jobSlice = createSlice({
    name: 'job',
    initialState,
    reducers: {
        //actions
        setAllJobs:(state, action)=>{
            state.allJobs = action.payload;
        },
        setSingleJob:(state, action)=>{
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
        }
    },
})

export const { 
    setAllJobs,
    setSingleJob,
    setAllAdminJobs,
    setSearchJobByText,
    setSearchQuery } = jobSlice.actions;
export default jobSlice.reducer;