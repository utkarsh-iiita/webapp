"use client";

import {
  Box,
  CircularProgress,
  Container,
  Divider,
  TextField,
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
          All Posts
        </Typography>
        <Divider />
        {isLoading && (
          <Container className="h-96 w-full flex justify-center items-center">
            <CircularProgress />
          </Container>
        )}
        {
          <Box className="flex flex-col gap-2">
            {allPosts &&
              allPosts.map((post) => (
                <PostRow
                  id={post.id}
                  key={post.id}
                  title={post.title}
                  createdAt={post.createdAt}
                />
              ))}
          </Box>
        }
      </Container>
    </>
  );
}

export default Page;
