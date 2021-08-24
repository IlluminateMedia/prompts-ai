import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from "../store";

import RestAPI from "../services/RestAPI";
import {
    AuthState,
    SignInParameters,
    JWTTokens,
} from "../common/interfaces";

const initialState: AuthState = {
    jwtTokens: undefined
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setJwtTokens: (state, action: PayloadAction<JWTTokens | undefined>) => {
            state.jwtTokens = action.payload;
        }
    }
});

const signInAsync = (signInParams: SignInParameters): AppThunk => (dispatch, getState) => {
    RestAPI.getJWTTokens(signInParams).then(response => {
        dispatch(setJwtTokens(response.data as JWTTokens));
    }).catch(error => {
        dispatch(setJwtTokens(undefined));
        alert('API returned an error. Refer to the console to inspect it.')
        console.log(error.response);
    });
};

const selectAccessToken = (state: RootState) => state.auth.jwtTokens?.access;
const selectRefreshToken = (state: RootState) => state.auth.jwtTokens?.refresh;

// Exports

export default authSlice.reducer;
export { authSlice };

// Selectors

export {
    selectAccessToken, selectRefreshToken
}

// Async Actions

export {
    signInAsync
}

// Actions

export const {
    setJwtTokens
} = authSlice.actions;