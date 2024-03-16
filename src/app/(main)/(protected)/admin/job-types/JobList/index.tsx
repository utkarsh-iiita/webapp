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

import { api } from "~/trpc/server";

import JobListItem from "./JobListItem";


export default async function JobList() {
    const data = await api.jobType.getPlacementTypes.query();
    if (!data.length)
        return (
            <Typography variant="body1" className="text-center">
                No current job postings to show
            </Typography>
        );
    return (
        <TableContainer className="max-h-96 overflow-auto" component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Sr.</TableCell>
                        <TableCell className="min-w-[120px] text-center whitespace-nowrap">
                            Id
                        </TableCell>
                        <TableCell className="text-center whitespace-nowrap">
                            Name
                        </TableCell>
                        <TableCell className="text-center whitespace-nowrap">
                            Description
                        </TableCell>
                        <TableCell className="text-center whitespace-nowrap">
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map(({ id, name, description }, index) => (
                        <JobListItem key={id} id={id} name={name} description={description} index={index} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
