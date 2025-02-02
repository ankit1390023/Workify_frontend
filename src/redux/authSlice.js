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
        },
        clearUser(state) {
            // This clears the user data on logout
            state.user = null;
            state.loading = false; // You may choose to reset any other state here
        },
    },
});

export const { setUser, clearUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
