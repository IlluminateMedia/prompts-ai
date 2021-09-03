import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Select,
    Grid
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles";

import {
    fetchAirtableWorkspacesAsync,
    selectAirtableWorkspaces,
    selectCurrentAirtableWorkspaceId
} from "../../slices/airtableWorkspaceEditorSlice";

const useStyles = makeStyles({
    
});

export default function AirtableWorkspaceSelector() {
    const styles = useStyles();
    const dispatch = useDispatch();

    const airtableWorkspaces = useSelector(selectAirtableWorkspaces);
    const currentAirtableWorkspaceId = useSelector(selectCurrentAirtableWorkspaceId);

    useEffect(() => {
        dispatch(fetchAirtableWorkspacesAsync());
    }, []);

    return (
        <Grid item>
            <Select
                native
                value={currentAirtableWorkspaceId}
                fullWidth={true}
                autoWidth={true}
            >
                {
                    airtableWorkspaces.map((airtableWorkspace) => (
                        <option 
                            key={airtableWorkspace.id} 
                            value={airtableWorkspace.id}
                        >
                            {`${airtableWorkspace.sourceTable} -> ${airtableWorkspace.destinationTable}`}
                        </option>
                    ))
                }
            </Select>
        </Grid>
    );
}