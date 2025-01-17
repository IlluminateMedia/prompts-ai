import {
    Airtable,
    AirtableRecord,
    AirtableWorkspace,
    CustomModel,
    NewWorkspace,
    User
} from "../common/interfaces";

interface WorkspaceResponse {
    id: number;
    name: string;
    temperature: string,
    max_tokens: string,
    top_p: string,
    best_of: string,
    n: string,
    presence_penalty: string;
    frequency_penalty: string;
    stop_symbols: Array<string>;
    prompt: string;
    custom_model: CustomModel;
    category: string;
    airtable_base: string;
    airtable_table: string;
    airtable_name: string;
    airtable_api_key: string;
}

interface AirtableResponse {
    api_key: string;
    base: string;
    category: string;
    table: string;
}

interface AirtableWorkspaceResponse {
    id: number;
    api_key: string;
    source_base: string;
    source_table: string;
    destination_base: string;
    destination_table: string;
}

interface OrigainalAirtableRecord extends Record<string, string | Array<string> | boolean | undefined> {
    id: string;
    Name?: string;
    Title?: string;
    Description: Array<string>;
    Category: string;
}

interface UserResponse {
    username: string;
    email: string;
}

export function mapWorkspaceResponse(response: Array<WorkspaceResponse>): Array<NewWorkspace> {
    const workspaces: Array<NewWorkspace> = response.map((item) => {
        const workspace: NewWorkspace = {
            id: item.id,
            name: item.name,
            prompt: item.prompt.replace(/\r/g, "\n").replace(/\n{2}/g, "\n"),
            temperature: item.temperature,
            maxTokens: item.max_tokens,
            topP: item.top_p,
            bestOf: item.best_of,
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
            airtableTable: item.airtable_table,
            airtableName: item.airtable_name
        };
        console.log(workspace);

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

export function mapAirtableWorkspaceResponse(response: Array<AirtableWorkspaceResponse>): Array<AirtableWorkspace> {
    const airtableWorkspaces = response.map((aw) => {
        const airtableWorkspace: AirtableWorkspace = {
            id: aw.id,
            apiKey: aw.api_key,
            sourceBase: aw.source_base,
            sourceTable: aw.source_table,
            destinationBase: aw.destination_base,
            destinationTable: aw.destination_table
        };
        return airtableWorkspace
    });

    return airtableWorkspaces;
}

export function mapLoadedAirtableRecords(originalRecords: Array<OrigainalAirtableRecord>): Array<AirtableRecord> {
    const regExp = new RegExp(`Article\\s*\\d{1,2}`);
    const records = originalRecords.map(r => mapLoadedAirtableRecord(r));
    // const filteredRecords = records.filter((record): record is AirtableRecord => !!record);

    return records;
}

export function mapLoadedAirtableRecord(originalRecord: OrigainalAirtableRecord): AirtableRecord {
    const regExp = new RegExp(`Article\\s*\\d{1,2}`);
    const articles: Array<string> = [];
    const articleKeys = Object.keys(originalRecord).filter(k => regExp.test(k));
    articleKeys.forEach(k => {
        articles.push(originalRecord[k] as string);
    });
    let description = undefined;
    if (originalRecord.Description && originalRecord.Description.length > 0) {
        description = originalRecord.Description[0];
    }
    // const isInReview = r["In Review"] as boolean;
    // const isSubmitted = r.Submitted as boolean;
    // if (!(isSubmitted || isInReview)) {
    const record: AirtableRecord = {
        id: originalRecord.id,
        name: originalRecord.Name,
        category: originalRecord.Category,
        table4: originalRecord["Table 4"]! as string,
        title: originalRecord.Title,
        description,
        articles
    };

    return record;
}

export function mapUser(originalUser: UserResponse): User {
    return {
        name: originalUser.username,
        email: originalUser.email
    };
}