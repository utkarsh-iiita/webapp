"use client";

import Link from "next/link";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { Button, Container, Divider, Typography } from "@mui/material";

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
      <div className="flex flex-row justify-between items-center gap-2 px-4">
        <Typography variant="h5" color="primary">
          Admin
        </Typography>
        <Link href="/admin/selects">
          <Button
            variant="outlined"
            startIcon={<HowToRegIcon />}
            endIcon={<ArrowForwardIosIcon className="text-sm" />}
          >
            Selects
          </Button>
        </Link>
      </div>
      <Divider />
      {jobTypes.map((jobType, index) => (
        <JobAnalyticsRow jobType={jobType} key={index} />
      ))}
    </Container>
  );
}
