import { Container, Typography } from "@mui/material";

import { api } from "~/trpc/server";

import ApplicationHistory from "../_components/ApplicationHistory";
import ApplicationsRow from "../_components/ApplicationRow";

interface IndividualApplicationPageProps {
  params: {
    id: string;
  };
}

export default async function ApplicationsPage(
  props: IndividualApplicationPageProps,
) {
  const application = await api.jobApplication.getStudentApplication.query(
    props.params.id,
  );
  return (
    <Container className="py-4 flex flex-col gap-4">
      <ApplicationsRow application={application} />
      <Typography>
        <strong>Application Status</strong>
      </Typography>
      <div className="w-full flex items-center flex-col">
        <ApplicationHistory history={application.applicationStatus} />
      </div>
    </Container>
  );
}
