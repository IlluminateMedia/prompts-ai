import Airtable, { Base, Record, Table } from "airtable";

import {
    AirtableWorkspace,
    ChoiceResult
} from "../common/interfaces";

interface AirtableConfiguration {
    apiKey: string;
    baseName: string;
    tableName: string;
}

interface StoreFinalSelectionParams {
    article: string
    articleGroup?: string;
    section?: string;
    selectorUser: string;
}

class AirtableAPI {
    private static _tableInstance: Table<any>;

    static configure({apiKey, baseName, tableName}: AirtableConfiguration) {
        Airtable.configure({ apiKey });
        const base = new Airtable({ apiKey }).base(baseName);
        this._tableInstance = base(tableName);
    }

    static create(choiceResults: Array<ChoiceResult>, category: string, airtableName: string): Promise<Record<any>> {
        let data: { [key: string]: any } = {};
        choiceResults.map((c, i) => {
            data[`Article ${i + 1}`] = c.text;
        });
        data = {
            ...data,
            Category: category,
            Name: airtableName
        };

        return this._tableInstance.create(data);
    }

    static fetch(view?: string): Promise<ReadonlyArray<Record<any>>> {
        return this._tableInstance.select({
            view: view ?? "Grid view"
        }).firstPage();
    }

    static storeFinalSelection({article, articleGroup, section, selectorUser}: StoreFinalSelectionParams, airtableWorkspace: AirtableWorkspace): Promise<Record<any>> {
        this.configure({
            apiKey: airtableWorkspace.apiKey,
            baseName: airtableWorkspace.destinationBase,
            tableName: airtableWorkspace.destinationTable
        });

        return this._tableInstance.create({
            "Article": article,
            "Article Group": articleGroup,
            "Section": section,
            "Selector User": selectorUser
        });
    }

    static updateSubmitField(recordId: string, airtableWorkspace: AirtableWorkspace): Promise<Record<any>> {
        this.configure({
            apiKey: airtableWorkspace.apiKey,
            baseName: airtableWorkspace.sourceBase,
            tableName: airtableWorkspace.sourceTable
        });

        return this._tableInstance.update(recordId, {
            "Submitted": true
        });
    }

    static updateReviewField(recordId: string, airtableWorkspace: AirtableWorkspace): Promise<Record<any>> {
        this.configure({
            apiKey: airtableWorkspace.apiKey,
            baseName: airtableWorkspace.sourceBase,
            tableName: airtableWorkspace.sourceTable
        });

        return this._tableInstance.update(recordId, {
            "In Review": true
        });
    }
}

export default AirtableAPI;