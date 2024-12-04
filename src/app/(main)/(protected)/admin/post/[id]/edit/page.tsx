"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PostGroupSelector from "../../_components/ParticipatingGroupsSelector";
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


import FullPageLoader from "~/app/common/components/FullPageLoader";
import TextEditor from "~/app/common/components/TextEditor";
import { api } from "~/trpc/react";
import IndividualParticipantsSelector from "../../IndividualParticipantSelector";
import { type UserMicro } from "../../IndividualParticipantSelector/types";
import PlacementTypeSelector from "../../../_components/PlacementTypeSelector";
export default function NewPost({ params }: { params: { id: string } }) {
  const { data, isLoading } = api.post.getPost.useQuery(params.id);

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
  const updatePostMutation = api.post.updatePost.useMutation({
    onSuccess: () => {
      handleClose();
      router.replace("./");
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    const content = contentRef.current?.getContent();
    if (!content) return;
    updatePostMutation.mutate({
      id: params.id,
      title,
      content,
      participatingGroups,
      individualParticipants: individualParticipants.map(
        (participant) => participant.id,
      ),
      jobType,
    });
  };

  useEffect(() => {
    if (data?.title) {
      setTitle(data.title);
    }
  }, [data]);

  if (isLoading) {
    return <FullPageLoader />;
  }
  return (
    <>
      <Container className="flex flex-col h-full relative">
        <div className="flex flex-row justify-between items-center py-4">
          <Typography variant="h5" color="primary" className="px-4">
            Edit Post
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

            <TextEditor height="40vmin" value={data.content} ref={contentRef} />
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

            <div>
              <Button
                variant="contained"
                disabled={!title}
                onClick={() => setOpen(true)}
              >
                Save Changes
              </Button>
              <Dialog
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                  component: "form",
                  onSubmit: handleSubmit,
                }}
              >
                <DialogTitle>Save Changes?</DialogTitle>
                <DialogContent>
                  Do you really want to update this post?
                </DialogContent>
                <DialogActions className="p-4">
                  <Button onClick={() => setOpen(false)} variant="outlined">
                    Cancel
                  </Button>
                  <LoadingButton
                    type="submit"
                    color="success"
                    variant="contained"
                    loading={updatePostMutation.isLoading}
                  >
                    Save Changes
                  </LoadingButton>
                </DialogActions>
              </Dialog>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
