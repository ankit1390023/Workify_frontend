import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    allCompanies: [],
    singleCompany: {},
    searchCompanyByText: "",
};

const companySlice = createSlice({
    name: 'company',
    initialState,
    reducers: {
        setAllCompanies: (state, action) => {
            state.allCompanies = action.payload;
        },
        setSingleCompany: (state, action) => {
            state.singleCompany = action.payload;
        },
        setSearchCompanyByText: (state, action) => {
            state.searchCompanyByText = action.payload;
        }
    },
}); // Missing parenthesis added here

export const { setAllCompanies, setSingleCompany ,setSearchCompanyByText} = companySlice.actions;
export default companySlice.reducer;
