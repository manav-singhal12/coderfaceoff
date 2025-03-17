import apiSlice from "./apiSlice";
import {PAYMENT_URL} from '../constant.js'

export const PaymentApiSlice=apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        sendPayment:builder.mutation({
            query:(data)=>({
                url:`${PAYMENT_URL}/sendPayment`,
                method:'POST',
                body:data
            })
        }),
        getPayments:builder.query({
            query:()=>({
                url:`${PAYMENT_URL}/getPayments`,
                transformResponse:(response)=>{
                    console.log("API Response:",response);
                    return response?.data || [];
                }
            })
        })
    })
})

export const{useSendPaymentMutation, useGetPaymentsQuery}= PaymentApiSlice;