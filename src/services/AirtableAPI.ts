import Airtable, { Base, Record, Table } from "airtable";

interface AirtableConfiguration {
    apiKey: string;
    baseName: string;
    tableName: string;
}

class AirtableAPI {
    private static _tableInstance: Table<any>;

    static configure({apiKey, baseName, tableName}: AirtableConfiguration) {
        Airtable.configure({ apiKey });
        const base = new Airtable({ apiKey }).base("applFaVKPfNHHvf1f");
        this._tableInstance = base(tableName);
    }

    static create(): Promise<Record<any>> {
        console.log(this._tableInstance);
        return this._tableInstance.create({
            "Title": "Tutorial: create a Spreadsheet using React",
            "Link": "https://flaviocopes.com/react-spreadsheet/",
        })
    }
}

export default AirtableAPI;