import axios from "axios";
import {AxiosPromise} from "axios";

const baseUrl = "http://localhost:8000/be/api/v1/";
// const baseUrl = "/be/api/v1/";

class RestAPI {

    static getAvailableModels(): AxiosPromise {
        return axios({
            method: "GET",
            url: `${baseUrl}models/`,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    static getWorkspaces(): AxiosPromise {
        return axios({
            method: "GET",
            url: `${baseUrl}workspace/`,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}

export default RestAPI;