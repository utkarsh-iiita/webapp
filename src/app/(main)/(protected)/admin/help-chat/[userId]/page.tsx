"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";

import SendIcon from "@mui/icons-material/Send";
import {
  CircularProgress,
  Container,
  IconButton,
  InputBase,
  Paper,
  Typography,
} from "@mui/material";

import FullPageLoader from "~/app/common/components/FullPageLoader";
import { api } from "~/trpc/react";
import { type api as API } from "~/trpc/server";

import AdminMessageBox from "./_components/AdminMessageBox";
import UserMessageBox from "./_components/UserMessageBox";

type message = ReturnType<
  typeof API.helpChat.postMessage.mutate
> extends Promise<infer T>
  ? T
  : never;

export default function HelpChatPage({
  params,
}: {
  params: { userId: string };
}) {
  // TODO: Add pagination

  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [allMessages, setAllMessages] = useState<message[]>([]);
  const [message, setMessage] = useState("");

  const { data: session } = useSession();
  const { data: oldMessages, isLoading: isOldMessagesLoading } =
    api.helpChat.getAdminHelpMessages.useQuery({
      participantId: params.userId,
      page,
    });

  const newMessageMutation = api.helpChat.adminPostMessage.useMutation({
    onSuccess: (data) => {
      setMessage("");
      if (allMessages.find((msg) => msg.id === data.id)) return;
      setAllMessages([data, ...allMessages]);
    },
  });

  const { data: latestMessages, isLoading: isLatestMessagesLoading } =
    api.helpChat.getAdminHelpMessages.useQuery(
      {
        participantId: params.userId,
        page: 1,
      },
      {
        refetchInterval: 5000,
      },
    );

  const handleSendMessage = useCallback(() => {
    const messageText = message.trim();
    if (!messageText) return;
    newMessageMutation.mutate({
      message: messageText,
      participantId: params.userId,
    });
  }, [message, newMessageMutation]);

  useEffect(() => {
    if (!latestMessages) return;
    if (!oldMessages) return;
    const newAllMessages = [...latestMessages, ...allMessages, ...oldMessages];
    // remove messages with duplicate ids
    const uniqueMsgIds = new Set(newAllMessages.map((msg) => msg.id));
    const uniqueMessages = Array.from(uniqueMsgIds).map((id) => {
      return newAllMessages.find((msg) => msg.id === id);
    });
    setAllMessages(uniqueMessages);
  }, [latestMessages, oldMessages]);

  if (!session?.user) return <FullPageLoader />;

  return (
    <Container className="h-[calc(100svh-66px)] flex flex-col py-2 px-2 md:px-4">
      {allMessages.length > 0 ? (
        <div className="flex flex-1 flex-col justify-end h-[calc(100svh-66px-72px)]">
          <div className="flex flex-col-reverse py-2 gap-2 h-full overflow-auto no-scrollbar">
            {allMessages.map((msg, index) => {
              return (
                <React.Fragment key={index}>
                  {msg.user.id === params.userId ? (
                    <UserMessageBox
                      message={msg.message}
                      time={msg.createdAt}
                    />
                  ) : (
                    <>
                      <AdminMessageBox
                        message={msg.message}
                        author={msg.user.name}
                        time={msg.createdAt}
                      />
                    </>
                  )}
                  {(index === allMessages.length - 1 ||
                    dayjs(msg.createdAt).format("DD-MM-YYYY") !==
                    dayjs(allMessages[index + 1].createdAt).format(
                      "DD-MM-YYYY",
                    )) && (
                      <Paper elevation={2} className="self-center py-1 px-2">
                        <Typography variant="body2">
                          {dayjs(msg.createdAt).format("DD-MM-YYYY") ===
                            dayjs().format("DD-MM-YYYY")
                            ? "Today"
                            : dayjs(msg.createdAt).format("DD-MM-YYYY") ===
                              dayjs().subtract(1, "day").format("DD-MM-YYYY")
                              ? "Yesterday"
                              : dayjs(msg.createdAt).format("DD-MM-YYYY")}
                        </Typography>
                      </Paper>
                    )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-1 items-center justify-center gap-2">
          {isLatestMessagesLoading || isOldMessagesLoading ? (
            <CircularProgress />
          ) : (
            <>
              <Typography variant="h5">
                Have any questions? Ask us here!
              </Typography>
              <Typography variant="subtitle1">
                We will get back to you as soon as possible.
              </Typography>
            </>
          )}
        </div>
      )}
      <Paper className="flex flex-row gap-4 px-4 py-2 align-top">
        <InputBase
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={newMessageMutation.isLoading}
          className="p-2"
          fullWidth
          multiline
          minRows={1}
          maxRows={4}
          autoFocus
        />
        <div>
          <IconButton size="large" onClick={handleSendMessage}>
            <SendIcon />
          </IconButton>
        </div>
      </Paper>
    </Container>
  );
}
