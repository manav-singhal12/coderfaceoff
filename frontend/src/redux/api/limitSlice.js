import apiSlice from "./apiSlice.js";
import {LIMIT_URL} from '../constant.js'

export const LimitApiSlice=apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        addLimit:builder.mutation({
            query:(data)=>({
                url:`${LIMIT_URL}/addlimit`,
                method:'POST',
                body:data
            })
        }),
        getLimits:builder.query({
            query:()=>({
                url:`${LIMIT_URL}/getlimits`,
                transformResponse:(response)=>{
                    console.log("API Response:",response);
                    return response?.data || [];
                }
            })
        }),
        updateLimit:builder.mutation({
            query:(data)=>({
                url:`${LIMIT_URL}/updatelimit`,
                method:'PUT',
                body:data
            })
        }),
        deleteLimit:builder.mutation({
            query:(data)=>({
                url:`${LIMIT_URL}/deletelimit`,
                method:'DELETE',
                body:data
            })
        })
    })
})  

export const {useAddLimitMutation,useGetLimitsQuery,useUpdateLimitMutation,useDeleteLimitMutation}=LimitApiSlice