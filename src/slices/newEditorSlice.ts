import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from "../store";

import { mapWorkspaceResponse, mapAirtableResponse } from "../libs/mapResponseToState";
import { hasPromptVariables, makeKeywordPattern, variableRegExp, splitRegExp } from "../libs/useKeyword";
import Airtable, { Record } from 'airtable';
import AirtableError from 'airtable/lib/airtable_error';

import GptAPI from "../services/GptAPI";
import RestAPI from "../services/RestAPI";
import AirtableAPI from "../services/AirtableAPI";
import {
    NewCompletionParameters,
    ChoiceResult,
    NewWorkspace,
    NewEditorState
} from "../common/interfaces";

const initialState: NewEditorState = {
    currentWorkspaceId: undefined,
    workspaces: [],
    choiceResults: []
}

const newEditorSlice = createSlice({
    name: 'newEditor',
    initialState,
    reducers: {
        // setAirtable: (state, action: PayloadAction<Airtable>) => {
        //     state.airtable = action.payload;
        //     AirtableAPI.configure({
        //         apiKey: state.airtable.apiKey,
        //         baseName: state.airtable.base,
        //         tableName: state.airtable.table
        //     });
        // },
        setChoiceResults: (state, action: PayloadAction<ChoiceResult[][]>) => {
            state.choiceResults = action.payload;
        },
        appendChoiceResults: (state, action: PayloadAction<Array<ChoiceResult>>) => {
            state.choiceResults.push(action.payload);
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
                workspace.keywords = action.payload.split("\n").map(batch => batch.split(splitRegExp).filter(w => w !== ""));
            }
            console.log(state.workspaces[0].keywords);
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            const workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            workspace.loading = action.payload;
        }
    }
});

// const fetchAirtableAsync = (): AppThunk => (dispatch, getState) => {
//     RestAPI.getAirtable().then(response => {
//         dispatch(setAirtable(mapAirtableResponse(response.data)));
//     }).catch(error => {
//         alert("API returned an error. Refer to the console to inspect it.");
//         console.log(error.response);
//     })
// };

const fetchWorkspacesAsync = (): AppThunk => (dispatch, getState) => {
    RestAPI.getWorkspaces().then(response => {
        const workspaces = mapWorkspaceResponse(response.data);
        console.log(workspaces);
        if (workspaces.length > 0) {
            dispatch(setWorkspaces(workspaces));
            dispatch(updateWorkspaceId(workspaces[0].id));
        }
    }).catch(error => {
        alert("API returned an error. Refer to the console to inspect it.")
        console.log(error.response);
    });
};

const storeAirtableAsync = (
        choiceResults: Array<ChoiceResult>,
        category: string, 
        variableName: string
    ): AppThunk => (dispatch, getState) => {
        AirtableAPI.create(choiceResults, category, variableName).then((record: Record<any>) => {
            console.log(record.id);
        }).catch((error: AirtableError) => {
            console.log(error);
        });
};

const fetchBasicOutputAsync = (): AppThunk => (dispatch, getState) => {
    const state = getState();
    const workspace = selectWorkspace(state);
    const choiceResults = selectChoiceResults(state);
    if (!workspace) {
        alert("Workspaces are not loaded.");
        return;
    }

    if (state.editor.present.apiKey === undefined) {
        alert("Enter an Openai API key before running requests.");
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
    console.log(completionParams);
    dispatch(setChoiceResults([]));
    dispatch(setLoading(false));

    completionParams.map(completionParam => {
        GptAPI.generateCompletions(completionParam.prompt, completionParam, workspace.model.value, completionParam.n).then(response => {
            console.log(response.data);
            return { ...response.data };
        }).then(response => {
            console.log(response.choices);
            AirtableAPI.configure({
                apiKey: completionParam.airtableApiKey,
                baseName: completionParam.airtableBase,
                tableName: completionParam.airtableTable
            });
            dispatch(appendChoiceResults(response.choices));
            dispatch(storeAirtableAsync(response.choices, completionParam.category, completionParam.variableName || 'Variable Name'));
        }).catch(error => {
            alert("API returned an error. Refer to the console to inspect it.");
            console.log(error.response);
        }).finally(() => {
            if (workspace.keywords.length === choiceResults.length) {
                dispatch(setLoading(true));
            }
        });
    });
};

const selectCurrentWorkspaceId = (state: RootState) => state.newEditor.currentWorkspaceId;
const selectWorkspace = (state: RootState) => state.newEditor.workspaces.find(w => w.id === state.newEditor.currentWorkspaceId);
const selectWorkspaces = (state: RootState) => state.newEditor.workspaces;
const selectChoiceResults = (state: RootState) => state.newEditor.choiceResults;
const selectCompletionParameters = (state: RootState) => {
    const workspace = state.newEditor.workspaces.find(w => w.id === state.newEditor.currentWorkspaceId)!;
    const variablesBatch: { [key: string]: any }[] = [];
    workspace.keywords.map(batch => {
        const variables: { [key: string]: any } = {};
            batch.forEach((keyword, i) => {
                const keywordRegExp = new RegExp(makeKeywordPattern(i + 1), "i");
                Object.keys(workspace).map(property => {
                    if (typeof workspace[property] === "string" &&
                        keywordRegExp.test(workspace[property])) {
                            console.log(keywordRegExp);
                            console.log(keyword);
                            variables[property] = workspace[property].replace(keywordRegExp, keyword);
                        
                        if (property === "prompt") {
                            variables["variableName"] = keyword;
                        }
                    }
                });
            });
        variablesBatch.push(variables);
    });
    let updatedWorkspaces: NewWorkspace[] = variablesBatch.map(variables => {
        return {
            ...workspace,
            ...variables
        }
    });

    const completionParameters: NewCompletionParameters[] = updatedWorkspaces.map(workspace => {
        return {
                apiKey: state.editor.present.apiKey === undefined ? '' : state.editor.present.apiKey,
                engine: workspace.model.value,
                maxTokens: Number(workspace.maxTokens),
                stop: (() => {
                    if (workspace.stopSymbols.length > 0) {
                        return workspace.stopSymbols.map((symbol: string) => {
                            return symbol.split('\\n').join('\n');
                        });
                    } else {
                        return '';
                    }
                })(),
                n: Number(workspace.n),
                prompt: workspace.prompt,
                temperature: Number(workspace.temperature),
                topP: Number(workspace.topP),
                presencePenalty: Number(workspace.presencePenalty),
                frequencyPenalty: Number(workspace.frequencyPenalty),
                airtableApiKey: workspace.airtableApiKey,
                airtableBase: workspace.airtableBase,
                airtableTable: workspace.airtableTable,
                variableName: workspace.variableName,
                category: workspace.category,
        }
    });

    return completionParameters;
};

// Exports

export default newEditorSlice.reducer;
export { newEditorSlice };

// Selectors

export {
    selectCurrentWorkspaceId, selectWorkspace, selectWorkspaces, selectCompletionParameters, selectChoiceResults,
}

// Async Actions

export {
    fetchWorkspacesAsync, fetchBasicOutputAsync
}

// Actions

export const {
    updateWorkspaceId, setWorkspaces, loadKeywords,
    setChoiceResults, appendChoiceResults, setLoading
} = newEditorSlice.actions;