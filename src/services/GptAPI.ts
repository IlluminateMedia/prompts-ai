import axios from "axios";
import {AxiosPromise} from "axios";
import {CompletionParameters} from "../slices/editorSlice";

export interface ChoiceResult {
    finish_reason: string;
    index: number;
    text: string;
}

const defaultModels = ["davinci", "davinci-instruct-beta", "curie", "curie-instruct-beta", "babbage", "ada"];

class GptAPI {
    static generateCompletions(prompt: string | Array<string>, completionParams: CompletionParameters, modelName: string,
                               n: number = 1): AxiosPromise {
        
        let data: any = {
            "prompt": prompt,
            "n": n,
            "max_tokens": completionParams.maxTokens,
            "temperature": completionParams.temperature,
            "stop": completionParams.stop,
            "top_p": completionParams.topP,
            "presence_penalty": completionParams.presencePenalty,
            "frequency_penalty": completionParams.frequencyPenalty
        }
        let url = `https://api.openai.com/v1/engines/${completionParams.engine}/completions`;
        if (!defaultModels.includes(modelName)) {
            url = 'https://api.openai.com/v1/completions';
            data = {
                ...data,
                "model": modelName
            };
        }
        console.log(data);
        return axios({
            method: "POST",
            //url: `https://api.openai.com/v1/engines/${completionParams.engine}/completions`,
            url,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${completionParams.apiKey}`,
            },
            data
        });
    }
}

export default GptAPI;