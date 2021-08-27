import { Airtable, CustomModel, NewWorkspace } from "../common/interfaces";

interface WorkspaceResponse {
    id: number;
    name: string;
    temperature: string,
    max_tokens: string,
    top_p: string,
    n: string,
    presence_penalty: string;
    frequency_penalty: string;
    stop_symbols: Array<string>;
    prompt: string;
    custom_model: CustomModel;
    category: string;
    airtable_base: string;
    airtable_table: string;
    airtable_api_key: string;
}

interface AirtableResponse {
    api_key: string;
    base: string;
    category: string;
    table: string;
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
            keywords: [],
            loading: false,
            category: item.category,
            airtableApiKey: item.airtable_api_key,
            airtableBase: item.airtable_base,
            airtableTable: item.airtable_table
        };

        return workspace;
    });

    return workspaces;
}

export function mapAirtableResponse(response: AirtableResponse): Airtable {
    const airtable: Airtable = {
        apiKey: response.api_key,
        base: response.base,
        category: response.category,
        table: response.table
    };

    return airtable;
}