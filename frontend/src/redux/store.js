import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query/react';
import apiSlice from './api/apiSlice';
import authReducer from './auth/authSlice'
const store=configureStore({
    reducer:{
        [apiSlice.reducerPath]:apiSlice.reducer,
        auth:authReducer
    },
    middleware:(getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware), // add middlewares like redux-thunk
    devTools:true, // for debugging purposes
})

setupListeners(store.dispatch); // refetches API Queries when internet reconnects for real time updates
export default store;