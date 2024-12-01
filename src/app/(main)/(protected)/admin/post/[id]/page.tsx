"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import LoadingButton from "@mui/lab/LoadingButton";
import PostGroupSelector from "../_components/ParticipatingGroupsSelector";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";

import dayjs from "~/app/_utils/extendedDayjs";
import FullPageLoader from "~/app/common/components/FullPageLoader";
import { api } from "~/trpc/react";
import IndividualParticipantsSelector from "../IndividualParticipantSelector";

export default function PostDisplayPage({

  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [participatingGroups, setParticipatingGroups] = useState([]);
  const deletePostMutation = api.post.deletePost.useMutation({
    onSuccess: () => {
      router.replace("/admin/post");
    },
  });
  const { data, isLoading } = api.post.getPostAdmin.useQuery(params.id);
  if (isLoading) {
    return <FullPageLoader />;
  }
  return (
    <Container>
      <div className="flex flex-row justify-between items-center">
        <div className="p-2">
          <Typography variant="h5">
            <strong>{data.title}</strong>
          </Typography>
          <Typography variant="subtitle1" className="whitespace-nowrap">
            {data.author.name} · {dayjs(data.createdAt).fromNow()}

          </Typography>
        </div>
        <div className="flex flex-row gap-2">
          <Link href={"./" + data.id + "/edit"}>
            <IconButton size="small" color="success">
              <CreateIcon />
            </IconButton>
          </Link>
          <IconButton
            size="small"
            color="error"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <DeleteIcon />
          </IconButton>
          <Dialog
            open={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            PaperProps={{
              component: "form",
              onSubmit: (e) => {
                e.preventDefault();
                deletePostMutation.mutate(data.id);
              },
            }}
          >
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogContent>
              Do you really want to delete this post?
            </DialogContent>
            <DialogActions className="p-4">
              <Button
                onClick={() => setIsDeleteDialogOpen(false)}
                variant="contained"
              >
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                color="error"
                variant="outlined"
                loading={deletePostMutation.isLoading}
              >
                Remove
              </LoadingButton>
            </DialogActions>
          </Dialog>
        </div>
      </div>
      <Divider />
      <Paper className="flex flex-col gap-2 p-2 mt-2">
        <div
          className="text-content"
          dangerouslySetInnerHTML={{
            __html: data.content,
          }}
        ></div>
      </Paper>
      <Divider className="my-2" />
      <PostGroupSelector
        value={data.participatingGroups}
        onChange={() => { }}
        disabled
      />
      <IndividualParticipantsSelector
        individualParticipants={data.individualParticipants.map((participant) => participant.user)}
        setIndividualParticipants={() => { }}
        hideSelector
        disabled
      />
    </Container>
  );
}
