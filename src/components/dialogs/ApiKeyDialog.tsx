import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from "@material-ui/core";
import React from "react";
import {
    editAirtableApiKey,
    selectAirtableApiKey,
    editOpenaiApiKey, 
    selectOpenaiApiKey, 
    selectApiKeyDialogVisible, 
    toggleApiKeyDialog 
} from "../../slices/editorSlice";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    apiKeyInput: {
        minWidth: '400px',
    },
});

export default function ApiKeyDialog() {
    const dispatch = useDispatch();

    const openaiApiKey = useSelector(selectOpenaiApiKey);
    const airtableApiKey = useSelector(selectAirtableApiKey);
    const apiKeyDialogOpen = useSelector(selectApiKeyDialogVisible);
    const handleApiKeyDialogClose = () => {
        dispatch(toggleApiKeyDialog(false));
    };

    const classes = useStyles();

    return (
        <Dialog 
            open={apiKeyDialogOpen}
            onClose={handleApiKeyDialogClose}
            aria-labelledby="api-key-form-dialog-title"
        >
            <DialogTitle id="api-key-form-dialog-title">API Keys</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please provide your OpenAI API Key and Airtable API Key. We only store these keys locally and never send it to our servers.
                </DialogContentText>
                <TextField
                    className={classes.apiKeyInput}
                    autoFocus
                    margin="dense"
                    id="open-api-key"
                    label="Open AI API Key"
                    type="text"
                    value={openaiApiKey}
                    fullWidth
                    onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                        dispatch(editOpenaiApiKey(event.currentTarget.value));
                    }}
                />
                <TextField
                    className={classes.apiKeyInput}
                    margin="dense"
                    id="airtable-api-key"
                    label="Airtable API Key"
                    type="text"
                    value={airtableApiKey}
                    fullWidth
                    onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                        dispatch(editAirtableApiKey(event.currentTarget.value));
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleApiKeyDialogClose} color="primary">
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    );
}