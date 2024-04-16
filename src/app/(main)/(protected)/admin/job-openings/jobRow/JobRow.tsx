import { useState } from "react";

import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import LoadingButton from "@mui/lab/LoadingButton";
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Typography } from "@mui/material";

import dayjs from "~/app/_utils/extendedDayjs";
import { api } from "~/trpc/react";
interface JobProps {
    id: string;
    title: string;
    location: string;
    role: string;
    pay: string
    company: {
        name: string;
        website: string;
        logo: string;

    };
    placementType: {
        name: string;
    }
    registrationStart: Date;
    registrationEnd: Date;
}

export default function JobRow(props: JobProps) {
    // const [open, setOpen] = useState(false);
    // const utils = api.useUtils();
    // const deleteFaqMutation = api.faq.deleteFaq.useMutation({
    //     onSuccess: () => {
    //         setOpen(false);
    //         utils.faq.invalidate()
    //     },
    // });
    return (

        <Paper className="flex flex-col gap-2 py-2 px-4">
            <div className="flex flex-col justify-between">
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col justify-between">
                        <Typography variant="h6" color="primary">

                            <strong>{props.title}</strong>

                        </Typography>
                        <Typography variant="body2" >
                            {props.company.name}
                        </Typography>
                    </div>


                    <Avatar alt="Remy Sharp" src={props.company.logo} variant="square" style={{
                        borderRadius: "8px"
                    }} />




                </div>



                <div className="flex flex-row justify-between mt-3">
                    <Typography variant="body1" >
                        <div className="flex flex-row justify-between">
                            <WorkOutlineIcon color="primary" sx={{ mr: 1, color: "primary" }} />
                            <strong>{props.placementType.name}</strong>
                        </div>


                    </Typography>
                    <Typography variant="body1" >
                        <div className="flex flex-row justify-between">
                            <LocationOnIcon color="primary" sx={{ mr: 1, color: "primary" }} />
                            <strong>{props.location}</strong>
                        </div>


                    </Typography>
                    <Typography variant="body1" >
                        <div className="flex flex-row justify-between">
                            <CurrencyRupeeIcon color="primary" sx={{ mr: 1 }} />
                            <strong>{props.pay}</strong>
                        </div>


                    </Typography>
                </div>


            </div>
            {/* <Button variant="contained" color="error"
                onClick={() => {
                    // deleteFaqMutation.mutate(props.id)
                    setOpen(true);
                }}
            >
                Delete
            </Button>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                    component: "form",
                    onSubmit: (e) => {
                        e.preventDefault();
                        deleteFaqMutation.mutate(props.id)
                    },
                }}
            >
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogContent>

                    <strong>
                        You will be deleting FAQ !
                    </strong>

                </DialogContent>
                <DialogActions
                    className="p-4">
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
            </Dialog> */}



        </Paper>

    );
}



