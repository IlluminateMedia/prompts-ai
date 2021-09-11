import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../store";

import {
    AirtableWorkspace,
    AirtableWorkspaceEditorState,
    AirtableSubmitStatus,
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
    loadedAirtableData: [],
    finalArticles: [],
    airtableSubmitStatus: []
};

const airtableWorkspaceEditorSlice = createSlice({
    name: "airtableWorkspace",
    initialState,
    reducers: {
        setAirtableWorkspaces: (state, action: PayloadAction<Array<AirtableWorkspace>>) => {
            state.airtableWorkspaces = action.payload;
        },
        setAirtableSumbitStatus: (state, action: PayloadAction<Array<AirtableSubmitStatus>>) => {
            state.airtableSubmitStatus = action.payload;
        },
        setCurrentAirtableWorkspaceId: (state, action: PayloadAction<number>) => {
            state.currentAirtableWorkspaceId = action.payload;
        },
        updateFinalArticle: (state, action: PayloadAction<string | undefined>) => {
            const currentAirtableWorkspaceId = state.currentAirtableWorkspaceId;
            const index = state.finalArticles.findIndex((item) => item.airtableWorkspaceId === currentAirtableWorkspaceId);
            console.log(action.payload);
            if (index !== -1) {
                state.finalArticles[index] = {
                    airtableWorkspaceId: currentAirtableWorkspaceId!,
                    article: action.payload
                };
            } else if (currentAirtableWorkspaceId) {
                state.finalArticles = [
                    ...state.finalArticles,
                    {
                        airtableWorkspaceId: currentAirtableWorkspaceId,
                        article: action.payload
                    }
                ];
            }
        },
        updateDicOfAirtableWorkspaceIdToRecordId: (state, action: PayloadAction<PairOfAirtableWorkspaceIdAndRecordId>) => {
            const index = state.dicOfAirtableWorkspaceIdToRecordId.findIndex((item) => item.airtableWorkspaceId === action.payload.airtableWorkspaceId);
            if (index !== -1) {
                state.dicOfAirtableWorkspaceIdToRecordId[index] = action.payload;
            } else {
                state.dicOfAirtableWorkspaceIdToRecordId = [
                    ...state.dicOfAirtableWorkspaceIdToRecordId,
                    action.payload
                ];
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
        },
        updateAirtableSubmitStatus: (state, action: PayloadAction<AirtableSubmitStatus>) => {
            const index = state.airtableSubmitStatus.findIndex((item) => item.airtableWorkspaceId === action.payload.airtableWorkspaceId);
            if (index !== -1) {
                state.airtableSubmitStatus[index] = action.payload;
            } else {
                state.airtableSubmitStatus = [
                    ...state.airtableSubmitStatus,
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
            const airtableSubmitStatus: Array<AirtableSubmitStatus> = airtableWorkspaces.map(a => {
                return {
                    airtableWorkspaceId: a.id,
                    isRunning: false
                };
            });
            airtableWorkspaces.forEach((airtableWorkspace) => {
                dispatch(fetchAirtableDataAsync(airtableWorkspace));
            });
            dispatch(setAirtableSumbitStatus(airtableSubmitStatus));
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
            const records = mapLoadedAirtableRecords(loadedRecords);
            if (records.length > 0) {
                dispatch(
                    updateLoadedAirtableData({
                        airtableWorkspaceId: airtableWorkspace.id,
                        records
                    })
                );
                dispatch(
                    updateDicOfAirtableWorkspaceIdToRecordId({
                        airtableWorkspaceId: airtableWorkspace.id,
                        recordId: records[0].id
                    })
                );
                dispatch(updateReviewAsync(records[0].id));
            }
        }
    })
    .catch(err => {
        console.log(err);
    })
};

const updateReviewAsync = (recordId: string): AppThunk => (dispatch, getState) => {
    const state = getState();
    const currentAirtableWorkspace = selectCurrentAirtableWorkspace(state);
    if (!currentAirtableWorkspace) {
        alert("Something went wrong!");
        return;
    }
    AirtableAPI.updateReviewField(recordId, currentAirtableWorkspace)
    .then(response => {
        console.log(`Review ${response.id}`);
    }).catch(error => {
        alert('Airtable API returned an error. Refer to the console to inspect it.')
        console.log(error);
    });
}

const updateSubmitAsync = (recordId: string): AppThunk => (dispatch, getState) => {
    const state = getState();
    const currentAirtableWorkspace = selectCurrentAirtableWorkspace(state);
    if (!currentAirtableWorkspace) {
        alert("Something went wrong!");
        return;
    }
    AirtableAPI.updateSubmitField(recordId, currentAirtableWorkspace)
    .then(response => {
        console.log(`Submit ${response.id}`);
    }).catch(error => {
        alert('Airtable API returned an error. Refer to the console to inspect it.')
        console.log(error);
    });
}

const storeFinalSelectionAsync = (): AppThunk => (dispatch, getState) => {
    const state = getState();
    const user = state.auth.user;
    const finalArticle = selectFinalArticle(state);
    const currentAirtableWorkspace = selectCurrentAirtableWorkspace(state);
    const currentAirtableWorkspaceId = selectCurrentAirtableWorkspaceId(state);
    const airtableRecords = selectAirtableRecords(state);
    const airtableRecord = selectAirtableRecord(state);
    const airtableRecordId = selectAirtableRecordId(state);

    if (!(finalArticle && currentAirtableWorkspace && currentAirtableWorkspaceId && airtableRecord)) {
        alert("Something went wrong!");
        return;
    }
    if (!finalArticle.article) {
        alert("Final selection can't be null");
        return;
    }
    dispatch(updateAirtableSubmitStatus({
        airtableWorkspaceId: currentAirtableWorkspaceId,
        isRunning: true
    }));
    
    AirtableAPI.storeFinalSelection({
        articleGroup: airtableRecord.name,
        section: airtableRecord.category,
        article: finalArticle.article!,
        selectorUser: user!.name
    }, currentAirtableWorkspace)
    .then(record => {
        console.log(record.id);
        dispatch(updateSubmitAsync(airtableRecordId!));
    }).catch(error => {
        alert('API returned an error. Refer to the console to inspect it.')
        console.log(error);
    }).finally(() => {
        dispatch(updateAirtableSubmitStatus({
            airtableWorkspaceId: currentAirtableWorkspaceId,
            isRunning: false
        }));
        const currentRecordIndex = airtableRecords.findIndex(record => record.id === airtableRecordId);
        if (currentRecordIndex >= 0 && currentRecordIndex < airtableRecords.length - 1) {
            const newRecord = airtableRecords[currentRecordIndex + 1];
            dispatch(updateDicOfAirtableWorkspaceIdToRecordId({
                airtableWorkspaceId: currentAirtableWorkspaceId,
                recordId: newRecord.id
            }));
            dispatch(updateReviewAsync(newRecord.id));
            dispatch(updateFinalArticle(undefined));
        }
    })
};

const selectAirtableRecords = (state: RootState) => state.airtableWorkspace.loadedAirtableData.find(item => item.airtableWorkspaceId === state.airtableWorkspace.currentAirtableWorkspaceId)?.records || [];
const selectAirtableRecordId = (state: RootState) => state.airtableWorkspace.dicOfAirtableWorkspaceIdToRecordId.find(item => item.airtableWorkspaceId === state.airtableWorkspace.currentAirtableWorkspaceId)?.recordId;
const selectAirtableRecord = (state: RootState) => {
    const currentAirtableWorkspaceId = state.airtableWorkspace.currentAirtableWorkspaceId;
    const records = state.airtableWorkspace.loadedAirtableData.find((item) => item.airtableWorkspaceId === currentAirtableWorkspaceId)?.records || [];
    const selectRecordId = state.airtableWorkspace.dicOfAirtableWorkspaceIdToRecordId.find(item => item.airtableWorkspaceId === currentAirtableWorkspaceId)?.recordId
    const selectRecord = records.find(r => r.id === selectRecordId);
    // console.log(records);
    // console.log(selectRecordId);
    // console.log(selectRecord);
    
    return selectRecord;
}
const selectAirtableWorkspaces = (state: RootState) => state.airtableWorkspace.airtableWorkspaces;
const selectCurrentAirtableWorkspaceId = (state: RootState) => state.airtableWorkspace.currentAirtableWorkspaceId;
const selectCurrentAirtableWorkspace = (state: RootState) => state.airtableWorkspace.airtableWorkspaces.find(item => item.id === state.airtableWorkspace.currentAirtableWorkspaceId);
const selectFinalArticle = (state: RootState) => state.airtableWorkspace.finalArticles.find(a => a.airtableWorkspaceId === state.airtableWorkspace.currentAirtableWorkspaceId);
const selectIsRunning = (state: RootState) => state.airtableWorkspace.airtableSubmitStatus.find(item => item.airtableWorkspaceId === state.airtableWorkspace.currentAirtableWorkspaceId)?.isRunning;

// Exports

export default airtableWorkspaceEditorSlice.reducer;
export { airtableWorkspaceEditorSlice };

// Selectors
export {
    selectAirtableWorkspaces, selectCurrentAirtableWorkspace, selectCurrentAirtableWorkspaceId,
    selectAirtableRecord, selectAirtableRecords, selectFinalArticle, selectIsRunning
};

// Async Actions
export { fetchAirtableWorkspacesAsync, fetchAirtableDataAsync, storeFinalSelectionAsync, updateSubmitAsync };

// Actions

export const {
    setAirtableWorkspaces, setAirtableSumbitStatus, setCurrentAirtableWorkspaceId, updateLoadedAirtableData, updateDicOfAirtableWorkspaceIdToRecordId,
    updateFinalArticle, updateAirtableSubmitStatus
} = airtableWorkspaceEditorSlice.actions;