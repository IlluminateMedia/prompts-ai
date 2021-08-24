import React, { useEffect } from 'react';
import { PromptEditor } from './components/PromptEditor';
import { Box, Container, createMuiTheme, CssBaseline, ThemeProvider, Typography,} from "@material-ui/core";
import { useHotkeys } from "react-hotkeys-hook";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route } from "react-router-dom";

import { fetchForCurrentTab, updateTabIndex, normalizeConversations } from "./slices/editorSlice";
import { selectAccessToken } from "./slices/authSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import TemplateDialog from "./components/dialogs/TemplateDialog";
import ApiKeyDialog from "./components/dialogs/ApiKeyDialog";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import NewPromptEditor from "./components/NewPromptEditor";

function App() {
    const dispatch = useDispatch();
    const theme = createMuiTheme({
        palette: {
            type: "dark"
        }
    });
    const accessToken = useSelector(selectAccessToken);

    useEffect(() => {
        dispatch(normalizeConversations());
    });

    useHotkeys('ctrl+enter,cmd+enter', () => {
        dispatch(fetchForCurrentTab());
    }, {filter: () => true});
    useHotkeys('ctrl+1', () => {
        dispatch(updateTabIndex(0));
    });
    useHotkeys('ctrl+2', () => {
        dispatch(updateTabIndex(1));
    });
    useHotkeys('ctrl+3', () => {
        dispatch(updateTabIndex(2));
    });
    useHotkeys('ctrl+4', () => {
        dispatch(updateTabIndex(3));
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>

            <ApiKeyDialog/>
            <TemplateDialog/>

            <Switch>
                <Route path="/signin" component={SignIn} />
                <Route path="/signup" component={SignUp} />
                <ProtectedRoute 
                    isAuthenticated={!!accessToken}
                    authenticationPath="/signin" 
                    path="/new-editor"
                    component={NewPromptEditor}
                />
                <Route path="/">
                    <Header/>
                    <Container maxWidth={"lg"}>
                        <Box mt={2}>
                            <PromptEditor/>
                        </Box>
                        <Box mt={2}>
                            <Typography>
                                Not affiliated with OpenAI. Feedback: seva@zhidkoff.com.
                            </Typography>
                        </Box>
                    </Container>
                </Route>
            </Switch>
        </ThemeProvider>
    );
}

export default App;
