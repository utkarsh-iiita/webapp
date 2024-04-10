"use client";

import Link from "next/link";

import { Container, Divider, Typography } from "@mui/material";

import { api } from "~/trpc/react";

export default function JobOpeningsPage() {
  const { data: openings, isLoading } =
    api.jobOpenings.adminGetJobOpenings.useQuery({});

  console.log(openings);

  return (
    <Container className="flex flex-col gap-4 py-4">
      <div className="flex flex-row justify-between items-center">
        <Typography variant="h5" color="primary" className="px-4">
          Job Openings
        </Typography>
        <div className="flex gap-2">
          <Link href="./job-openings/new">New</Link>
        </div>
      </div>
      <Divider />
    </Container>
  );
}
