import { apiSlice } from "../../app/api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: "/api/auth/login",
                method: 'POST',
                body: { ...credentials }
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/api/auth/logout",
                method: 'POST',
                credentials: "include",
            }),
        }),
    })
});

export const {
    useLoginMutation,
    useLogoutMutation
} = authApiSlice;