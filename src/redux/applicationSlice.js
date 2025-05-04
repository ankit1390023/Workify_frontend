import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    allApplicants: [],
}
const applicationSlice = createSlice({
    name: "application",
    initialState,
    reducers: {
        setAllApplicants: (state, action) => {
            state.allApplicants = action.payload;
        },
    }

})
export const { setAllApplicants } = applicationSlice.actions;
export default applicationSlice.reducer;