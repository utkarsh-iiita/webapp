"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import AddBoxIcon from '@mui/icons-material/AddBox';
import LoadingButton from "@mui/lab/LoadingButton";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Tooltip,
} from "@mui/material";

import { api } from "~/trpc/react";

export default function NewJobModal() {
    const router = useRouter();
    const [open, setOpen] = useState<boolean>(false);
    const [id, setId] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const createPlacementTypeMutation = api.jobType.createPlacementType.useMutation({
        onSuccess: () => {
            handleClose();
            router.refresh();
        },
    });

    const handleClose = () => {
        setOpen(false);

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createPlacementTypeMutation.mutate({
            id,
            name,
            description
        });
    };

    return (
        <>
            <Tooltip title="Add new Job">
                <Button
                    color="primary"
                    variant="outlined"
                    className="inline-flex p-2 min-w-0"
                    onClick={() => setOpen(true)}
                >
                    <AddBoxIcon />
                </Button>
            </Tooltip>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: "form",
                    onSubmit: handleSubmit,
                }}
            >
                <DialogTitle>Add New Job</DialogTitle>
                <DialogContent className="flex flex-col gap-4">
                    <DialogContentText>
                        Provide job Id, job name and job description
                    </DialogContentText>
                    <TextField
                        label="Id"
                        value={id}
                        onChange={(e) => {
                            setId(e.target.value)
                        }}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Name"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value)
                        }}
                        fullWidth
                        required
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
                    <Button color="error" onClick={handleClose}>
                        Cancel
                    </Button>
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        loading={createPlacementTypeMutation.isLoading}
                    >
                        Submit
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    );
}
