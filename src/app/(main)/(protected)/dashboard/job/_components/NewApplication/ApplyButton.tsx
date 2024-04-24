import { Button } from "@mui/material";

import dayjs from "~/app/_utils/extendedDayjs";

interface ApplyButtonProps {
  canRegister: boolean;
  alreadyRegistered: boolean;
  registrationStart: Date;
  registrationEnd: Date;
  onClick?: () => void;
}

export default function ApplyButton(props: ApplyButtonProps) {
  const label = props.alreadyRegistered
    ? "Registered"
    : !props.canRegister
      ? "Not Eligible"
      : props.registrationStart > new Date()
        ? "Registration starts @"
        : props.registrationEnd < new Date()
          ? "Registration ended"
          : "Apply";
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={props.onClick}
        className="w-full md:w-fit flex flex-row flex-wrap"
        disabled={
          props.registrationStart > new Date() ||
          props.registrationEnd < new Date() ||
          props.alreadyRegistered ||
          !props.canRegister
        }
      >
        {label}
        {props.registrationStart > new Date() ? (
          <div>
            &thinsp;
            {dayjs(props.registrationStart).format("DD MMM, YYYY HH:mm")}
          </div>
        ) : (
          ""
        )}
      </Button>
    </>
  );
}
