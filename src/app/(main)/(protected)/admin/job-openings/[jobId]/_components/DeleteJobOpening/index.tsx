"use client";
import LoadingButton from "@mui/lab/LoadingButton";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";

export default function DeleteJobOpening({ jobId }: { jobId: string }) {

    const router = useRouter();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const deleteJobOpeningMutation = api.jobOpenings.deleteJobOpening.useMutation({
        onSuccess: () => {
            router.replace("/admin/job-openings");
        },
    });
    return <>
        <IconButton
            size="small"
            color="error"
            onClick={() => setIsDeleteDialogOpen(true)}
        >
            Delete
        </IconButton>
        <Dialog
            open={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            PaperProps={{
                component: "form",
                onSubmit: (e) => {
                    e.preventDefault();
                    deleteJobOpeningMutation.mutate(jobId);
                },
            }}
        >
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogContent>
                Do you really want to delete this job opening?
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
                    loading={deleteJobOpeningMutation.isLoading}
                >
                    Remove
                </LoadingButton>
            </DialogActions>
        </Dialog>
    </>
}