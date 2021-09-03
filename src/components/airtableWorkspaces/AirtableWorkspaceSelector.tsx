import React from "react";
import {
    Select,
    Grid
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    selectGridItem: {
        width: '150px',
    },
});

export default function AirtableWorkspaceSelector() {
    const styles = useStyles();

    return (
        <Grid container alignItems={'center'} spacing={1}>
            <Grid item className={styles.selectGridItem}>
                <Select
                    native
                    value={"AA"}
                    fullWidth={true}
                >
                </Select>
            </Grid>
        </Grid>
    );
}