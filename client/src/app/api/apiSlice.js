import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "../../features/auth/authSlice";

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL;

// setup the baseQuery
const baseQuery = fetchBaseQuery({
    baseUrl: `${backendBaseURL}`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.accessToken;
        if(token){
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    }
})

// wrapper for baseQuery
const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 401 || result?.error?.status === 403) {
        console.log('sending refresh token');

        // send refresh token to get a new access token
        const refreshResult = await baseQuery('/api/auth/refresh-access-token', api, extraOptions);

        if(refreshResult?.data){
            const user = api.getState().auth.user;

            // store the new token
            api.dispatch(setCredentials({ ...refreshResult.data, user}));

            // retry the original query with new access token
            result = await baseQuery(args, api, extraOptions);
        }
        else{
            api.dispatch(logOut());
        }
    }
    return result;
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: bilder => ({})
});