import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    loading: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setUser(state, action) {
            // console.log("Action Payload:", action.payload);
            state.user = action.payload;
        }
    },
});

export const { setUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
