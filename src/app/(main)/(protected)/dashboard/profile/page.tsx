"use client";

import { useState } from "react";

import CachedIcon from "@mui/icons-material/Cached";
import CreateIcon from "@mui/icons-material/Create";
import DoneIcon from "@mui/icons-material/Done";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  TextField,
  ToggleButton,
  Tooltip,
  Typography,
} from "@mui/material";

import FullPageLoader from "~/app/common/components/FullPageLoader";
import PasswordModal from "~/app/common/components/PasswordModal";
import { api } from "~/trpc/react";

export default function UserProfile() {
  const [mobileActive, setMobileActive] = useState(false),
    [emailActive, setEmailActive] = useState(false),
    [phone, setPhone] = useState(""),
    [email, setEmail] = useState(""),
    [openUpdateCourseDetails, setOpenUpdateCourseDetails] = useState(false);

  const updateCourseDetailsMutation =
    api.student.updateAviralData.useMutation();

  const handleCourseDetailsSubmit = (password: string) => {
    updateCourseDetailsMutation.mutate(password);
  };

  const {
    data: profile,
    isLoading,
    isError,
  } = api.student.getStudentProfile.useQuery();
  const saveChangesMutation = api.student.updateStudentDetails.useMutation();
  const updateDetails = (phone: string, email: string) => {
    saveChangesMutation.mutate({ phone, email });
  };
  function isSaveButtonDisabled() {
    return profile.phone === phone && (profile.email === email || !email);
  }
  if (isLoading) {
    return <FullPageLoader />;
  }
  return (
    <>
      <PasswordModal
        open={openUpdateCourseDetails}
        setOpen={setOpenUpdateCourseDetails}
        onSubmit={handleCourseDetailsSubmit}
      />
      <Container fixed className=" flex flex-col gap-8">
        <Container
          className="flex flex-wrap justify-between items-center"
          sx={{
            borderBottom: "1px solid",
            borderColor: "divider",
            paddingY: "16px",
            paddingX: "8px",
          }}
        >
          <Typography variant="h4" className="hidden md:block" color="primary">
            My Profile
          </Typography>
          <Typography variant="h5" className="md:hidden block" color="primary">
            My Profile
          </Typography>
          {!isError && (
            <Tooltip title="Update Course Details">
              <IconButton onClick={() => setOpenUpdateCourseDetails(true)}>
                {updateCourseDetailsMutation.isLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  <CachedIcon className="text-2xl" />
                )}
              </IconButton>
            </Tooltip>
          )}
        </Container>
        {isError ? (
          <Container className="flex flex-wrap jutify-center items-center">
            <Typography
              variant="body1"
              className="w-full font-medium text-center"
              color="error.main"
            >
              {" "}
              Some Error Occured
            </Typography>
          </Container>
        ) : (
          <>
            <Container className="flex flex-wrap jutify-around items-center">
              <TextField
                disabled
                label="Name"
                defaultValue={profile.user.name}
                fullWidth
              />
            </Container>
            <Container className="flex flex-wrap justify-between items-center gap-4 ">
              <TextField
                disabled
                label="Enrollment Number"
                defaultValue={profile.user.username}
                className="md:basis-[30%] sm:basis-[45%] basis-full"
              />
              <Box
                className="flex flex-row flex-nowrap gap-2 rounded-lg border-solid  p-3.5 border-2 md:basis-[30%] sm:basis-[45%] basis-full"
                sx={{
                  borderColor: "divider",
                }}
              >
                <Typography variant="body1" className="font-medium">
                  CGPA :
                </Typography>
                <Typography
                  variant="body1"
                  className="font-bold"
                  color={
                    profile.cgpa === 6.9
                      ? "#FFD700"
                      : profile.cgpa < 7
                        ? "error.main"
                        : profile.cgpa < 7.5
                          ? "warning.main"
                          : "success.main"
                  }
                >
                  {Number(profile.cgpa)}
                </Typography>
              </Box>
              <Box
                className="flex flex-row flex-nowrap gap-2 rounded-md border-solid  py-3.5 px-2 border-2 md:basis-[30%] sm:basis-[45%] basis-full "
                sx={{
                  borderColor: "divider",
                }}
              >
                <Typography variant="body1" className="font-medium">
                  Credits:
                </Typography>
                <Typography
                  variant="body1"
                  className="font-bold"
                  color="primary"
                >
                  {`${profile.completedCredits} / ${profile.totalCredits}`}
                </Typography>
              </Box>
              <TextField
                disabled
                label="Current Semester"
                defaultValue={profile.currentSemester}
                className="md:basis-[30%] sm:basis-[45%] basis-full"
              />
              <TextField
                disabled
                label="Admission Year"
                defaultValue={profile.admissionYear}
                className="md:basis-[30%] sm:basis-[45%] basis-full"
              />
              <TextField
                disabled
                label="Program"
                defaultValue={profile.program}
                className="md:basis-[30%] sm:basis-[45%] basis-full"
              />
            </Container>
            <Divider />
            <Container className="flex flex-nowrap jutify-around items-center gap-2">
              <TextField
                disabled={!mobileActive}
                label="Mobile Number"
                defaultValue={profile.phone}
                onChange={(e) => setPhone(e.target.value)}
                onFocus={(e) => setPhone(e.target.value)}
                fullWidth
                focused={mobileActive}
              />

              <ToggleButton
                value="check"
                selected={mobileActive}
                color={mobileActive ? "success" : undefined}
                onChange={() => {
                  setMobileActive((mobile) => {
                    if (mobile) {
                      return false;
                    }
                    setEmailActive(false);
                    return true;
                  });
                }}
                className="p-3.5"
              >
                {mobileActive ? <DoneIcon /> : <CreateIcon />}
              </ToggleButton>
            </Container>
            <Container className="flex flex-nowrap jutify-around items-center gap-2">
              <TextField
                disabled={!emailActive}
                label="Email"
                placeholder="john@smith.com"
                defaultValue={profile.email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={(e) => setEmail(e.target.value)}
                fullWidth
                focused={emailActive}
              />

              <ToggleButton
                value="check"
                selected={emailActive}
                color={emailActive ? "success" : undefined}
                onChange={() => {
                  setEmailActive((resumeLink) => {
                    if (resumeLink) {
                      return false;
                    }
                    setMobileActive(false);
                    return true;
                  });
                }}
                className="p-3.5"
              >
                {emailActive ? <DoneIcon /> : <CreateIcon />}
              </ToggleButton>
            </Container>
            <Container className="flex justify-end">
              <LoadingButton
                variant="contained"
                className="font-bold"
                disabled={isSaveButtonDisabled()}
                loading={saveChangesMutation.isLoading}
                onClick={() =>
                  updateDetails(phone || profile.phone, email || profile.email)
                }
              >
                Save Changes
              </LoadingButton>
            </Container>
          </>
        )}
      </Container>
    </>
  );
}
