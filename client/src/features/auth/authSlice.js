import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    accessToken: null,
    user: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.user = action.payload.user;
        },
        logOut: (state) => {
            state.accessToken = null;
            state.user = null;
        }
    }
});

export const { 
    setCredentials,
    logOut
} = authSlice.actions;

export default authSlice.reducer;

// selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.accessToken;