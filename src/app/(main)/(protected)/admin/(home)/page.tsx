"use client";

import { Container, Divider, Typography } from "@mui/material";

import FullPageLoader from "~/app/common/components/FullPageLoader";
import { api } from "~/trpc/react";

import JobAnalyticsRow from "./_components/JobAnalyticsRow";

export default function AdminHomePage() {
  const { data: jobTypes, isLoading } = api.analytics.getJobTypes.useQuery();
  if (isLoading) {
    return <FullPageLoader />;
  }
  return (
    <Container className="py-4 flex flex-col gap-4">
      <Typography variant="h5" color="primary" className="px-4">
        Admin
      </Typography>
      <Divider />
      {jobTypes.map((jobType, index) => (
        <JobAnalyticsRow jobType={jobType} key={index} />
      ))}
    </Container>
  );
}
