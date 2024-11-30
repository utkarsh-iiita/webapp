"use client";

import MailOutlineIcon from "@mui/icons-material/MailOutline";
import {
  Box,
  CircularProgress,
  Container,
  Divider,
  Typography,
} from "@mui/material";

import { api } from "~/trpc/react";

import PostRow from "./_components/PostRow";

function Page() {
  const { data: allPosts, isLoading } = api.post.getLatestPost.useQuery({});

  return (
    <>
      <Container className="flex flex-col gap-4 py-4">
        <Typography variant="h5" color="primary" className="px-4">
          Inbox
        </Typography>
        <Divider />
        {isLoading ? (
          <Container className="h-96 w-full flex justify-center items-center">
            <CircularProgress />
          </Container>
        ) : (
          <Box className="flex flex-col gap-2">
            {allPosts?.length ? (
              allPosts.map((post) => (
                <PostRow
                  id={post.id}
                  key={post.id}
                  title={post.title}
                  createdAt={post.createdAt}
                />
              ))
            ) : (
              <div className="flex flex-col justify-center items-center gap-2">
                <MailOutlineIcon sx={{ fontSize: 100 }} />
                <Typography variant="h6" color="primary">
                  No posts yet!
                </Typography>
              </div>
            )}
          </Box>
        )}
      </Container>
    </>
  );
}

export default Page;
