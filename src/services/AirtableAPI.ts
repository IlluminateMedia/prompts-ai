import Airtable, { Base, Record, Table } from "airtable";

import {
    ChoiceResult
} from "../common/interfaces";

interface AirtableConfiguration {
    apiKey: string;
    baseName: string;
    tableName: string;
}

class AirtableAPI {
    private static _tableInstance: Table<any>;

    static configure({apiKey, baseName, tableName}: AirtableConfiguration) {
        Airtable.configure({ apiKey });
        const base = new Airtable({ apiKey }).base(baseName);
        this._tableInstance = base(tableName);
    }

    static create(choiceResults: Array<ChoiceResult>, category: string, airtableName: string): Promise<Record<any>> {
        console.log(this._tableInstance);
        let data: { [key: string]: any } = {};
        choiceResults.map((c, i) => {
            data[`Article ${i + 1}`] = c.text;
        });
        data = {
            ...data,
            Category: category,
            Name: airtableName
        }

        return this._tableInstance.create(data);
    }
}

export default AirtableAPI;