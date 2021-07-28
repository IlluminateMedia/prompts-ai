import axios from "axios";
import {AxiosPromise} from "axios";
import {CompletionParameters} from "../slices/editorSlice";

export interface ChoiceResult {
    finish_reason: string;
    index: number;
    text: string;
}

class GptAPI {
    static generateCompletions(prompt: string | Array<string>, completionParams: CompletionParameters, modelName: string,
                               n: number = 1): AxiosPromise {
        return axios({
            method: "POST",
            //url: `https://api.openai.com/v1/engines/${completionParams.engine}/completions`,
            url: 'https://api.openai.com/v1/completions',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${completionParams.apiKey}`,
            },
            data: {
                "prompt": prompt,
                "n": n,
                "max_tokens": completionParams.maxTokens,
                "temperature": completionParams.temperature,
                "stop": completionParams.stop,
                "top_p": completionParams.topP,
                "presence_penalty": completionParams.presencePenalty,
                "frequency_penalty": completionParams.frequencyPenalty,
                "model": modelName
            }
        });
    }
}

export default GptAPI;