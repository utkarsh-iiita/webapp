"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import LoadingButton from "@mui/lab/LoadingButton";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Typography,
} from "@mui/material";

import TextEditor from "~/app/common/components/TextEditor";
import { api } from "~/trpc/react";
import PostGroupSelector from "../_components/ParticipatingGroupsSelector";
import IndividualParticipantsSelector from "../IndividualParticipantSelector";
import { type UserMicro } from "../IndividualParticipantSelector/types";
import PlacementTypeSelector from "../../_components/PlacementTypeSelector";

export default function NewPost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const [participatingGroups, setParticipatingGroups] = useState([]);
  const [individualParticipants, setIndividualParticipants] = useState<
    UserMicro[]
  >([]);
  const [jobType, setJobType] = useState<string | null>(null);
  const contentRef = useRef<any>();
  const handleClose = () => {
    setOpen(false);
  };
  const createPostMutation = api.post.addNewPost.useMutation({
    onSuccess: () => {
      handleClose();
      router.replace("./");
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    const content = contentRef.current?.getContent();
    if (!content) return;
    createPostMutation.mutate({
      title,
      content,
      participatingGroups,
      individualParticipants: individualParticipants.map(
        (participant) => participant.id,
      ),
      jobType,
    });
  };

  const isCreationDisabled = () => {
    const content = contentRef.current?.getContent();
    if (!content) return true;
    return false;
  }


  return (
    <>
      <Container className="flex flex-col h-full relative">
        <div className="flex flex-row justify-between items-center py-4">
          <Typography variant="h5" color="primary" className="px-4">
            New Post
          </Typography>
        </div>
        <Divider />
        <div className=" flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4 py-4">
            <TextField
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              label="Title"
              variant="outlined"
            />

            <TextEditor height="40vmin" value="" ref={contentRef} />
            <PostGroupSelector
              value={participatingGroups}
              onChange={setParticipatingGroups}
            />
            <IndividualParticipantsSelector
              individualParticipants={individualParticipants}
              setIndividualParticipants={setIndividualParticipants}
            />
            <PlacementTypeSelector
              selectedPlacementTypes={jobType}
              setSelectedPlacementTypes={setJobType}
            />
            <Typography variant="caption" className="-mt-3" color="GrayText">
              * Job Type is only used to filter posts on admin side
            </Typography>
            <div>
              <Button
                variant="contained"
                disabled={!title}
                onClick={() => setOpen(true)}
              >
                Create
              </Button>
              <Dialog
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                  component: "form",
                  onSubmit: handleSubmit,
                }}
              >
                {isCreationDisabled() ? <>
                  <DialogContent>
                    Please add content to post
                  </DialogContent>
                  <DialogActions className="p-4">
                    <Button onClick={() => setOpen(false)} variant="contained">
                      Ok
                    </Button>
                  </DialogActions>
                </> : <>
                  <DialogTitle>Create new Post?</DialogTitle>
                  <DialogContent>
                    Do you really want to create this post?
                  </DialogContent>
                  <DialogActions className="p-4">
                    <Button onClick={() => setOpen(false)} variant="outlined">
                      Cancel
                    </Button>
                    <LoadingButton
                      type="submit"
                      color="success"
                      variant="contained"
                      loading={createPostMutation.isLoading}
                    >
                      Create
                    </LoadingButton>
                  </DialogActions>
                </>}
              </Dialog>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
