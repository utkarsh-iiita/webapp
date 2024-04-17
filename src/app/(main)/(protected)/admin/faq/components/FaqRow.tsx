import { useState } from "react";

import LoadingButton from "@mui/lab/LoadingButton";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Typography,
} from "@mui/material";

import dayjs from "~/app/_utils/extendedDayjs";
import { api } from "~/trpc/react";
interface FaqProps {
  id: string;
  question: string;
  answer: string;
  createdAt: Date;
  author: {
    name: string;
  };
}

export default function FaqRow(props: FaqProps) {
  const [open, setOpen] = useState(false);
  const utils = api.useUtils();
  const deleteFaqMutation = api.faq.deleteFaq.useMutation({
    onSuccess: () => {
      setOpen(false);
      utils.faq.invalidate();
    },
  });
  return (
    <Paper className="flex flex-row gap-2 p-3">
      <div className="flex flex-col justify-between flex-1">
        <Typography variant="body1">
          <strong>{props.question}</strong>
        </Typography>

        <Typography variant="caption" className="whitespace-nowrap mb-2">
          {props.author.name} · {dayjs(props.createdAt).fromNow()}
        </Typography>
        <Typography variant="body1">{props.answer}</Typography>
      </div>
      <div className="flex flex-row justify-end">
        <Button
          variant="outlined"
          size="small"
          color="error"
          className="h-fit"
          onClick={() => {
            // deleteFaqMutation.mutate(props.id)
            setOpen(true);
          }}
        >
          Delete
        </Button>
      </div>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          component: "form",
          onSubmit: (e) => {
            e.preventDefault();
            deleteFaqMutation.mutate(props.id);
          },
        }}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <strong>You will be deleting FAQ !</strong>
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={() => setOpen(false)} variant="contained">
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            color="error"
            variant="outlined"
            loading={deleteFaqMutation.isLoading}
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
