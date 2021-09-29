import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Card,
    CardContent,
    Container,
    Box,
    Grid,
    Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Airtable, { Base, Record, Table } from "airtable";

import AirtableWorkspaceSelector from "./airtableWorkspaces/AirtableWorkspaceSelector";
import AirtableField from "./airtableWorkspaces/AirtableField";
import FinalSelectionForm from "./airtableWorkspaces/FinalSelectionForm";
import {
    fetchAirtableWorkspacesAsync, selectAirtableRecord, updateFinalArticle
} from "../slices/airtableWorkspaceEditorSlice"

const useStyles = makeStyles((theme) => ({
    container: {
        margin: theme.spacing(1),
    },
    header: {
        marginTop: theme.spacing(3),
    },
    fixed: {
        position: "fixed",
        top: "30px",
        right: "10px",
        width: "inherit",
        maxWidth: "41.666667%",
        maxHeight: "95%",
        overflow: "auto"
    }
}));

export default function AirtableWorkspaceEditor() {
    const classes = useStyles();
    const dispatch = useDispatch();

    const airtableRecord = useSelector(selectAirtableRecord);

    const handleClickAirtableField = useCallback((text: string) => {
        dispatch(updateFinalArticle(text));
    }, []);

    useEffect(() => {
        console.log("use effect");
        // const base = new Airtable({ apiKey: "keyDyO2hVA4ECe6Lq" }).base("appHzVVGiKtfK2aN5");
        // base('Description Main Selection').select({
        //     // Selecting the first 3 records in Grid view:
        //     filterByFormula: "AND({In Review} = 0, {Submitted} = 0)",
        //     pageSize: 100,
        //     view: "Grid view"
        // }).eachPage(function page(records, fetchNextPage) {
        //     // This function (`page`) will get called for each page of records.

        //     records.forEach(function (record) {
        //         console.log('Retrieved', record.get('Name'));
        //     });
        //     console.log(records.length)

        //     // To fetch the next page of records, call `fetchNextPage`.
        //     // If there are more records, `page` will get called again.
        //     // If there are no more records, `done` will get called.
        //     fetchNextPage();

        // }, function done(err) {
        //     console.log("done");
        //     if (err) { console.error(err); return; }
        // });

    }, []);

    return (
        <Grid
            container
            className={classes.container}
            direction="column"
        >
            <Grid
                item
                xs={10}
                sm={6}
                className={classes.header}
            >
                <Box
                    mb={1}
                    width={1}
                >
                    <Card>
                        <CardContent>
                            <Typography gutterBottom>
                                <strong>Airtable Workspace</strong>
                            </Typography>
                            <AirtableWorkspaceSelector />
                        </CardContent>
                    </Card>
                </Box>
            </Grid>
            <Grid
                container
                direction="row"
                spacing={6}
            >
                <Grid item xs={12} lg={6}>
                    {
                        airtableRecord?.articles.map((article, i) => (
                            <AirtableField
                                text={article}
                                onClick={handleClickAirtableField}
                                key={i}
                            />
                        ))
                    }
                </Grid>
                <div className={classes.fixed}>
                    <FinalSelectionForm
                        title={airtableRecord?.title}
                        category={airtableRecord?.category}
                        description={airtableRecord?.description}
                    />
                </div>
            </Grid>
        </Grid>
    );
}