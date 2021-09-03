import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../store";

import {
    AirtableWorkspace,
    AirtableWorkspaceEditorState,
    LoadedAirtableData,
    PairOfAirtableWorkspaceIdAndRecordId
} from "../common/interfaces";
import RestAPI from "../services/RestAPI";
import mapLoadedAirtableRecords, { mapAirtableWorkspaceResponse } from "../libs/mapResponseToState";
import AirtableAPI from "../services/AirtableAPI";

const initialState: AirtableWorkspaceEditorState = {
    currentAirtableWorkspaceId: undefined,
    airtableWorkspaces: [],
    dicOfAirtableWorkspaceIdToRecordId: [],
    loadedAirtableData: []
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
        },
        updateDicOfAirtableWorkspaceIdToRecordId: (state, action: PayloadAction<PairOfAirtableWorkspaceIdAndRecordId>) => {
            const index = state.dicOfAirtableWorkspaceIdToRecordId.findIndex((item) => item.airtableWorkspaceId === action.payload.airtableWorkspaceId);
            if (index !== -1) {
                state.dicOfAirtableWorkspaceIdToRecordId[index] = action.payload;
            } else {
                state.dicOfAirtableWorkspaceIdToRecordId.push(action.payload);
            }
        },
        updateLoadedAirtableData: (state, action: PayloadAction<LoadedAirtableData>) => {
            const index = state.loadedAirtableData.findIndex((item) => item.airtableWorkspaceId === action.payload.airtableWorkspaceId);
            if (index !== -1) {
                state.loadedAirtableData[index] = action.payload;
            } else {
                state.loadedAirtableData = [
                    ...state.loadedAirtableData,
                    action.payload
                ];
            }
        }
    }
});

const fetchAirtableWorkspacesAsync = (): AppThunk => (dispatch, getState) => {
    RestAPI.getAirtableWorkspaces().then(response => {
        const airtableWorkspaces = mapAirtableWorkspaceResponse(response.data);
        if (airtableWorkspaces.length > 0) {
            dispatch(setAirtableWorkspaces(airtableWorkspaces));
            dispatch(setCurrentAirtableWorkspaceId(airtableWorkspaces[0].id));
            airtableWorkspaces.forEach((airtableWorkspace) => {
                dispatch(fetchAirtableDataAsync(airtableWorkspace));
            });
        }
    })
};

const fetchAirtableDataAsync = (airtableWorkspace: AirtableWorkspace): AppThunk => (dispatch, getState) => {
    AirtableAPI.configure({
        apiKey: airtableWorkspace.apiKey,
        baseName: airtableWorkspace.sourceBase,
        tableName: airtableWorkspace.sourceTable
    });
    AirtableAPI.fetch().then(records => {
        const loadedRecords = records.map((record) => {
            return {
                id: record.id,
                ...record.fields
            };
        });
        if (loadedRecords.length > 0) {
            dispatch(
                updateLoadedAirtableData({
                    airtableWorkspaceId: airtableWorkspace.id,
                    records: mapLoadedAirtableRecords(loadedRecords)
                })
            );
            dispatch(
                updateDicOfAirtableWorkspaceIdToRecordId({
                    airtableWorkspaceId: airtableWorkspace.id,
                    recordId: loadedRecords[0].id
                })
            );
        }
    })
    .catch(err => {
        console.log(err);
    })
};

const selectAirtableRecords = (state: RootState) => state.airtableWorkspace.loadedAirtableData.find(item => item.airtableWorkspaceId === state.airtableWorkspace.currentAirtableWorkspaceId)?.records || [];
const selectAirtableFields = (state: RootState) => {
    const currentAirtableWorkspaceId = state.airtableWorkspace.currentAirtableWorkspaceId;
    const records = state.airtableWorkspace.loadedAirtableData.find((item) => item.airtableWorkspaceId === currentAirtableWorkspaceId)?.records || [];
    const selectRecordId = state.airtableWorkspace.dicOfAirtableWorkspaceIdToRecordId.find(item => item.airtableWorkspaceId === currentAirtableWorkspaceId)?.recordId
    const selectRecord = records.find(r => r.id === selectRecordId);
    if (selectRecord) {

    }
    return selectRecord;
}
const selectAirtableWorkspaces = (state: RootState) => state.airtableWorkspace.airtableWorkspaces;
const selectCurrentAirtableWorkspaceId = (state: RootState) => state.airtableWorkspace.currentAirtableWorkspaceId;
const selectCurrentAirtableWorkspace = (state: RootState) => state.airtableWorkspace.airtableWorkspaces.find(item => item.id === state.airtableWorkspace.currentAirtableWorkspaceId);

// Exports

export default airtableWorkspaceEditorSlice.reducer;
export { airtableWorkspaceEditorSlice };

// Selectors
export { selectAirtableWorkspaces, selectCurrentAirtableWorkspace, selectCurrentAirtableWorkspaceId };

// Async Actions
export { fetchAirtableWorkspacesAsync, fetchAirtableDataAsync };

// Actions

export const {
    setAirtableWorkspaces, setCurrentAirtableWorkspaceId, updateLoadedAirtableData, updateDicOfAirtableWorkspaceIdToRecordId
} = airtableWorkspaceEditorSlice.actions;