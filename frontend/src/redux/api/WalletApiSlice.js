import apiSlice from "./apiSlice.js";
import { ACCOUNT_URL } from "../constant.js";

export const WalletApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addAccount: builder.mutation({
            query: (data) => ({
                url: `${ACCOUNT_URL}/addAccount`,
                method: 'POST',
                body: data,
            })
        }),
        getAccounts: builder.query({
            query: () => ({
                url: `${ACCOUNT_URL}/getAccounts`,
                transformResponse: (response) => {
                    console.log("API Response:", response);
                    return response?.data || []; // Ensure `data` exists
                },
            })
        })
    })
})

export const { useAddAccountMutation, useGetAccountsQuery } = WalletApiSlice;