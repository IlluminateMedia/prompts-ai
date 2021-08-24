import React from 'react';
import { useDispatch } from "react-redux";
import { Grid, Button } from '@material-ui/core';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import {
    makeStyles
} from "@material-ui/styles";

import NewUploadButton from "./fileExport/NewUploadButton";
import NewWorkspaceSelector from "./workspaceSelector/NewWorkspaceSelector";

const useStyles = makeStyles({
    fileExportButton: {
        width: '125px',
    },
    templateButton: {
        width: '100%',
    },
});

export default function NewWorkspaceForm () {
    const styles = useStyles();

    return (
        <Grid container direction={'column'} spacing={2}>
            <Grid item><NewWorkspaceSelector/></Grid>
            <Grid item>
                <Grid container spacing={1}>
                    <Grid item>
                        <NewUploadButton className={styles.fileExportButton} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <Button
                    variant="contained"
                    size="large"
                    color="primary"
                >
                    {'Run'}
                </Button>
            </Grid>
        </Grid>
    );
}