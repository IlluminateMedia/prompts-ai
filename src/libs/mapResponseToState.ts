import uniqid from "uniqid";

import { CustomModel, Workspace } from "../common/interfaces";

interface WorkspaceResponse {
    id: number;
    name: string;
    temperature: number,
    max_tokens: number,
    top_p: number,
    n: number,
    presence_penalty: number,
    frequency_penalty: number,
    stop_symbols: Array<string>,
    prompt: string,
    custom_model: CustomModel
}

export function mapWorkspaceResponse(response: Array<WorkspaceResponse>): void {
    // const workspaces: Array<Workspace> = [];
    const workspaces: Array<Workspace> = response.map((item) => {
        const workspace: Workspace = {
            id: item.id,
            name: item.name,
            prompt: item.prompt,
            temperature: item.temperature,
            maxTokens: item.max_tokens,
            topP: item.top_p,
            n: item.n,
            frequencyPenalty: item.frequency_penalty,
            presencePenalty: item.presence_penalty,
            stopSymbols: item.stop_symbols,
            tabIndex: 0,
            customModel: item.custom_model,
            showExamplePreviousOutputs: false,
            examples: [
                {id: uniqid("input_"), text: "We all eat the fish and then made dessert.", output: "We all ate the fish and then made dessert.", isLoading: false},
                {id: uniqid("input_"), text: "I like ski every day.", output: "I like skiing every day.", isLoading: false},
            ],

            loadingVariations: false,
            variations: [],
            maxVariations: 10,
            showPromptForVariations: true,

            conversations: [],

            basic: {
                output: '',
                loading: false,
            },
        };

        return workspace;
    })
}