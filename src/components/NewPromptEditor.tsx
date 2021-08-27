import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    Typography,
    Grid,
    Card,
    CardContent,
    Container,
    Box
} from "@material-ui/core";

import Header from "./Header";
import NewWorkspaceForm from "./NewWorkspaceFom";

import {
    fetchWorkspacesAsync
} from "../slices/newEditorSlice";

export default function NewPromptEditor() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchWorkspacesAsync());
    }, []);

    return (
        <>
            <Header isUndoAndRedoShown={false}/>
            <Container maxWidth={"lg"}>
                <Box mt={2}>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={3}
                >
                    <Grid item xs={12} sm={3} md={3}>
                        <Box mb={1}>
                            <Card>
                                <CardContent>
                                    <Typography gutterBottom>
                                        <strong>Workspace</strong>
                                    </Typography>
                                    <NewWorkspaceForm/>
                                </CardContent>
                            </Card>
                        </Box>
                    </Grid>
                </Grid>
                </Box>
            </Container>
        </>
    );
}