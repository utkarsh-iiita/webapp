"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dayjs, { type Dayjs } from "dayjs";

import AddIcon from "@mui/icons-material/Add";
import LoadingButton from "@mui/lab/LoadingButton";
import { Button, Container, Divider, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

import FullPageLoader from "~/app/common/components/FullPageLoader";
import { api } from "~/trpc/react";



export default function NewPost() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");



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
                        <Typography variant="body1">
                            Add title
                        </Typography>
                        <TextField
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            label="This is a title" variant="outlined"
                        />

                        <Typography variant="body1">
                            Add content

                        </Typography>
                        <TextField
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            label="Content"
                            variant="outlined"
                        />
                        <div>
                            <Button variant="contained">Create</Button>
                        </div>

                    </div>
                </div>
            </Container>
        </>
    );
}
