import apiSlice from "./apiSlice";
import { MAIN_URL } from "../constant.js";

export const userApiSlice=apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register:builder.mutation({
            query: (data) => ({
                url:`${MAIN_URL}/register`,
                method: 'POST',
                body:data
            }),
        }),
        login:builder.mutation({
            query: (data) => ({
                url:`${MAIN_URL}/login`,
                method: 'POST',
                body:data,
                credentials:"include",
            })
        }),
        logout:builder.mutation({
            query: () => ({
                url:`${MAIN_URL}/logout`,
                method: 'POST',
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("accessToken")}`
                },
                credentials:"include",

            }),
        }),
        updateProfile:builder.mutation({
            query: (data) => ({
                url:`${MAIN_URL}/update-profile`,
                method: 'PUT',
                body:data,
                credentials:"include",

            }),
        })                                                                                                                                  
    }),
})

export const {useRegisterMutation,useLoginMutation,useLogoutMutation,useUpdateProfileMutation} =userApiSlice;