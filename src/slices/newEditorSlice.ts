import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from "../store";

import { mapWorkspaceResponse } from "../libs/mapResponseToState";
import RestAPI from "../services/RestAPI";
import {
    NewEditorState, NewWorkspace
} from "../common/interfaces";

const initialState: NewEditorState = {
    airtableApiKey: undefined,
    currentWorkspaceId: undefined,
    workspaces: []
}

const newEditorSlice = createSlice({
    name: 'newEditor',
    initialState,
    reducers: {
        setAirtableApiKey: (state, action: PayloadAction<string>) => {
            state.airtableApiKey = action.payload;
        },
        updateWorkspaceId: (state, action: PayloadAction<number>) => {
            state.currentWorkspaceId = action.payload;
        },
        setWorkspaces: (state, action: PayloadAction<Array<NewWorkspace>>) => {
            state.workspaces = action.payload;
        }
    }
});

const fetchWorkspacesAsync = (): AppThunk => (dispatch, getState) => {
    RestAPI.getWorkspaces().then(response => {
        const workspaces = mapWorkspaceResponse(response.data);
        if (workspaces.length > 0) {
            dispatch(setWorkspaces(workspaces));
            dispatch(updateWorkspaceId(workspaces[0].id));
        }
    }).catch(error => {
        alert('API returned an error. Refer to the console to inspect it.')
        console.log(error.response);
    });
};

const selectAirtableApiKey = (state: RootState) => state.newEditor.airtableApiKey;
const selectCurrentWorkspaceId = (state: RootState) => state.newEditor.currentWorkspaceId;
const selectWorkspace = (state: RootState) => state.newEditor.workspaces.find(w => w.id === state.newEditor.currentWorkspaceId);
const selectWorkspaces = (state: RootState) => state.newEditor.workspaces;

// Exports

export default newEditorSlice.reducer;
export { newEditorSlice };

// Selectors

export {
    selectAirtableApiKey, selectCurrentWorkspaceId, selectWorkspace, selectWorkspaces
}

// Async Actions

export {
    fetchWorkspacesAsync
}

// Actions

export const {
    setAirtableApiKey, updateWorkspaceId, setWorkspaces
} = newEditorSlice.actions;