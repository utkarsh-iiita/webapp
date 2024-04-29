"use client";

import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import { Avatar, Paper, Typography } from "@mui/material";

interface JobProps {
  id: string;
  title: string;
  location: string;
  role: string;
  pay: string;
  company: {
    name: string;
    website: string;
    logo: string;
  };
  placementType: {
    name: string;
  };
  registrationStart: Date;
  registrationEnd: Date;
}

export default function JobRow(props: JobProps) {
  return (
    <Paper className="flex flex-col gap-2 py-3 px-3">
      <div className="flex flex-col justify-between">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col justify-between">
            <Typography variant="h6" color="primary">
              <strong>{props.title}</strong>
            </Typography>
            <Typography variant="body2">{props.company.name}</Typography>
          </div>

          <Avatar
            alt="Remy Sharp"
            src={props.company.logo}
            variant="square"
            style={{
              borderRadius: "8px",
            }}
          />
        </div>

        <div className="flex flex-row flex-wrap gap-2 justify-between mt-3">
          <div className="flex flex-row justify-between">
            <WorkOutlineIcon color="primary" sx={{ mr: 1, color: "primary" }} />
            <Typography variant="body1">{props.placementType.name}</Typography>
          </div>
          <div className="flex flex-row justify-between">
            <LocationOnIcon color="primary" sx={{ mr: 1, color: "primary" }} />
            <Typography variant="body1">{props.location}</Typography>
          </div>
          <div className="flex flex-row justify-between">
            <CurrencyRupeeIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="body1">{props.pay}</Typography>
          </div>
        </div>
      </div>
    </Paper>
  );
}
