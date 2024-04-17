"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import AddBoxIcon from "@mui/icons-material/AddBox";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Tooltip,
} from "@mui/material";

import { api } from "~/trpc/react";

export default function NewfaqModal() {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);

  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const addFaqMutation = api.faq.addFaq.useMutation({
    onSuccess: () => {
      handleClose();
      router.refresh();
    },
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addFaqMutation.mutate({
      question,
      answer,
    });
  };

  return (
    <>
      <Tooltip title="Add new Faq">
        <Button
          color="primary"
          variant="outlined"
          className="inline-flex p-2 min-w-0"
          onClick={() => setOpen(true)}
        >
          <AddBoxIcon />
        </Button>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        className="w-full"
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Add New faq</DialogTitle>
        <DialogContent className="flex flex-col gap-4 w-full">
          <DialogContentText>Provide Question and Answer</DialogContentText>
          <TextField
            label="Question"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
            }}
            fullWidth
            required
          />
          <TextField
            label="Answer"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
            }}
            multiline
            maxRows={10}
            fullWidth
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
            loading={addFaqMutation.isLoading}
          >
            Submit
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
