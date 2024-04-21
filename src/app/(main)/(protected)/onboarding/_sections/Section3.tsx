import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  TextField,
} from "@mui/material";

import { type SectionProps } from "../types";

export default function Section3(props: SectionProps) {
  return (
    <>
      <div className="flex flex-col w-full gap-3 mb-4">
        <FormControl>
          <TextField
            label="10th Marks"
            type="number"
            inputProps={{
              min: 0,
              max: 100,
              step: 0.01,
              pattern: "[0-9]+([.][0-9]{0,2})?",
            }}
            value={props.onboarding.tenthMarks}
            onChange={(e) =>
              props.setOnboarding({
                ...props.onboarding,
                tenthMarks: parseFloat(e.target.value.toString()),
              })
            }
            required
          />
          <FormHelperText>
            Please provide your 10th marks in percentage, if it is in CGPA then
            multiply it by 9.5
          </FormHelperText>
        </FormControl>
        <FormControl>
          <TextField
            label="12th Marks"
            type="number"
            inputProps={{
              min: 0,
              max: 100,
              step: 0.01,
              pattern: "[0-9]+([.][0-9]{0,2})?",
            }}
            value={props.onboarding.twelvethMarks}
            onChange={(e) =>
              props.setOnboarding({
                ...props.onboarding,
                twelvethMarks: parseFloat(e.target.value.toString()),
              })
            }
            required
          />
          <FormHelperText>
            Please provide your 12th marks in percentage, if it is in CGPA then
            multiply it by 9.5
          </FormHelperText>
        </FormControl>
      </div>
      <Box sx={{ mb: 2 }}>
        <div>
          {props.onNext && (
            <Button
              variant="contained"
              onClick={props.onNext}
              sx={{ mt: 1, mr: 1 }}
              disabled={
                props.isLoading ||
                !props.onboarding.tenthMarks ||
                !props.onboarding.twelvethMarks
              }
            >
              Continue
            </Button>
          )}
          {props.onFinish && (
            <LoadingButton
              variant="contained"
              onClick={props.onFinish}
              disabled={
                !props.onboarding.tenthMarks || !props.onboarding.twelvethMarks
              }
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
