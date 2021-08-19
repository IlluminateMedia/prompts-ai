import React, { useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import { IconButton } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { ActionCreators } from "redux-undo";

import CreatePopup from "./CreatePopup";
import { createWorkspace } from "../../slices/editorSlice";

export default function CreateButton() {
    const [isPopupOpen, setPopupOpen] = useState(false);
    const dispatch = useDispatch();
    const onAdd = () => {
        dispatch(createWorkspace());
        dispatch(ActionCreators.clearHistory())
    };
    const openPopup = () => {
        setPopupOpen(true);
    };

    return (
        <>
            <IconButton aria-label="close" onClick={openPopup} size={'small'}>
                <AddIcon/>
            </IconButton>
            <CreatePopup open={isPopupOpen} onClose={() => {
                setPopupOpen(false);
            }} />
        </>
    );
}