import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, Theme } from "@material-ui/core/styles";
import {
    TextField,
    Card,
    CardContent,
    Box,
    Grid,
    IconButton
} from "@material-ui/core";
import { ArrowForward } from "@material-ui/icons";

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    card: {
        backgroundColor: theme.palette.background.default,
    }
}));

export default function AirtableField () {
    const styles = useStyles();

    return (
        <Card className={styles.card}>
            <CardContent>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={1}
                >
                    <Grid item xs={10} md={11}>
                        <Box mb={1}>
                            <TextField
                                multiline
                                type={'text'}
                                fullWidth={true}
                                variant="outlined"
                                disabled
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={1} md={1}>
                        <Box>
                            <IconButton onClick={() => {}}>
                                <ArrowForward />
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}