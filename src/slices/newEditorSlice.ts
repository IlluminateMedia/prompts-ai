import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from "../store";

import { mapWorkspaceResponse } from "../libs/mapResponseToState";
import { hasPromptVariables, variableRegExp } from "../libs/useKeyword";
import GptAPI, { ChoiceResult } from "../services/GptAPI";
import RestAPI from "../services/RestAPI";
import {
    Airtable,
    CompletionParameters,
    NewWorkspace, NewEditorState
} from "../common/interfaces";

const initialState: NewEditorState = {
    airtable: undefined,
    currentWorkspaceId: undefined,
    workspaces: []
}

const newEditorSlice = createSlice({
    name: 'newEditor',
    initialState,
    reducers: {
        setAirtable: (state, action: PayloadAction<Airtable>) => {
            state.airtable = action.payload;
        },
        updateWorkspaceId: (state, action: PayloadAction<number>) => {
            state.currentWorkspaceId = action.payload;
        },
        setWorkspaces: (state, action: PayloadAction<Array<NewWorkspace>>) => {
            state.workspaces = action.payload;
        },
        loadKeywords: (state, action: PayloadAction<string>) => {
            const workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId);
            if (workspace) {
                workspace.keywords = action.payload.split("\n").map(batch => batch.split(","));
            }
            console.log(state.workspaces[0].keywords);
        },
    }
});

const fetchAirtableAsync = (): AppThunk => (dispatch, getState) => {

};

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

const fetchBasicOutputAsync = (): AppThunk => (dispatch, getState) => {
    const state = getState();
    const workspace = selectWorkspace(state);
    if (!workspace) {
        return;
    }

    if (state.editor.present.apiKey === undefined) {
        alert('Enter an Openai API key before running requests.');
        return;
    }

    if (workspace.prompt.length === 0) {
        alert("The prompt can't be empty");
        return;
    }

    if (workspace.keywords.length === 0) {
        alert('Please upload a valid *.csv file');
        return;
    }

    if (!hasPromptVariables(workspace.prompt)) {
        alert('Enter at least one example or please upload a valid *.csv file');
        return;
    }

    const completionParams = selectCompletionParameters(state);
    completionParams.map(completionParam => {
        GptAPI.generateCompletions(completionParam.prompt, completionParam, workspace.model.value, 10).then(response => {
            console.log(response.data);
            return { ...response.data };
        }).then(response => {
            console.log(response.choices);
            // const choiceResult = response.choices[0] as ChoiceResult;
            // const choiceResult = (response.choices.find((c: any) => c.text !== "") || response.choices[0]) as ChoiceResult;
            // dispatch(appendBasicOutput(choiceResult.text));
        }).catch(error => {
            alert('API returned an error. Refer to the console to inspect it.')
            console.log(error.response);
        }).finally(() => {
            
        });
    });
};

const selectAirtable = (state: RootState) => state.newEditor.airtable;
const selectCurrentWorkspaceId = (state: RootState) => state.newEditor.currentWorkspaceId;
const selectWorkspace = (state: RootState) => state.newEditor.workspaces.find(w => w.id === state.newEditor.currentWorkspaceId);
const selectWorkspaces = (state: RootState) => state.newEditor.workspaces;
const selectCompletionParameters = (state: RootState) => {
    const workspace = state.newEditor.workspaces.find(w => w.id === state.newEditor.currentWorkspaceId)!;
    const completionParameters: CompletionParameters[] = workspace.keywords.map(batch => {
        let prompt = workspace.prompt;
        batch.map(k => prompt = prompt.replace(variableRegExp, k));
        return {
            apiKey: state.editor.present.apiKey === undefined ? '' : state.editor.present.apiKey,
            engine: workspace.model.value,
            maxTokens: workspace.maxTokens,
            stop: (() => {
                if (workspace.stopSymbols.length > 0) {
                    return workspace.stopSymbols.map(symbol => {
                        return symbol.split('\\n').join('\n');
                    });
                } else {
                    return '';
                }
            })(),
            prompt,
            temperature: workspace.temperature,
            topP: workspace.topP,
            presencePenalty: workspace.presencePenalty,
            frequencyPenalty: workspace.frequencyPenalty,
        };
    });
    return completionParameters;
};

// Exports

export default newEditorSlice.reducer;
export { newEditorSlice };

// Selectors

export {
    selectAirtable, selectCurrentWorkspaceId, selectWorkspace, selectWorkspaces, selectCompletionParameters
}

// Async Actions

export {
    fetchAirtableAsync, fetchWorkspacesAsync, fetchBasicOutputAsync
}

// Actions

export const {
    setAirtable, updateWorkspaceId, setWorkspaces, loadKeywords
} = newEditorSlice.actions;