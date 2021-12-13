import { RouteProps } from "react-router-dom";
import { Record as OriginalAirtableRecord } from "airtable";

export interface ProtectedRouteProps extends RouteProps {
    isAuthenticated: boolean;
    authenticationPath: string;
}

export interface Example {
    id: string;
    text: string;
    isLoading: boolean;
    output?: string;
    previousOutput?: string;
}

export interface CompletionParameters {
    apiKey: string;
    engine: string;
    maxTokens: number | string;
    stop: string | Array<string>;
    prompt: string;
    temperature: number;
    topP: number;
    bestOf: number;
    presencePenalty: number;
    frequencyPenalty: number;
}

export interface NewCompletionParameters {
    apiKey: string;
    engine: string;
    maxTokens: number | string;
    stop: string | Array<string>;
    prompt: string;
    temperature: number | string;
    topP: number | string;
    bestOf: number | string;
    n: number;
    presencePenalty: number | string;
    frequencyPenalty: number | string;
    airtableApiKey: string;
    airtableBase: string;
    airtableTable: string;
    airtableName: string;
    category: string;
}

export interface JWTTokens {
    access: string;
    refresh: string;
}

export interface SignInParameters {
    username: string;
    password: string;
}

export enum TabIndex {
    basic = 0,
    multipleExamples,
    variations,
    conversations
}

export interface Variation {
    id: string;
    prompt: string;
    output: string;
    temperature: number;
    maxTokens: number;
    topP: number;
    bestOf: number;
    frequencyPenalty: number;
    presencePenalty: number;
    modelName: string;
}

export interface Basic {
    output: string;
    loading: boolean;
}

export enum ConversationPartSource {
    user = 'user',
    gpt = 'gpt'
}

export interface ConversationPart {
    source: ConversationPartSource;
    text: string;
    submitted: boolean;
}

export interface ConversationCompletionParameters {
    engine: string;
    maxTokens: number;
    stop: string | Array<string>;
    prompt: string;
    temperature: number;
    topP: number;
    bestOf: number;
    presencePenalty: number;
    frequencyPenalty: number;
}

export interface Conversation {
    id: string;
    initialPrompt?: string;
    inputValue: string;
    isLoading: boolean;
    startSequence: string;
    restartSequence: string;
    parts: Array<ConversationPart>;
    completionParams?: ConversationCompletionParameters;
}

export interface SelectOption {
    id: number;
    value: string;
    label: string;
}

export interface EditorState {
    apiKey?: string;
    currentWorkspaceId: string;
    editableWorkspaceName: string;
    workspaces: Array<Workspace>;

    showApiKeyDialog: boolean;
    showTemplateDialog: boolean;
    availableModels: Array<SelectOption>;
}

export interface NewEditorState {
    currentWorkspaceId?: number;
    workspaces: Array<NewWorkspace>;
    choiceResults: ChoiceResult[][];
}

export interface AirtableWorkspaceEditorState {
    currentAirtableWorkspaceId?: number;
    airtableWorkspaces: Array<AirtableWorkspace>;
    loadedAirtableData: Array<LoadedAirtableData>;
    finalArticles: Array<FinalArticle>;
    airtableSubmitStatus: Array<AirtableSubmitStatus>;
}

export interface AuthState {
    jwtTokens?: JWTTokens;
    user?: User;
}

export interface User {
    name: string;
    email: string;
}

export interface CustomModel {
    id: number;
    label: string;
    value: string;
}

export interface FinalArticle {
    airtableWorkspaceId: number;
    article?: string;
}

export interface LoadedAirtableData {
    airtableWorkspaceId: number;
    record: AirtableRecord;
}

export interface AirtableSubmitStatus {
    airtableWorkspaceId: number;
    isRunning: boolean;
}

export interface AirtableRecord {
    id: string;
    name?: string;
    category?: string;
    table4: string;
    title?: string;
    description?: string;
    articles: Array<string>;
}

export interface Airtable {
    base: string;
    table: string;
    category: string;
    apiKey: string;
}

export interface AirtableWorkspace {
    id: number;
    apiKey: string;
    sourceBase: string;
    sourceTable: string;
    destinationBase: string;
    destinationTable: string;
}

export interface Workspace {
    id: string;
    name: string;

    prompt: string;
    modelName: string;
    temperature: number;
    topP: number;
    bestOf: number;
    frequencyPenalty: number;
    presencePenalty: number;
    stopSymbols: Array<string>;
    maxTokens: number;
    tabIndex: TabIndex;

    showExamplePreviousOutputs: boolean;
    examples: Array<Example>;
    loadingVariations: boolean;
    variations: Array<Variation>;
    maxVariations: number;
    showPromptForVariations: boolean;

    basic: Basic;

    conversations: Array<Conversation>;
}

export interface NewWorkspace extends Record<string, any> {
    id: number;
    name: string;
    prompt: string;
    model: CustomModel;
    temperature: string;
    topP: string;
    bestOf: string;
    n: string;
    frequencyPenalty: string;
    presencePenalty: string;
    stopSymbols: Array<string>;
    maxTokens: string;
    keywords: string[][];
    loading: boolean;
    airtableBase: string;
    airtableTable: string;
    airtableName: string;
    category: string;
    airtableApiKey: string;
}

// export interface Airtable

// Action Payloads: Examples

export interface EditExampleActionPayload {
    id: string;
    text: string;
}

export interface LoadExampleOutputActionPayload {
    id: string;
    output: string;
}

export interface ChoiceResult {
    finish_reason: string;
    index: number;
    text: string;
}

// Action Payloads: Variations

export interface AddVariationActionPayload {
    output: string;
    prompt: string;
    temperature: number;
    maxTokens: number;
    topP: number;
    bestOf: number;
    frequencyPenalty: number;
    presencePenalty: number;
    modelName: string;
}

// Action Payloads: Conversations

export interface SetConversationCompletionParametersActionPayload {
    conversationId: string;
    parameters: ConversationCompletionParameters;
}

export interface SetConversationInitialPromptActionPayload {
    conversationId: string;
    initialPrompt: string;
}

export interface UpdateConversationLoadingStatusActionPayload {
    conversationId: string;
    status: boolean;
}

export interface UpdateConversationInputValueActionPayload {
    conversationId: string;
    inputValue: string;
}

export interface UpdateConversationStartSequenceActionPayload {
    conversationId: string;
    startSequence: string;
}

export interface UpdateConversationRestartSequenceActionPayload {
    conversationId: string;
    restartSequence: string;
}


export interface AddMessageToConversationFromUserActionPayload {
    conversationId: string;
    source: ConversationPartSource.user;
}

export interface AddMessageToConversationFromGptActionPayload {
    conversationId: string;
    text: string;
    source: ConversationPartSource.gpt;
}

// Action Payloads: Templates

export interface LoadTemplateFromFileDataActionPayload {
    prompt: string;
    temperature: number;
    topP: number;
    bestOf: number;
    frequencyPenalty: number;
    presencePenalty: number;
    maxTokens: number;
    stopSymbols: Array<string>;
    modelName: string;
}

export interface LoadTemplateActionExample {
    text: string;
    output: string;
}

export interface LoadTemplateActionPayload {
    prompt: string;
    examples: Array<LoadTemplateActionExample>;
    stopSymbols?: Array<string>;
    tabIndex: number;
    startSequence?: string;
    restartSequence?: string;
}

export interface CompletionError {
    index: number;
    error?: string;
    message: string;
    statusCode?: number;
}