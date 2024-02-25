"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import LoadingButton from "@mui/lab/LoadingButton";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TableCell,
    TableRow,
} from "@mui/material/index";

import { api } from "~/trpc/react";
import { type api as API } from "~/trpc/server";

type admins = ReturnType<typeof API.admin.getAdmins.query> extends Promise<
    infer T
>
    ? T
    : never;

interface AdminRequestsItem {
    admin: admins[number];
    index: number;
}

export default function AdminRequests({ admin, index }: AdminRequestsItem) {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const updateAdminPermission = api.admin.updateAdminPermission.useMutation({
        onSuccess: () => {
            router.refresh();
        },
    });
    const removeAdminMutation = api.admin.removeAdmin.useMutation({
        onSuccess: () => {
            router.refresh();
        },
    });
    return (
        <TableRow key={index} hover>
            <TableCell
                style={{
                    width: 10,
                }}
            >
                {index + 1}
            </TableCell>
            <TableCell className="uppercase text-center whitespace-nowrap">
                {admin.user.username}
            </TableCell>
            <TableCell className="text-center whitespace-nowrap">
                {admin.user.name}
            </TableCell>
            <TableCell className="text-center capitalize whitespace-nowrap">
                {admin.user.userGroup}
            </TableCell>
            <TableCell className="text-center whitespace-nowrap">
                <Button color="error" variant="outlined" onClick={() => setOpen(true)} className="p-2 min-w-0 mr-2">
                    <CloseIcon sx={{ fontSize: 16 }} />
                </Button>
                <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                    PaperProps={{
                        component: "form",
                        onSubmit: (e) => {
                            e.preventDefault();
                            removeAdminMutation.mutate(admin.user.id);
                        },
                    }}
                >
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogContent>
                        You will be denying request from{" "}
                        <strong>
                            {admin.user.name + " (" + admin.user.username.toUpperCase() + ")"}
                        </strong>

                    </DialogContent>
                    <DialogActions className="p-4">
                        <Button onClick={() => setOpen(false)} variant="contained">
                            Cancel
                        </Button>
                        <LoadingButton
                            type="submit"
                            color="error"
                            variant="outlined"
                            loading={removeAdminMutation.isLoading}
                        >
                            Remove
                        </LoadingButton>
                    </DialogActions>
                </Dialog>
                <Button color="success" variant="outlined" onClick={() => setOpen(true)} className="p-2 min-w-0">
                    <DoneIcon sx={{ fontSize: 16 }} />
                </Button>
                <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                    PaperProps={{
                        component: "form",
                        onSubmit: (e) => {
                            e.preventDefault();
                            updateAdminPermission.mutate({ id: admin.user.id, permissions: 1 })
                        },
                    }}
                >
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogContent>
                        You will be accepting request from{" "}
                        <strong>
                            {admin.user.name + " (" + admin.user.username.toUpperCase() + ")"}
                        </strong>

                    </DialogContent>
                    <DialogActions className="p-4">
                        <Button onClick={() => setOpen(false)} variant="contained">
                            Cancel
                        </Button>
                        <LoadingButton
                            type="submit"
                            color="success"
                            variant="outlined"
                            loading={updateAdminPermission.isLoading}
                        >
                            Accept
                        </LoadingButton>
                    </DialogActions>
                </Dialog>
            </TableCell>
        </TableRow>
    );
}
