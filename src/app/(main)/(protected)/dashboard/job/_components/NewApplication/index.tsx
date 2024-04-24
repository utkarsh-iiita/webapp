"use client";

import { useState } from "react";

import ApplicationForm from "./ApplicationForm";
import ApplyButton from "./ApplyButton";

interface NewApplicationProps {
  id: string;
  canRegister: boolean;
  alreadyRegistered: boolean;
  registrationStart: Date;
  registrationEnd: Date;
}

export default function NewApplication(props: NewApplicationProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <ApplyButton
        {...props}
        onClick={() => {
          setOpen(true);
        }}
      />
      <ApplicationForm jobOpeningId={props.id} open={open} setOpen={setOpen} />
    </>
  );
}
