"use client"

import dayjs from "dayjs";

import { Paper, Typography } from "@mui/material";

import FullPageLoader from "~/app/common/components/FullPageLoader";
import { api } from "~/trpc/react";

export default function PostDisplayPage({
  params,
}: {
  params: { id: string };
}) {
  const { data, isLoading } = api.post.getPost.useQuery(params.id);
  if (isLoading) {
    return (
      <FullPageLoader />
    )
  }
  return (
    <Paper className="flex flex-col gap-2 py-2 px-4">
      <div className="flex flex-col justify-between">
        <Typography variant="body1">
          <strong>{data.title}</strong>
        </Typography>
        <Typography variant="caption" className="whitespace-nowrap">
          {dayjs(data.createdAt).fromNow()}
        </Typography>
        <Typography variant="body1">
          {data.content}
        </Typography>
        <Typography variant="body1">
          <strong>{data.author.name}</strong>
        </Typography>

      </div>
    </Paper>
  )
}