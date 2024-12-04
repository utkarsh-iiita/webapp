"use client";

import { useState } from "react";
import Link from "next/link";

import SearchIcon from "@mui/icons-material/Search";
import {
  CircularProgress,
  Container,
  FormControl,
  InputAdornment,
  OutlinedInput,
  Paper,
  Typography,
} from "@mui/material";

import { api } from "~/trpc/react";

export default function TrackStudentPage() {
  const [query, setQuery] = useState("");

  const { data: searchResults, isLoading } = api.student.searchStudent.useQuery(
    query,
    {
      enabled: query.length > 0,
    },
  );

  return (
    <Container
      className="h-full flex flex-col items-center justify-center"
      maxWidth="md"
    >
      <FormControl variant="standard" className="w-full">
        <OutlinedInput
          id="search-student-input"
          placeholder="Search Student"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
          autoComplete="off"
        />
      </FormControl>
      <div className="w-full my-2 h-[232px]">
        {query && isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <CircularProgress />
          </div>
        ) : (
          <div className="w-full flex flex-col gap-2">
            {searchResults?.map((student) => (
              <Link
                href={"./student/" + student.user.username}
                key={student.user.username}
              >
                <Paper
                  elevation={3}
                  className="w-full flex flex-row gap-2 py-2 px-4 items-end"
                >
                  <Typography variant="body1">{student.user.name}</Typography>
                  <Typography variant="subtitle2">
                    - {student.user.username.toUpperCase()}
                  </Typography>
                  <Typography variant="caption" color="GrayText">
                    ({student.program})
                  </Typography>
                </Paper>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
