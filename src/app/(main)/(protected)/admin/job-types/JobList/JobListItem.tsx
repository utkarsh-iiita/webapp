"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import LoadingButton from "@mui/lab/LoadingButton";
//import LoadingButton from "@mui/lab/LoadingButton";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    // DialogActions,
    // DialogContent,
    // DialogTitle,
    TableCell,
    TableRow,
    TextField,
    Typography,
} from "@mui/material/index";

import { api } from "~/trpc/react";



interface JobListItemProps {
    name: string;
    id: string;
    description?: string;
    index: number;
}

export default function JobListItem(props: JobListItemProps) {
    const [name, setName] = useState(props.name);
    const [description, setDescription] = useState(props.description);
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const UpdateJobTypeMutation = api.jobType.updatePlacementType.useMutation({
        onSuccess: () => {
            setOpen(false);
            router.refresh();
        },
    });
    return (
        <TableRow key={props.index} hover>
            <TableCell
                style={{
                    width: 10,
                }}
            >
                {props.index + 1}
            </TableCell>
            <TableCell className="uppercase text-center whitespace-nowrap">
                {props.id}
            </TableCell>
            <TableCell className="text-center whitespace-nowrap">
                {props.name}
            </TableCell>
            <TableCell className="text-center capitalize whitespace-nowrap">
                {props.description}
            </TableCell>
            <TableCell className="text-center whitespace-nowrap">
                <Button color="success" variant="outlined" onClick={() => setOpen(true)}>
                    Edit
                </Button>
                <Dialog
                    open={open}
                    onClose={() => {
                        setName(props.name);
                        setDescription(props.description);
                        setOpen(false)
                    }}
                >
                    <DialogTitle>Update Job Type</DialogTitle>
                    <DialogContent className="flex flex-col py-4 gap-4">
                        <Typography>
                            Update the name and description of Job Type with ID:
                            <strong>{props.id}</strong>
                        </Typography>
                        <TextField
                            label="Name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value)
                            }}
                            fullWidth
                        />
                        <TextField
                            label="Description"
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value)
                            }}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions className="p-4">
                        <Button
                            onClick={() => {
                                setName(props.name);
                                setDescription(props.description);
                                setOpen(false)
                            }}
                            variant="outlined"
                        >
                            Cancel
                        </Button>
                        <LoadingButton
                            type="submit"
                            color="success"
                            variant="contained"
                            loading={UpdateJobTypeMutation.isLoading}
                            onClick={() => {
                                UpdateJobTypeMutation.mutate({
                                    id: props.id,
                                    name,
                                    description
                                })
                            }}
                        >
                            Update
                        </LoadingButton>
                    </DialogActions>



                </Dialog>
            </TableCell>
        </TableRow>
    );
}
