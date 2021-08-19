import React, { useState } from "react";
import { Dialog, DialogTitle, TextField, DialogContent, DialogActions, Button } from "@material-ui/core";
import { useDispatch, useSelector } from 'react-redux';
import { ActionCreators } from "redux-undo";

import {} from "../../slices/editorSlice";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function CreatePopup(props: Props) {
    const [workspaceName, setWorkspaceName] = useState<string | undefined>(undefined);
    const dispatch = useDispatch();
    const onSave = () => {
        props.onClose();
    };

    return (
        <Dialog open={props.open} onClose={props.onClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Create new workspace</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    value={workspaceName}
                    margin="dense"
                    id="name"
                    label="Name"
                    onChange={(event: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                        setWorkspaceName(event.currentTarget.value);
                    }}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={onSave} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}