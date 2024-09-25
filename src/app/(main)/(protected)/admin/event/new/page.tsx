"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";

import TextEditor from "~/app/common/components/TextEditor";
import { api } from "~/trpc/react";

import CompanyDropdown from "../../_components/CompanyDropdown";
import IndividualParticipantsSelector from "../_components/IndividualParticipantSelector";
import { type UserMicro } from "../_components/IndividualParticipantSelector/types";
import JobOpeningSelector from "../_components/JobOpeningSelector";
import ParticipatingGroupSelector from "../_components/ParticipatingGroupsSelector";
import useValueUx from "../_hooks/useValueUx";

export default function NewEventPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryJobOpening = searchParams.get("job-opening");

  const [eventDetails, setEventDetails] = useState({
    title: "",
    type: "",
    description: "",
    location: "",
    link: "",
  });
  const descEditorRef = useRef<any>();
  const [startTime, setStartTime] = useState<any>(null);
  const [endTime, setEndTime] = useState<any>(null);

  const [jobOpening, setJobOpening] = useState<string | null>(queryJobOpening);
  const [jobOpeningDetails, setJobOpeningDetails] = useState<JobOpening | null>(
    null,
  );
  const [company, setCompany] = useState<Company | null>(null);

  const [participatingGroups, setParticipatingGroups] = useState<string[]>([]);
  const [individualParticipants, setIndividualParticipants] = useState<
    UserMicro[]
  >([]);

  const [hidden, setHidden] = useState<boolean>(true);

  const { data: eventTypes, isLoading: isEventTypesLoading } =
    api.events.getEventTypes.useQuery();

  useValueUx(jobOpeningDetails, company, setCompany);

  const createEventMutation = api.events.createEvent.useMutation({
    onSuccess(data) {
      router.replace(`./${data.id}`);
    },
  });
  const isValid = useMemo(() => {
    if (
      !startTime ||
      !endTime ||
      !eventDetails.title ||
      !eventDetails.type ||
      !eventDetails.location
    ) {
      return false;
    }
    return true;
  }, [eventDetails, startTime, endTime]);

  const onSubmit = () => {
    if (!isValid) return;
    console.log(typeof startTime);
    createEventMutation.mutate({
      ...eventDetails,
      startTime: startTime,
      endTime: endTime,
      jobOpeningId: jobOpening,
      company,
      participatingGroups,
      individualParticipants: individualParticipants.map(
        (participant) => participant.id,
      ),
      hidden,
    });
  };

  return (
    <>
      <Container className="flex flex-col gap-4 py-4">
        <div className="flex flex-row justify-between items-center">
          <Typography variant="h5" color="primary" className="px-4">
            New Event
          </Typography>
        </div>
        <Divider />
        <FormControl>
          <InputLabel required>Event Type</InputLabel>
          <Select
            label="Event Type"
            value={eventDetails.type}
            onChange={(e) =>
              setEventDetails((prev) => ({ ...prev, type: e.target.value }))
            }
            required
            endAdornment={
              isEventTypesLoading && (
                <CircularProgress color="inherit" size={20} className="mr-6" />
              )
            }
          >
            {eventTypes?.map((type) => (
              <MenuItem key={type.label} value={type.label}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Title"
          value={eventDetails.title}
          onChange={(e) =>
            setEventDetails((prev) => ({ ...prev, title: e.target.value }))
          }
          required
        />
        <div className="flex flex-row gap-4 w-full items-center">
          <DateTimePicker
            className="flex-grow"
            name="eventStart"
            value={startTime}
            onChange={(date) => setStartTime(date)}
            maxDateTime={endTime}
            label="Event Start Date and Time *"
          />
          <DoubleArrowIcon />
          <DateTimePicker
            className="flex-grow"
            name="eventEnd"
            value={endTime}
            onChange={(date) => setEndTime(date)}
            minDateTime={startTime}
            label="Event End Date and Time *"
          />
        </div>
        <TextField
          label="Location"
          value={eventDetails.location}
          onChange={(e) =>
            setEventDetails((prev) => ({ ...prev, location: e.target.value }))
          }
          required
        />
        <JobOpeningSelector
          jobOpeningId={jobOpening}
          jobOpeningDetails={jobOpeningDetails}
          setJobOpeningId={setJobOpening}
          setJobOpeningDetails={setJobOpeningDetails}
        />
        <CompanyDropdown company={company} setCompany={setCompany} />
        <ParticipatingGroupSelector
          participatingGroups={participatingGroups}
          setParticipatingGroups={setParticipatingGroups}
        />
        <IndividualParticipantsSelector
          individualParticipants={individualParticipants}
          setIndividualParticipants={setIndividualParticipants}
        />
        <TextField
          label="Link"
          value={eventDetails.link}
          onChange={(e) =>
            setEventDetails((prev) => ({ ...prev, link: e.target.value }))
          }
        />
        <TextEditor
          height="60vmin"
          value={eventDetails.description}
          ref={descEditorRef}
        />
        <div className="flex flex-row justify-end gap-2 items-center">
          <FormControlLabel
            control={
              <Checkbox
                checked={hidden}
                onChange={(_, checked) => setHidden(checked)}
              />
            }
            label="Hidden"
          />
          <LoadingButton
            variant="contained"
            disabled={!isValid}
            onClick={onSubmit}
            loading={createEventMutation.isLoading}
          >
            Create Event
          </LoadingButton>
        </div>
      </Container>
    </>
  );
}
