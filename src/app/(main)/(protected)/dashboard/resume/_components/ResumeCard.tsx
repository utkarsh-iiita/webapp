"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";

import { api } from "~/trpc/react";

import PDFViewer from "./PdfViewer";

export default function ResumeCard(props: {
  id: string;
  name: string;
  createdAt: Date;
  src: string;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const router = useRouter();

  const deleteResumeMutation =
    api.studentResume.deleteStudentResume.useMutation({
      onSuccess: () => {
        setAnchorEl(null);
        setDialogOpen(false);
        router.refresh();
      },
    });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card>
      <CardMedia className="w-full">
        <PDFViewer file={props.src} />
      </CardMedia>

      <CardContent className="flex flex-row justify-between">
        <div className="flex flex-col w-[60%]">
          <Typography component="div" className="w-fit" variant="h6">
            {props.name}
          </Typography>
          <Link
            href={props.src}
            target="_blank"
            className="flex flex-row items-center gap-1 hover:underline w-full"
          >
            <Typography
              variant="caption"
              className="whitespace-nowrap overflow-hidden text-ellipsis w-fit"
            >
              {props.src}
            </Typography>
            <OpenInNewIcon fontSize="inherit" />
          </Link>
        </div>
        <div className="-mr-2 -mt-1">
          <IconButton onClick={handleClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem
              onClick={() => {
                setDialogOpen(true);
                handleClose();
              }}
            >
              Delete
            </MenuItem>
          </Menu>
        </div>
      </CardContent>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        PaperProps={{
          component: "form",
          onSubmit: (e) => {
            e.preventDefault();
            deleteResumeMutation.mutate(props.id);
          },
        }}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          You will be deleting your resume with name{" "}
          <strong>{props.name}</strong>.
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={() => setDialogOpen(false)} variant="contained">
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            color="error"
            variant="outlined"
            loading={deleteResumeMutation.isLoading}
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
