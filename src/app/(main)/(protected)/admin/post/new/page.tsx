"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dayjs, { type Dayjs } from "dayjs";

import AddIcon from "@mui/icons-material/Add";
import LoadingButton from "@mui/lab/LoadingButton";
import { Button, Container, Divider, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

import FullPageLoader from "~/app/common/components/FullPageLoader";
import TextEditor from "~/app/common/components/TextEditor";
import { api } from "~/trpc/react";



export default function NewPost() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [open, setOpen] = useState<boolean>(false);
    const [content, setContent] = useState("");
    const createPostMutation = api.post.addNewPost.useMutation({
        onSuccess: () => {
            handleClose();
            router.replace('./');
        },
    });
    const handleClose = () => {
        setOpen(false);
    };
    const handleChange = (e) => {
        e.preventDefault();
        createPostMutation.mutate({
            title,
            content
        });
    };
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
                            label="Title" variant="outlined"
                        />

                        <TextEditor
                            height="40vmin"
                            value={content}
                            onChange={setContent}
                        />
                        <div>
                            <Button variant="contained" onClick={handleChange}>Create</Button>
                        </div>

                    </div>
                </div>
            </Container>
        </>
    );
}
