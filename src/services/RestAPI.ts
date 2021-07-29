import axios from "axios";
import {AxiosPromise} from "axios";

class RestAPI {
    static getAvailableModels(): AxiosPromise {
        return axios({
            method: "GET",
            url: '/be/api/v1/models/',
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}

export default RestAPI;