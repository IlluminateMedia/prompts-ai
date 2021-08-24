import React, { useState } from 'react';
import { Select, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";

import {
    selectCurrentWorkspaceId, selectWorkspaces, updateWorkspaceId
} from "../../slices/newEditorSlice";

const useStyles = makeStyles({
    selectGridItem: {
        width: '150px',
    },
});

export default function NewWorkspaceSelector() {
    const styles = useStyles();
    const dispatch = useDispatch();
    const currentWorkspaceId = useSelector(selectCurrentWorkspaceId);
    const workspaces = useSelector(selectWorkspaces);

    const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        dispatch(updateWorkspaceId(event.target.value as number));
    }

    return (
        <Grid container alignItems={'center'} spacing={1}>
            <Grid item className={styles.selectGridItem}>
                <Select
                    native
                    fullWidth={true}
                    value={currentWorkspaceId}
                    onChange={handleSelectChange}
                >
                    {
                        workspaces.map((workspace) => (
                            <option 
                                key={workspace.id} 
                                value={workspace.id}
                            >
                                {workspace.name}
                            </option>
                        ))
                    }
                </Select>
            </Grid>
        </Grid>
    );
}