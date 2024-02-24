"use client";

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material/index";

import { type api as API } from "~/trpc/server";

import AdminRequests from "./AdminRequests";

type admins = ReturnType<typeof API.admin.getAdmins.query> extends Promise<
    infer T
>
    ? T
    : never;


interface AdminRequestsItem {
    requests: admins;
}

export default function RequestsTable({ requests }: AdminRequestsItem) {
    if (!requests.length)
        return (
            <Typography variant="body1" className="text-center">
                No request to show
            </Typography>
        );
    return (
        <TableContainer className="max-h-96 overflow-auto" component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Sr.</TableCell>
                        <TableCell className="min-w-[120px] text-center whitespace-nowrap">
                            Username
                        </TableCell>
                        <TableCell className="text-center whitespace-nowrap">
                            Name
                        </TableCell>
                        <TableCell className="text-center whitespace-nowrap">
                            User Type
                        </TableCell>
                        <TableCell className="text-center whitespace-nowrap">
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {requests.map((admin, index) => (
                        <AdminRequests key={admin.user.id} admin={admin} index={index} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
