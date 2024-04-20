import { Suspense } from "react";
import Link from "next/link";

import AddModeratorIcon from "@mui/icons-material/AddModerator";
import {
  Button,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Typography,
} from "@mui/material/index";

import { api } from "~/trpc/server";

export default async function ManageAdminsPage() {
  const years = await api.placementConfig.getAdminPlacementYears.query();

  return (
    <Container className="flex flex-col gap-4 py-4">
      <div className="flex flex-row justify-between items-center">
        <Typography variant="h5" color="primary" className="px-4">
          Placement Years
        </Typography>
        <Link href="./placement-years/new">
          <Button
            variant="contained"
            startIcon={<AddModeratorIcon />}
            className="hidden md:inline-flex"
          >
            Create New
          </Button>
          <IconButton color="primary" className="inline-flex md:hidden">
            <AddModeratorIcon />
          </IconButton>
        </Link>
      </div>
      <Divider />

      <div className="grid gap-2 grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
        {years.map((el) => (
          <Link href={"./placement-years/" + el}>
            <Button
              variant="outlined"
              className="px-2 w-full h-full"
              sx={{
                outlineColor: "secondary.main",
              }}
            >
              <div className="flex flex-nowrap gap-2 items-center justify-center w-full">
                <div className="flex-grow mx-auto">
                  <Typography
                    color="primary"
                    variant="h6"
                    className="text-center"
                    sx={{
                      fontWeight: 600,
                      textTransform: "capitalize",
                    }}
                  >
                    {el}
                  </Typography>
                </div>
              </div>
            </Button>
          </Link>
        ))}
      </div>
      <Suspense
        fallback={
          <div className="w-full flex justify-center items-center">
            <CircularProgress />
          </div>
        }
      ></Suspense>
    </Container>
  );
}
