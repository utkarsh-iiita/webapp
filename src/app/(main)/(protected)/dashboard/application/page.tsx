import Link from "next/link";

import { Box, Container, Divider, Typography } from "@mui/material";

import { api } from "~/trpc/server";

import ApplicationsRow from "./_components/ApplicationRow";

export default async function ApplicationsPage() {
  const applications = await api.jobApplication.getStudentApplications.query();

  return (
    <Container className="flex flex-col gap-4 py-4">
      <Typography variant="h5" color="primary" className="px-4">
        My Applications
      </Typography>
      <Divider />
      <Box className="flex flex-col gap-2">
        {applications &&
          applications.map((application) => (
            <Link key={application.id} href={"./application/" + application.id}>
              <ApplicationsRow application={application} />
            </Link>
          ))}
      </Box>
    </Container>
  );
}
