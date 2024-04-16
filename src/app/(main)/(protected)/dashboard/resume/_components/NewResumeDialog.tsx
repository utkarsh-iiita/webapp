"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FileUploader } from "react-drag-drop-files";

import DeleteIcon from "@mui/icons-material/Delete";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import { api } from "~/trpc/react";

import PdfViewer from "./PdfViewer";

export default function ResumeUploadDialog(props: {
  resumes: {
    id: string;
    name: string;
    src: string;
  }[];
}) {
  const [open, setOpen] = useState(false);
  const [resume, setResume] = useState<NewResume>({
    key: "",
    name: "",
    file: null,
  });
  const router = useRouter();
  const { data, status } = useSession();

  const uploadResumeMutation =
    api.studentResume.createStudentResume.useMutation({
      onSuccess: () => {
        router.refresh();
        handleClose();
      },
    });

  const handleClose = () => {
    setOpen(false);
    setResume({
      key: "",
      name: "",
      file: null,
    });
  };

  const hasError = useMemo(() => {
    return props.resumes.some(
      (res) => res.id === data?.user?.username + "/" + resume.key + ".pdf",
    );
  }, [resume.key]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (resume.file && resume.key && resume.name) {
        const reader = new FileReader();
        reader.onload = (e) => {
          uploadResumeMutation.mutate({
            key: resume.key,
            name: resume.name,
            fileDataUrl: e.target.result as string,
          });
        };
        reader.readAsDataURL(resume.file);
      }
    },
    [resume],
  );

  if (status === "loading") return null;
  return (
    <>
      <Tooltip title="Add new admin">
        <Button
          color="primary"
          variant="outlined"
          className="inline-flex p-2 min-w-0"
          onClick={() => setOpen(true)}
        >
          <NoteAddIcon />
        </Button>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Add New Resume</DialogTitle>
        <DialogContent className="flex flex-col gap-4">
          <DialogContentText>
            The resume name will only be visible to you and will help you
            identify each resume easily. The resume identifier will be used to
            generate a custom link for your resume.
          </DialogContentText>
          <TextField
            label="Name"
            required
            value={resume.name}
            onChange={(e) => setResume({ ...resume, name: e.target.value })}
          />
          {resume.file === null ? (
            <Paper className="text-md box-border w-full rounded-md mb-5 p-2 relative">
              <div className="flex items-center justify-center flex-wrap flex-col w-full py-8">
                <div className="text-center w-full text-base opacity-40">
                  Upload Resume
                </div>

                <div className="text-center w-full text-xs opacity-40">
                  Drag or drop or browse a file <br />
                  (only PDF files) max: 2.5mb
                </div>
                <div
                  style={{
                    opacity: 0,
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                  }}
                >
                  <FileUploader
                    classes="w-full h-full max-w-none min-w-0 box-border p-0"
                    handleChange={(file) => setResume({ ...resume, file })}
                    name="file"
                    maxSize={2.5}
                    types={["pdf"]}
                  />
                </div>
              </div>
            </Paper>
          ) : (
            <Card className="flex flex-col sm:flex-row relative">
              <CardMedia className="w-full sm:w-52">
                <PdfViewer file={resume.file} />
              </CardMedia>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flex: 1,
                }}
              >
                <CardContent sx={{ flex: "1 0 auto" }}>
                  <Typography component="div" variant="h6">
                    {resume.file.name}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    component="div"
                  >
                    {resume.file.size > 800 * 1024 ? (
                      <>{(resume.file.size / (1024 * 1024)).toFixed(2)} MB</>
                    ) : (
                      <>{(resume.file.size / 1024).toFixed(2)} KB</>
                    )}
                  </Typography>
                </CardContent>
                <div className="p-3">
                  <IconButton
                    color="error"
                    onClick={() => setResume({ ...resume, file: null })}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </Box>
            </Card>
          )}
          <TextField
            error={hasError}
            value={resume.key}
            onChange={(e) => {
              if (
                e.target.value &&
                e.target.value.match(/^[a-zA-Z0-9_-]+$/) === null
              )
                return;
              setResume({ ...resume, key: e.target.value });
            }}
            label="File identifier"
            id="outlined-start-adornment"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography color="text.disabled">
                    {data?.user?.username}/
                  </Typography>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Typography color="text.disabled">.pdf</Typography>
                </InputAdornment>
              ),
            }}
            helperText={hasError ? "Identifier already exists" : ""}
            required
          />
        </DialogContent>
        <DialogActions className="p-4">
          <Button color="error" onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={uploadResumeMutation.isLoading}
          >
            Submit
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
