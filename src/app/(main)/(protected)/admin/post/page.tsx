"use client";

import Link from "next/link";

import PostAddIcon from '@mui/icons-material/PostAdd';
import {
  Box,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";

import { api } from "~/trpc/react";

import PostRow from "./_components/PostRow";
import { useState } from "react";
import PlacementTypeSelector from "../_components/PlacementTypeSelector";

function Page() {
  const [jobType, setJobType] = useState<string | null>(null);
  const { data: allPosts, isLoading } = api.post.getLatestPostAdmin.useQuery({
    jobType
  });

  return (
    <>
      <Container className="flex flex-col gap-4 py-4">
        <div className="flex flex-row justify-between">
          <Typography variant="h5" color="primary" className="px-4">
            All Posts
          </Typography>
          <div className="flex flex-row items-center gap-4">
            <PlacementTypeSelector
              selectedPlacementTypes={jobType}
              setSelectedPlacementTypes={setJobType}
            />
            <Link href="./post/new">
              <IconButton>
                <PostAddIcon />
              </IconButton>
            </Link>
          </div>
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
