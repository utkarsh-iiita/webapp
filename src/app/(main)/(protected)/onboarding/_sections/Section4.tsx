"use client";

import { useState } from "react";
import Link from "next/link";

import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Button, Checkbox, FormControlLabel } from "@mui/material";

import { type SectionProps } from "../types";

export default function Section2(props: SectionProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedNDAs, setAcceptedNDAs] = useState(false);

  return (
    <>
      <FormControlLabel
        className="items-start"
        control={
          <Checkbox
            checked={acceptedTerms}
            className="py-1"
            onChange={(e) => setAcceptedTerms(e.target.checked)}
          />
        }
        label={
          <>
            By checking this box, you agree to our{" "}
            <Link
              className="underline"
              href="https://utkarsh-resume.buddylonglegs.tech/Terms%20and%20Conditions.pdf"
              target="_blank"
            >
              terms and conditions
            </Link>
          </>
        }
        required
      />
      <FormControlLabel
        className="items-start"
        control={
          <Checkbox
            checked={acceptedNDAs}
            className="py-1"
            onChange={(e) => setAcceptedNDAs(e.target.checked)}
          />
        }
        label={
          <>
            By checking this box, you agree to all{" "}
            <Link
              className="underline"
              href="https://utkarsh-resume.buddylonglegs.tech/Mutual%20NDA.pdf"
              target="_blank"
            >
              NDAs
            </Link>
          </>
        }
        required
      />
      <Box sx={{ mb: 2 }}>
        <div>
          {props.onNext && (
            <Button
              variant="contained"
              onClick={props.onNext}
              sx={{ mt: 1, mr: 1 }}
              disabled={props.isLoading || !acceptedTerms || !acceptedNDAs}
            >
              Continue
            </Button>
          )}
          {props.onFinish && (
            <LoadingButton
              variant="contained"
              onClick={props.onFinish}
              disabled={!acceptedTerms || !acceptedNDAs}
              loading={props.isLoading}
              sx={{ mt: 1, mr: 1 }}
            >
              Finish
            </LoadingButton>
          )}
          {props.onPrevious && (
            <Button
              onClick={props.onPrevious}
              sx={{ mt: 1, mr: 1 }}
              disabled={props.isLoading}
            >
              Back
            </Button>
          )}
        </div>
      </Box>
    </>
  );
}
