"use client";

import { useState } from "react";

import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import {
    Badge,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Tooltip,
} from "@mui/material";

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
    const [open, setOpen] = useState<boolean>(false);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Tooltip title="Admin access requests">
                <Button
                    color="primary"
                    variant="outlined"
                    className="inline-flex p-2 min-w-0"
                    onClick={() => setOpen(true)}
                >
                    <Badge color="error" variant="dot" invisible={requests.length === 0}>
                        <NotificationAddIcon />
                    </Badge>
                </Button>
            </Tooltip>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Admin Requests</DialogTitle>
                <DialogContent className="flex flex-col gap-4">
                    <RequestsTable requests={requests} />
                </DialogContent>
            </Dialog>
        </>
    );
}
