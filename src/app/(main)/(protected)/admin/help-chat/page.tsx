"use client";

import { useState } from "react";

import { Container, Divider, Typography } from "@mui/material";

import { api } from "~/trpc/react";

import ChatRow from "./_components/ChatRow";

export default function HelpChatPage() {
  // TODO: Add pagination
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);
  const { data, isLoading } = api.helpChat.getLatestAdminHelpChats.useQuery({
    page,
    pageSize,
  });
  return (
    <Container className="flex flex-col gap-4 py-4">
      <Typography variant="h5" color="primary" className="px-4">
        Help Chats
      </Typography>
      <Divider />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col gap-2">
          {data.data?.map((message) => (
            <ChatRow {...message} key={message.participant.id} />
          ))}
        </div>
      )}
    </Container>
  );
}
