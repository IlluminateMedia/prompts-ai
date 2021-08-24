import React from 'react';
// @ts-ignore
import Files from "react-files";
import { Button } from "@material-ui/core";
import { useDispatch } from "react-redux";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

interface Props {
    className: string;
}

export default function NewUploadButton(props: Props) {
    const dispatch = useDispatch();
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
        if (event.target === undefined) {
            return;
        }
        if (event.target!.result === undefined) {
            return;
        }
        // dispatch(loadKeywords(event.target!.result as string));
    };
    return (
        <Files
            className="files-dropzone"
            onChange={(file: any) => {
                fileReader.readAsText(file[0]);
            }}
            onError={(err: any) => console.log(err)}
            accepts={['.json']}
            maxFileSize={10000000}
            minFileSize={0}
            clickable
        >
            <Button
                variant="outlined"
                color="default"
                className={props.className}
                size={'small'}
                startIcon={<CloudUploadIcon />}
            >
                Upload
            </Button>
        </Files>
    );
}