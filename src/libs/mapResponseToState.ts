import { CustomModel, NewWorkspace } from "../common/interfaces";

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

export function mapWorkspaceResponse(response: Array<WorkspaceResponse>): Array<NewWorkspace> {
    const workspaces: Array<NewWorkspace> = response.map((item) => {
        const workspace: NewWorkspace = {
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
            model: item.custom_model,
            keywords: []
        };

        return workspace;
    });

    return workspaces;
}