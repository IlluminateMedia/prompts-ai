import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Button,
    Box,
    Card,
    CardContent,
    Grid,
    TextField,
    Typography
} from "@material-ui/core";

import {
    selectFinalArticle,
    updateFinalArticle
} from "../../slices/airtableWorkspaceEditorSlice";

interface Props {
    title?: string;
    subtext?: string;
    category?: string;
}

export default function FinalSelectionForm({ title, subtext, category }: Props) {
    const finalArticle = useSelector(selectFinalArticle);
    const dispatch = useDispatch();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(updateFinalArticle(event.target.value));
    };

    return (
        <Box mb={1}>
            <Card>
                <CardContent>
                    <Typography gutterBottom>
                        Title: <strong>{title ?? ""}</strong>
                    </Typography>
                    <Typography gutterBottom>
                        Category: <strong>{category ?? ""}</strong>
                    </Typography>
                    <TextField
                        id="final-selection-text"
                        label="Final Selection"
                        multiline
                        rows={10}
                        rowsMax={100}
                        fullWidth={true}
                        value={finalArticle?.article || ""}
                        variant="outlined"
                        autoFocus={true}
                        onChange={handleChange}
                    />
                    <br/>
                    <br/>
                    <Button 
                        variant="contained"
                        size="large"
                        color="primary"
                    >Submit
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
}