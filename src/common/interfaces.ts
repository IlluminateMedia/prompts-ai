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
    maxTokens: number;
    stop: string | Array<string>;
    prompt: string;
    temperature: number;
    topP: number;
    presencePenalty: number;
    frequencyPenalty: number;
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
    openaiApiKey?: string;
    airtableApiKey?: string;
    currentWorkspaceId: number;
    editableWorkspaceName: string;
    workspaces: Array<Workspace>;

    showApiKeyDialog: boolean;
    showTemplateDialog: boolean;
    availableModels: Array<SelectOption>;
}

export interface CustomModel {
    id: number;
    label: string;
    value: string;
}

export interface Workspace {
    id: number;
    name: string;

    prompt: string;
    modelName: string;
    model?: CustomModel;
    temperature: number;
    topP: number;
    n: number;
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

// Action Payloads: Examples

export interface EditExampleActionPayload {
    id: string;
    text: string;
}

export interface LoadExampleOutputActionPayload {
    id: string;
    output: string;
}

// Action Payloads: Variations

export interface AddVariationActionPayload {
    output: string;
    prompt: string;
    temperature: number;
    maxTokens: number;
    topP: number;
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