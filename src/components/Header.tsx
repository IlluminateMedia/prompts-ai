import {AppBar, Container, IconButton, Theme, Toolbar, Typography} from "@material-ui/core";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import UndoIcon from "@material-ui/icons/Undo";
import RedoIcon from "@material-ui/icons/Redo";
import GitHubIcon from "@material-ui/icons/GitHub";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";
import {
    selectApiKey,
    toggleApiKeyDialog,
} from "../slices/editorSlice";
import {ActionCreators} from "redux-undo";

interface Props {
    isUndoAndRedoShown?: boolean
}

const useStyles = makeStyles((theme: Theme) => ({
    buttonGroup: {
        marginRight: theme.spacing(2),
    },
    apiKeyInput: {
        minWidth: '400px',
    },
}));

export default function Header({ isUndoAndRedoShown = true }: Props) {
    const dispatch = useDispatch();
    const classes = useStyles();

    const apiKey = useSelector(selectApiKey);
    const isEachApiKeyPresent = !!apiKey;
    const handleApiKeyDialogOpen = () => {
        dispatch(toggleApiKeyDialog(true));
    };
    const handleUndoClick = () => {
        dispatch(ActionCreators.undo());
    };
    const handleRedoClick = () => {
        dispatch(ActionCreators.redo());
    };

    return <AppBar position="static">
        <Container maxWidth={"lg"}>
            <Toolbar variant="regular" disableGutters={true}>
                <div className={classes.buttonGroup}>
                    <Typography variant="h6" color="inherit">
                        Prompts.ai
                    </Typography>
                </div>
                <div className={classes.buttonGroup}>
                    <IconButton onClick={handleApiKeyDialogOpen}><VpnKeyIcon color={isEachApiKeyPresent ? "action" : "error"}/></IconButton>
                </div>
                { isUndoAndRedoShown &&
                    <div className={classes.buttonGroup}>
                        <IconButton onClick={handleUndoClick}><UndoIcon/></IconButton>
                        <IconButton onClick={handleRedoClick}><RedoIcon/></IconButton>
                    </div>
                }
                <div className={classes.buttonGroup}>
                    <IconButton aria-label="GitHib" onClick={() => window.open('https://github.com/sevazhidkov/prompts-ai', '_blank')}>
                        <GitHubIcon fontSize={'small'}/>
                    </IconButton>
                </div>
            </Toolbar>
        </Container>
    </AppBar>
}