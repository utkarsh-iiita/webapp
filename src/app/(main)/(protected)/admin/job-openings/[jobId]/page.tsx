import { Container } from "@mui/material";

import { api } from "~/trpc/server";

import ApplicantsTable from "../_components/ApplicantsTable";
import JobRow from "../_components/jobRow/JobRow";
import RegDetails from "../_components/RegDetails";

export default async function Page({
  params,
}: {
  params: {
    jobId: string;
  };
}) {
  const opening = await api.jobOpenings.adminGetJobOpening.query(params.jobId);
  return (
    <>
      <Container className="py-4 flex flex-col gap-4">
        <JobRow {...opening} />
        <RegDetails jobId={params.jobId} />
        <ApplicantsTable
          jobId={params.jobId}
          extraApplicationFields={opening.extraApplicationFields}
        />
      </Container>
    </>
  );
}
