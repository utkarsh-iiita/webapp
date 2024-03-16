import { Suspense } from "react";

import {
    CircularProgress,
    Container,
    Divider,
    Typography,
} from "@mui/material/index";

import JobList from "./JobList";
import NewJobModal from "./NewJob";



export default async function ManageJobsPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const query = Array.isArray(searchParams?.q)
        ? searchParams?.q[0]
        : searchParams?.q;
    return (
        <Container className="flex flex-col gap-4 py-4">
            <div className="flex flex-row justify-between items-center">
                <Typography variant="h5" color="primary" className="px-4">
                    Job Types
                </Typography>
                <div className="flex gap-2">
                    <NewJobModal />

                </div>
            </div>
            <Divider />

            <Suspense
                key={query}
                fallback={
                    <div className="w-full flex justify-center items-center">
                        <CircularProgress />
                    </div>
                }
            >
                <JobList />
            </Suspense>
        </Container>
    );
}
