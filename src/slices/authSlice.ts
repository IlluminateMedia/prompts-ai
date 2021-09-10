import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from "../store";

import RestAPI from "../services/RestAPI";
import {
    AuthState,
    SignInParameters,
    JWTTokens,
    User
} from "../common/interfaces";
import { mapUser } from "../libs/mapResponseToState";

const initialState: AuthState = {
    jwtTokens: undefined,
    user: undefined
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setJwtTokens: (state, action: PayloadAction<JWTTokens | undefined>) => {
            state.jwtTokens = action.payload;
        },
        setUser: (state, action: PayloadAction<User | undefined>) => {
            state.user = action.payload;
        }
    }
});

const signInAsync = (signInParams: SignInParameters): AppThunk => (dispatch, getState) => {
    RestAPI.getJWTTokens(signInParams).then(response => {
        const data = response.data as JWTTokens
        dispatch(setJwtTokens(data));
        dispatch(getUserAsync(data.access));
    }).catch(error => {
        dispatch(setJwtTokens(undefined));
        alert('API returned an error. Refer to the console to inspect it.')
        console.log(error.response);
    });
};

const getUserAsync = (access: string): AppThunk => (dispatch, getState) => {
    RestAPI.getUser(access).then(response => {
        const user = mapUser(response.data);
        dispatch(setUser(user));
    }).catch(error => {
        dispatch(setUser(undefined));
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
    signInAsync, getUserAsync
}

// Actions

export const {
    setJwtTokens, setUser
} = authSlice.actions;