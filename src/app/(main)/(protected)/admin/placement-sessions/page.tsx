"use client"

import { Suspense } from "react";

import FiberManualRecordTwoToneIcon from "@mui/icons-material/FiberManualRecordTwoTone"
import {
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Typography} from "@mui/material/index";

import NewSessionModal from "./NewSessionModal"
import { useRouter } from "next/navigation";
// import SearchFilter from "~/app/common/SearchFilter";

// import AdminList from "./AdminList";
// import NewAdminModal from "./NewAdminModal";

export default  function ManageAdminsPage(
  // {
  // searchParams,
// }: {
  // searchParams: { [key: string]: string | string[] | undefined };
// }
) {
  // const query = Array.isArray(searchParams?.q)
  //   ? searchParams?.q[0]
  //   : searchParams?.q;

  const router = useRouter();
  return (
    <Container className="flex flex-col gap-4 py-4">
      <div className="flex flex-row justify-between items-center">
        <Typography variant="h5" color="primary" className="px-4">
          Placement Sessions
        </Typography>
        <NewSessionModal />
      </div>
      <Divider />

      <div className="grid gap-2 grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
          {[2021,2022,2023,2024].map((el) => (
            <Button
              variant="outlined"
              className="px-2 w-full h-full"
              sx={{
                outlineColor: 'secondary.main',
              }}
              onClick={() => {
                router.push(`/admin/placement-sessions/${el}`);
              }}
            >
              <div className="flex flex-nowrap gap-2 items-center justify-center w-full">
                {/* <div className="bg-white rounded-md">
                  <img
                    className={`p-0 rounded-md object-contain object-center aspect-square`}
                    alt={company.name}
                    src={company.logo}
                    height={100}
                    width={100}
                  />
                </div> */}

                {/* <Divider orientation="vertical" flexItem /> */}
                <div className="flex-grow mx-auto">
                  <Typography
                    color="primary"
                    variant="h6"
                    className="text-center"
                    sx={{
                      fontWeight: 600,
                      textTransform: 'capitalize',
                    }}
                  >
                    {el}
                  </Typography>
                  {/* <Chip
                    label={company.currentStatus}
                    sx={{
                      textTransform: 'capitalize',
                    }}
                    size="small"
                    variant="outlined"
                    color={
                      company.currentStatus === 'registration open'
                        ? 'secondary'
                        : company.currentStatus === 'registration closed'
                        ? 'warning'
                        : company.currentStatus === 'shortlisting'
                        ? 'info'
                        : 'success'
                    }
                    icon={
                      <FiberManualRecordTwoToneIcon
                        sx={{
                          fontSize: '1rem',
                        }}
                      />
                    }
                  /> */}
                </div>
              </div>
            </Button>
          ))}
        </div>
      {/* <SearchFilter allowedFilters={{ textInput: true }} /> */}
      <Suspense
        // key={query}
        fallback={
          <div className="w-full flex justify-center items-center">
            <CircularProgress />
          </div>
        }
      >
        {/* <AdminList query={query} /> */}
      </Suspense>
    </Container>
  );
}
