import React, { useState } from "react";
import { 
    Dialog,
    DialogTitle,
    TextField,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Slider,
    Tooltip,
    Card,
    CardContent,
    Select
} from "@material-ui/core";
import ChipInput from 'material-ui-chip-input'
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from "@material-ui/core/styles";

import {
    selectAvailableModels
} from "../../slices/editorSlice";
import { CustomModel } from "../../common/interfaces";

const useStyles = makeStyles({
    worksapceNameInput: {
        minWidth: '400px',
    },
    fullWidth: {
        width: '100%',
    },
    workspaceParametersCard: {
        marginTop: '20px',
        marginBottom: '20px'
    }
});

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function CreatePopup(props: Props) {
    const [workspaceName, setWorkspaceName] = useState<string | undefined>(undefined);
    const dispatch = useDispatch();
    const styles = useStyles();
    const onSave = () => {
        props.onClose();
    };
    const classes = useStyles();
    const availableModels = useSelector(selectAvailableModels);

    const [temperature, setTemperature] = useState<number | undefined>(0.5);
    const [maxTokens, setMaxTokens] = useState<number | undefined>(10);
    const [stopSymbols, setStopSymbols] = useState<string[]>([]);
    const [topP, setTopP] = useState<number | undefined>(0.5);
    const [n, setN] = useState<number | undefined>(1);
    const [frequencyPenalty, setFrequencyPenalty] = useState<number | undefined>(0.5);
    const [presencePenalty, setPresencePenalty] = useState<number | undefined>(0.5);
    const [model, setModel] = useState<CustomModel | undefined>(undefined);
    const [prompt, setPrompt] = useState<string | undefined>(undefined);

    const handleTemperatureChange = (event: React.ChangeEvent<{}>, value: number | number[]) => {
        setTemperature(value as number);
    }

    const handleMaxTokensChange = (event: React.ChangeEvent<{}>, value: number | number[]) => {
        setMaxTokens(value as number);
    }
    const addStopSymbol = (chip: string) => {
        setStopSymbols([
            ...stopSymbols,
            chip
        ]);
    }
    const deleteStopSymbol = (deletedChip: string) => {
        setStopSymbols(stopSymbols.filter(symbol => symbol !== deletedChip));
    }
    const handleTopPChange = (event: React.ChangeEvent<{}>, value: number | number[]) => {
        setTopP(value as number);
    }
    const handleNChange = (event: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setN(Number(event.currentTarget.value));
    }
    const handleFrequencyPenaltyChange = (event: React.ChangeEvent<{}>, value: number | number[]) => {
        setFrequencyPenalty(value as number);
    }
    const handlePresencePenaltyChange = (event: React.ChangeEvent<{}>, value: number | number[]) => {
        setPresencePenalty(value as number);
    }
    const handleModelNameChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const selectModel = availableModels.find(model => model.value === event.target.value as string);
        if (selectModel) {
            setModel(selectModel);
        }
    }
    const handlePromptChange = (event: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setPrompt(event.currentTarget.value);
    }

    return (
        <Dialog open={props.open} onClose={props.onClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Create new workspace</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    className={classes.worksapceNameInput}
                    value={workspaceName}
                    margin="dense"
                    id="name"
                    label="Name"
                    onChange={(event: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                        setWorkspaceName(event.currentTarget.value);
                    }}
                    fullWidth
                />
                <Card className={classes.workspaceParametersCard}>
                    <CardContent>
                        <Typography gutterBottom>
                            <strong>Parameters</strong>
                        </Typography>
                        <Tooltip title={'"Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive."'}
                                    placement="left">
                            <Typography id="temperature-slider" gutterBottom>
                                Temperature: <strong>{temperature}</strong>
                            </Typography>
                        </Tooltip>
                        <Slider
                            defaultValue={0.5}
                            value={temperature}
                            onChange={handleTemperatureChange}
                            aria-labelledby="temperature-slider"
                            valueLabelDisplay="auto"
                            step={0.01}
                            marks={[{
                                value: 0,
                                label: '0',
                            }, {
                                value: 1,
                                label: '1',
                            }]}
                            min={0}
                            max={1}
                        />
                        <Typography id="max-tokens-slider" gutterBottom>
                            Response length: <strong>{maxTokens}</strong>
                        </Typography>
                        <Slider
                            defaultValue={10}
                            aria-labelledby="max-tokens-slider"
                            valueLabelDisplay="auto"
                            value={maxTokens}
                            onChange={handleMaxTokensChange}
                            step={1}
                            marks={[{
                                value: 1,
                                label: '1',
                            }, {
                                value: 512,
                                label: '512',
                            }]}
                            min={1}
                            max={512}
                        />

                        <Tooltip 
                            title="On which symbols GPT-3 should stop generating text. Enter \n for a line break." 
                            placement="left"
                        >
                            <Typography gutterBottom>
                                Stop sequences:
                            </Typography>
                        </Tooltip>
                        <ChipInput
                            value={stopSymbols}
                            onAdd={addStopSymbol}
                            onDelete={deleteStopSymbol}
                            onBeforeAdd={() => stopSymbols?.length !== 4}
                            newChipKeys={['Tab']}
                            className={styles.fullWidth}
                        />
                    </CardContent>

                    <CardContent>
                        <Typography gutterBottom>
                            <strong>Advanced parameters</strong>
                        </Typography>
                        <Tooltip 
                            title={'"Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered."'}
                            placement="left"
                        >
                            <Typography id="top-p-slider" gutterBottom>
                                Top P: <strong>{topP}</strong>
                            </Typography>
                        </Tooltip>
                        <Slider
                            defaultValue={0.5}
                            value={topP}
                            onChange={handleTopPChange}
                            aria-labelledby="top-p-slider"
                            valueLabelDisplay="auto"
                            step={0.01}
                            marks={[{
                                value: 0,
                                label: '0',
                            }, {
                                value: 1,
                                label: '1',
                            }]}
                            min={0}
                            max={1}
                        />
                        <Tooltip 
                            title={'"Controls how many completions to generate for each prompt."'}
                            placement="left"
                        >
                            <Typography id="top-p-slider" gutterBottom>
                                N
                            </Typography>
                        </Tooltip>
                        <TextField 
                            id="n-text"
                            type={"number"}
                            style={{marginBottom: '20px'}}
                            rowsMax={100}
                            fullWidth={true}
                            value={n}
                            onChange={handleNChange}
                        />
                        <Tooltip title={'"How much to penalize new tokens based on their existing frequency in the text so far. Decreases the model\'s likelihood to repeat the same line verbatim."'} placement="left">
                            <Typography id="frequency-penalty-slider" gutterBottom>
                                Frequency Penalty: <strong>{frequencyPenalty}</strong>
                            </Typography>
                        </Tooltip>
                        <Slider
                            defaultValue={0.5}
                            value={frequencyPenalty}
                            onChange={handleFrequencyPenaltyChange}
                            aria-labelledby="frequency-penalty-slider"
                            valueLabelDisplay="auto"
                            step={0.01}
                            marks={[{
                                value: 0,
                                label: '0',
                            }, {
                                value: 1,
                                label: '1',
                            }]}
                            min={0}
                            max={1}
                        />
                        <Tooltip title={'"How much to penalize new tokens based on whether they appear in the text so far. Increases the model\'s likelihood to talk about new topics."'} placement="left">
                            <Typography id="presence-penalty-slider" gutterBottom>
                                Presence Penalty: <strong>{presencePenalty}</strong>
                            </Typography>
                        </Tooltip>
                        <Slider
                            defaultValue={0.5}
                            value={presencePenalty}
                            onChange={handlePresencePenaltyChange}
                            aria-labelledby="presence-penalty-slider"
                            valueLabelDisplay="auto"
                            step={0.01}
                            marks={[{
                                value: 0,
                                label: '0',
                            }, {
                                value: 1,
                                label: '1',
                            }]}
                            min={0}
                            max={1}
                        />
                        <Typography id="model-name-typography" gutterBottom>
                            Model name:
                        </Typography>
                        <Select 
                            native id="model-name-select"
                            name="modelName"
                            margin="dense"
                            value={model?.value}
                            onChange={handleModelNameChange}
                            className={styles.fullWidth}
                        >
                            {
                                availableModels && Object.keys(availableModels)
                                    .map((index: any) => (
                                        <option 
                                            key={availableModels[index].id}
                                            value={availableModels[index].value}
                                        >
                                            {availableModels[index].label}
                                        </option>
                                    ))
                            }
                        </Select>
                        <br/>
                        <br/>
                        <TextField
                            id="prompt-text"
                            label="A prompt"
                            multiline
                            rows={9}
                            rowsMax={100}
                            fullWidth={true}
                            onChange={handlePromptChange}
                            value={prompt}
                            variant="outlined"
                        />
                    </CardContent>
                </Card>
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