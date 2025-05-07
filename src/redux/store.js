import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default is localStorage
import { combineReducers } from 'redux';
import authSlice from './authSlice';
import jobSlice from './jobSlice';
import companySlice from './companySlice';
import applicationSlice from './applicationSlice';
import dashboardSlice from './dashboardSlice';
import globalStatsSlice from './globalStatsSlice';
// 1. Create a persist configuration
const persistConfig = {
    key: 'root', // Key to persist the state
    storage,     // Storage to use (localStorage in this case)
};

// 2. Combine reducers
const rootReducer = combineReducers({
    auth: authSlice,
    job: jobSlice,
    company: companySlice,
    application: applicationSlice,
    dashboard: dashboardSlice,
    globalStats: globalStatsSlice,
});

// 3. Wrap rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Configure the store
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Required for redux-persist
        }),
});

// 5. Create a persistor
export const persistor = persistStore(store);

export default store;



