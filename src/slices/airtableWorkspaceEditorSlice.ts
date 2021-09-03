import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../store";

import {
    AirtableWorkspace,
    AirtableWorkspaceEditorState
} from "../common/interfaces";
import RestAPI from "../services/RestAPI";
import { mapAirtableWorkspaceResponse } from "../libs/mapResponseToState";

const initialState: AirtableWorkspaceEditorState = {
    currentAirtableWorkspaceId: undefined,
    airtableWorkspaces: []
};

const airtableWorkspaceEditorSlice = createSlice({
    name: "airtableWorkspace",
    initialState,
    reducers: {
        setAirtableWorkspaces: (state, action: PayloadAction<Array<AirtableWorkspace>>) => {
            state.airtableWorkspaces = action.payload;
        },
        setCurrentAirtableWorkspaceId: (state, action: PayloadAction<number>) => {
            state.currentAirtableWorkspaceId = action.payload;
        }
    }
});

const fetchAirtableWorkspacesAsync = (): AppThunk => (dispatch, getState) => {
    RestAPI.getAirtableWorkspaces().then(response => {
        const airtableWorkspaces = mapAirtableWorkspaceResponse(response.data);
        dispatch(setAirtableWorkspaces(airtableWorkspaces));
    })
};

const selectAirtableWorkspaces = (state: RootState) => state.airtableWorkspace.airtableWorkspaces;
const selectCurrentAirtableWorkspaceId = (state: RootState) => state.airtableWorkspace.currentAirtableWorkspaceId;
const selectCurrentAirtableWorkspace = (state: RootState) => state.airtableWorkspace.airtableWorkspaces.find((aw) => aw.id === state.airtableWorkspace.currentAirtableWorkspaceId);

// Exports

export default airtableWorkspaceEditorSlice.reducer;
export { airtableWorkspaceEditorSlice };

// Selectors
export { selectAirtableWorkspaces, selectCurrentAirtableWorkspace, selectCurrentAirtableWorkspaceId };

// Async Actions
export { fetchAirtableWorkspacesAsync };

// Actions

export const {
    setAirtableWorkspaces
} = airtableWorkspaceEditorSlice.actions;