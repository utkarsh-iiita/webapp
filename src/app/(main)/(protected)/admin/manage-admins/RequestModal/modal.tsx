"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import AddModeratorIcon from "@mui/icons-material/AddModerator";
import LoadingButton from "@mui/lab/LoadingButton";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
} from "@mui/material";

import { api } from "~/trpc/react";
import { type api as API } from "~/trpc/server";

import RequestsTable from "./RequestsTable";

type admins = ReturnType<typeof API.admin.getAdmins.query> extends Promise<
    infer T
>
    ? T
    : never;

interface RequestModalProps {
    requests: admins
};

export default function RequestModalClient({ requests }: RequestModalProps) {
    const router = useRouter();
    const [open, setOpen] = useState<boolean>(false);
    const updateAdminPermission = api.admin.updateAdminPermission.useMutation({
        onSuccess: () => {
            handleClose();
            router.refresh();
        },
    });

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Button
                variant="contained"
                startIcon={<AddModeratorIcon />}
                className="hidden md:inline-flex"
                onClick={() => {
                    setOpen(true)
                    console.log('open')
                }}
            >
                Admin Request
            </Button>
            <IconButton
                color="primary"
                className="inline-flex md:hidden"
                onClick={() => setOpen(true)}
            >
                <AddModeratorIcon />
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Add New Admin</DialogTitle>
                <DialogContent className="flex flex-col gap-4">
                    <RequestsTable requests={requests} />
                </DialogContent>
            </Dialog>
        </>
    );
}
