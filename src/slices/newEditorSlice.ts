import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { readString } from "react-papaparse";
import { AppThunk, RootState } from "../store";

import { mapWorkspaceResponse, mapAirtableResponse } from "../libs/mapResponseToState";
import { sleep } from "../libs/useSleep";
import { hasPromptVariables, makeKeywordPattern, splitRegExp } from "../libs/useKeyword";
import { Record } from "airtable";
import AirtableError from "airtable/lib/airtable_error";
import { AxiosError } from "axios";

import GptAPI from "../services/GptAPI";
import RestAPI from "../services/RestAPI";
import AirtableAPI from "../services/AirtableAPI";
import {
    NewCompletionParameters,
    ChoiceResult,
    NewWorkspace,
    NewEditorState,
    CompletionError
} from "../common/interfaces";

const initialState: NewEditorState = {
    currentWorkspaceId: undefined,
    workspaces: [],
    choiceResults: []
}

const newEditorSlice = createSlice({
    name: "newEditor",
    initialState,
    reducers: {
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
            const parsedResult = readString(action.payload);
            if (workspace && parsedResult.errors.length === 0) {
                workspace.keywords = parsedResult.data as string[][];
            }
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            const workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            workspace.loading = action.payload;
        }
    }
});

const fetchWorkspacesAsync = (): AppThunk => (dispatch, getState) => {
    RestAPI.getWorkspaces().then(response => {
        const workspaces = mapWorkspaceResponse(response.data);
        if (workspaces.length > 0) {
            dispatch(setWorkspaces(workspaces));
            dispatch(updateWorkspaceId(workspaces[0].id));
            console.log(workspaces);
        }
    }).catch(error => {
        alert("API returned an error. Refer to the console to inspect it.")
        console.log(error.response);
    });
};

const fetchBasicOutputAsync = (): AppThunk => (dispatch, getState) => {
    let timerHandler: NodeJS.Timeout;
    const state = getState();
    const workspace = selectWorkspace(state);
    const choiceResults = selectChoiceResults(state);
    let errors = Array<CompletionError>();
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
    let completionParamsIndex = 0;
    dispatch(setChoiceResults([]));
    dispatch(setLoading(false));

    const loopFunction: Function = async (delay: number = 5000) => {
        timerHandler = setTimeout(async () => {
            if (completionParamsIndex < completionParams.length) {
                const completionParam = completionParams[completionParamsIndex];
                try {
                    const res = await GptAPI.generateCompletions(completionParam.prompt, completionParam, workspace.model.value, completionParam.n);
                    AirtableAPI.configure({
                        apiKey: completionParam.airtableApiKey,
                        baseName: completionParam.airtableBase,
                        tableName: completionParam.airtableTable
                    });
                    console.log(res.data);
                    console.log(`main block => ${completionParamsIndex}`);
                    await dispatch(appendChoiceResults(res.data.choices));
                    const record: Record<any> = await AirtableAPI.create(res.data.choices, completionParam.category, completionParam.airtableName || 'Variable Name');
                    console.log(record.id);
                    errors = Array<CompletionError>();
                    completionParamsIndex++;
                    loopFunction(5000);
                } catch (err) {
                    let _delay = 30000;
                    const axiosError = err as AxiosError;
                    const airtableError = err as AirtableError;

                    if (axiosError.isAxiosError) {
                        errors.push({
                            index: completionParamsIndex,
                            message: axiosError.message,
                            statusCode: axiosError.response?.status,
                            error: axiosError.response?.statusText
                        });
                        const errors4XX = errors.filter(e => e.index === completionParamsIndex).filter((e) => e.statusCode || 0 >= 400);
                        if (errors4XX.filter(e => e.statusCode === axiosError.response?.status).length > 1) {
                            clearTimeout(timerHandler);
                            return;
                        } else if (errors4XX.length == 1)  {
                            _delay = 30000;
                            console.log("detected a new 4XX error. --first");
                        } else {
                            _delay = 45000;
                            console.log("detected a new 4XX error. --second");
                        }
                        
                        loopFunction(_delay);
                    } else if (airtableError.error) {
                        errors.push({
                            index: completionParamsIndex,
                            message: airtableError.message,
                            error: airtableError.error,
                            statusCode: airtableError.statusCode
                        });
                        const errors4XX = errors.filter(e => e.index === completionParamsIndex).filter((e) => e.statusCode || 0 >= 400);
                        console.log(errors4XX);
                        if (errors4XX.filter(e => e.statusCode === airtableError.statusCode).length > 1) {
                            console.log("cleared a timeout")
                            clearTimeout(timerHandler);
                            return;
                        } else if (errors4XX.length == 1)  {
                            _delay = 30000;
                            console.log("detected a new 4XX error. --first");
                        } else {
                            _delay = 45000;
                            console.log("detected a new 4XX error. --second");
                        }

                        console.log(_delay);
                        loopFunction(_delay);
                    }
                }
                
            } else {
                await dispatch(setLoading(true));
            }
        }, delay);
    }
    loopFunction(0);
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
                            variables[property] = workspace[property].replace(keywordRegExp, keyword);
                    }
                });
            });
        variablesBatch.push(variables);
    });
    const updatedWorkspaces: NewWorkspace[] = variablesBatch.map(variables => {
        return {
            ...workspace,
            ...variables
        };
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
                bestOf: Number(workspace.bestOf),
                presencePenalty: Number(workspace.presencePenalty),
                frequencyPenalty: Number(workspace.frequencyPenalty),
                airtableApiKey: workspace.airtableApiKey,
                airtableBase: workspace.airtableBase,
                airtableTable: workspace.airtableTable,
                airtableName: workspace.airtableName,
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