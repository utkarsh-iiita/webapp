"use client";

import Link from "next/link";

import PostAddIcon from "@mui/icons-material/PostAdd";
import {
  Box,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";

import PostRow from "~/app/(main)/(protected)/admin/post/_components/PostRow";
import { api } from "~/trpc/react";

function Page() {
  const { data: allPosts, isLoading } = api.post.getLatestPost.useQuery({});

  return (
    <>
      <Container className="flex flex-col gap-4 py-4">
        <div className="flex flex-row justify-between">
          <Typography variant="h5" color="primary" className="px-4">
            Inbox
          </Typography>
          <Link href="./post/new">
            <IconButton>
              <PostAddIcon />
            </IconButton>
          </Link>
        </div>
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
