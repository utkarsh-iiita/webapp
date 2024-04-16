import { Container, Divider, Typography } from "@mui/material";

import { api } from "~/trpc/server";

import ResumeUploadDialog from "./_components/NewResumeDialog";
import ResumeCard from "./_components/ResumeCard";

export default async function ResumePage() {
  const resumes = await api.studentResume.getStudentResumes.query();
  return (
    <Container className="flex flex-col gap-4 py-4">
      <div className="flex flex-row justify-between items-center">
        <Typography variant="h5" color="primary" className="px-4">
          Resumes
        </Typography>
        <div className="flex gap-2">
          <ResumeUploadDialog resumes={resumes} />
        </div>
      </div>
      <Divider />
      {resumes.length > 0 ? (
        <div className="grid gap-2 grid-cols-1 md:auto-rows-fr sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
          {resumes.map((resume) => (
            <ResumeCard {...resume} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center py-20">
          <Typography variant="h6" color="textSecondary">
            Nothing here
          </Typography>
          <Typography variant="subtitle2" color="text.disabled">
            Upload a resume to get started
          </Typography>
        </div>
      )}
    </Container>
  );
}
