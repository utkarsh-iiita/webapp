"use client";

import { Container, Divider, Typography } from "@mui/material";

import ResumeCard from "./_components/ResumeCard";

interface IResumeSection {
  resumes: { name: string; src: string; id: string; createdAt: Date }[];
}

export default function ResumeSection({ resumes }: IResumeSection) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between items-center">
        <Typography variant="h5" color="primary" className="px-2">
          Resumes ({resumes.length})
        </Typography>
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
        </div>
      )}
    </div>
  );
}
