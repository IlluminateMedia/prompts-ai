import React, { useEffect } from "react";
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

import AirtableWorkspaceSelector from "./airtableWorkspaces/AirtableWorkspaceSelector";
import AirtableField from "./airtableWorkspaces/AirtableField";
import FinalSelectionForm from "./airtableWorkspaces/FinalSelectionForm";

const useStyles = makeStyles((theme) => ({
    container: {
        margin: theme.spacing(1),
    },
    header: {
        marginTop: theme.spacing(3),
    }
}));

export default function AirtableWorkspaceEditor() {
    const classes = useStyles();

    return (
        <Grid 
            container 
            className={classes.container}
            direction="column"
        >
            <Grid
                container
                direction="row"
                className={classes.header}
            >
                <Box mb={1}>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom>
                                <strong>Airtable Workspace</strong>
                            </Typography>
                            <AirtableWorkspaceSelector/>
                        </CardContent>
                    </Card>
                </Box>
            </Grid>
            <Grid
                container
                direction="row"
                spacing={6}
            >
                <Grid item xs={11} sm={6} md={6}>
                    <AirtableField/>
                </Grid>
                <Grid item xs={11} sm={5} md={5}>
                    <FinalSelectionForm/>
                </Grid>
            </Grid>
        </Grid>
    );
}