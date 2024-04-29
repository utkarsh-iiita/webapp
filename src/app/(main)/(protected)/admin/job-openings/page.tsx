"use client";

import Link from "next/link";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Typography,
} from "@mui/material";

import { api } from "~/trpc/react";

import JobRow from "./_components/jobRow/JobRow";

export default function JobOpeningsPage() {
  const { data: openings, isLoading } =
    api.jobOpenings.adminGetJobOpenings.useQuery({});

  return (
    <Container className="flex flex-col gap-4 py-4">
      <div className="flex flex-row justify-between items-center">
        <Typography variant="h5" color="primary" className="px-4">
          Job Openings
        </Typography>
        <div className="flex gap-2">
          <Link href="./job-openings/new">
            <Button
              variant="outlined"
              color="primary"
              className="inline-flex p-2 min-w-0"
            >
              <AddCircleIcon />
            </Button>
          </Link>
        </div>
      </div>
      <Divider />

      {isLoading && (
        <Container className="h-96 w-full flex justify-center items-center">
          <CircularProgress />
        </Container>
      )}
      {
        <Box className="flex flex-col gap-2">
          {openings &&
            openings.data.map((jobs) => (
              <Link key={jobs.id} href={"./job-openings/" + jobs.id}>
                <JobRow {...jobs} />
              </Link>
            ))}
        </Box>
      }
    </Container>
  );
}
