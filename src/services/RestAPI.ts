import axios, { AxiosPromise } from "axios";

import { SignInParameters } from "../common/interfaces";

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

    static getJWTTokens(signInParams: SignInParameters): AxiosPromise {
        return axios({
            method: "POST",
            url: `${baseUrl}token/`,
            headers: {
                "Content-Type": "application/json",
            },
            data: signInParams
        });
    }

    static getAirtable(): AxiosPromise {
        return axios({
            method: "GET",
            url: `${baseUrl}airtable/`,
            headers: {
                "Content-Type": "application/json",
            }
        });
    }

    static getAirtableWorkspaces(): AxiosPromise {
        return axios({
            method: "GET",
            url: `${baseUrl}airtable_workspaces/`,
            headers: {
                "Content-Type": "application/json",
            }
        });
    }

    static getUser(access: string): AxiosPromise {
        return axios({
            method: "GET",
            url: `${baseUrl}user/`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access}`
            }
        });
    }
}

export default RestAPI;