"use client";

import {
  Box,
  CircularProgress,
  Container,
  Divider,
  Typography,
} from "@mui/material";

import { api } from "~/trpc/react";

import JobDetails from "./_components/JobDetails";

export default function JobPage() {
  const { data: openings, isLoading } =
    api.jobOpenings.getLatestJobOpenings.useQuery({});
  return (
    <Container className="flex flex-col gap-4 py-4">
      <Typography variant="h5" color="primary" className="px-4">
        Job Openings
      </Typography>
      <Divider />

      {isLoading && (
        <Container className="h-96 w-full flex justify-center items-center">
          <CircularProgress />
        </Container>
      )}
      {
        <Box className="flex flex-col gap-2">
          {openings &&
            openings.data.map((jobs) => <JobDetails key={jobs.id} {...jobs} />)}
        </Box>
      }
    </Container>
  );
}
