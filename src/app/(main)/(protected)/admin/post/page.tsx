"use client"

import { Box, CircularProgress, Container, Divider, TextField, Typography } from "@mui/material";

import { api } from "~/trpc/react"


function Page() {
  const { data: allPosts, isLoading } = api.post.getLatestPost.useQuery();

  return (
    <>
      <Typography variant="subtitle1" className="-mt-2" color="primary">
        All Posts
      </Typography>
      <Divider className="mb-4 mt-2" />
      <Container maxWidth="xl" className="m-0 p-0">
        <Box className="mb-4 flex md:flex-row flex-col gap-4 md:gap-2 md:items-center">
          <div className="flex flex-nowrap flex-grow w-full">
            {/* <TextField
              label="Search"
              variant="outlined"
              size="small"
              className="flex-grow mr-1"
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            /> */}
            {/* <IconButton
              sx={{
                backgroundColor: 'primary.main',
                borderRadius: '8px',
                marginRight: '4px',
              }}
              onClick={handleSearch}
            >
              <SearchIcon />
            </IconButton> */}
          </div>
        </Box>
        {(isLoading) && (
          <Container className="h-96 w-full flex justify-center items-center">
            <CircularProgress />
          </Container>
        )}
        {
          <Box className="flex flex-col gap-2">
            {/* {allPosts &&
              allPosts.map((post) => (
                <Post
                  key={post._id}
                  id={post._id}
                  title={post.title}
                  baseUrl={'post/'}
                  description={post.description}
                  company={post.company}
                  status={post.status}
                  createdAt={post.createdAt}
                />
              ))} */

            }
          </Box>
        }
      </Container>
    </>










  )
}

export default Page
