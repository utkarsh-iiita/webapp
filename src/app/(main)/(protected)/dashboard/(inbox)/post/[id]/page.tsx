"use client";

import { Container, Divider, Paper, Typography } from "@mui/material";

import dayjs from "~/app/_utils/extendedDayjs";
import FullPageLoader from "~/app/common/components/FullPageLoader";
import { api } from "~/trpc/react";

export default function PostDisplayPage({
  params,
}: {
  params: { id: string };
}) {
  const { data, isLoading } = api.post.getPost.useQuery(params.id);
  if (isLoading) {
    return <FullPageLoader />;
  }
  return (
    <Container>
      <div className="flex flex-row justify-between items-center">
        <div className="p-2">
          <Typography variant="h5">
            <strong>{data.title}</strong>
          </Typography>
          <Typography variant="subtitle1" className="whitespace-nowrap">
            {data.author.name} · {dayjs(data.createdAt).fromNow()}
          </Typography>
        </div>
      </div>
      <Divider />
      <Paper className="flex flex-col gap-2 p-2 mt-2">
        <div
          className="text-content"
          dangerouslySetInnerHTML={{
            __html: data.content,
          }}
        ></div>
      </Paper>
    </Container>
  );
}
