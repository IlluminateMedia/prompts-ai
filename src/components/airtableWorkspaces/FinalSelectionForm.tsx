import React from "react";
import {
    Button,
    Box,
    Card,
    CardContent,
    TextField,
    Typography
} from "@material-ui/core";

export default function FinalSelectionForm() {

    return (
        <Box mb={1}>
            <Card>
                <CardContent>
                    <TextField
                        id="final-selection-text"
                        label="Final Selection"
                        multiline
                        rows={10}
                        rowsMax={100}
                        fullWidth={true}
                        variant="outlined"
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