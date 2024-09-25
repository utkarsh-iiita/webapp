"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dayjs from "dayjs";

import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
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

export default function IndividualEventPage() {
  const router = useRouter();
  const { eventId } = useParams();
  const {
    data: event,
    isLoading,
    refetch,
  } = api.events.getAdminEvent.useQuery(eventId as string, {
    enabled: !!eventId,
  });

  const [disabled, setDisabled] = useState(true);

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

  const [jobOpening, setJobOpening] = useState<string | null>(null);
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

  const updateEventMutation = api.events.updateEvent.useMutation({
    onSuccess() {
      setDisabled(true);
      refetch();
    },
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const deleteEventMutation = api.events.deleteEvent.useMutation({
    onSuccess() {
      router.replace("./");
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
    updateEventMutation.mutate({
      id: event.id,
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

  useEffect(() => {
    if (event) {
      setEventDetails({
        title: event.title,
        type: event.type,
        description: event.description ?? "",
        location: event.location,
        link: event.link ?? "",
      });
      setStartTime(dayjs(event.startTime));
      setEndTime(dayjs(event.endTime));
      setJobOpening(event.jobOpening?.id);
      setCompany(event.company);
      setParticipatingGroups(
        event.participatingGroups?.map((grp) => grp.participatingGroup.id),
      );
      setIndividualParticipants(
        event.individualParticipants?.map((p) => p.user),
      );
      setHidden(event.hidden);
    }
  }, [event, disabled]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <CircularProgress size={28} />
      </div>
    );
  }

  return (
    <>
      <Container className="flex flex-col gap-4 py-4">
        <div className="flex flex-row justify-between items-center">
          <Typography variant="h5" color="primary" className="px-4">
            Event
          </Typography>

          <div className="flex flex-row gap-2">
            <ToggleButton
              value="check"
              selected={!disabled}
              color={!disabled ? "success" : undefined}
              onChange={() => {
                setDisabled(!disabled);
              }}
              size="small"
            >
              {!disabled ? (
                <DoneIcon fontSize="small" />
              ) : (
                <CreateIcon fontSize="small" />
              )}
            </ToggleButton>
            <Button
              variant="outlined"
              color="error"
              size="small"
              className="min-w-0"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <DeleteIcon fontSize="small" />
            </Button>
            <Dialog
              open={deleteDialogOpen}
              onClose={() => setDeleteDialogOpen(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Are you sure?"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Do you really want to delete this event?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDeleteDialogOpen(false)} autoFocus>
                  Cancel
                </Button>
                <Button
                  onClick={() => deleteEventMutation.mutate(event.id)}
                  color="error"
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
        <Divider />
        <FormControl disabled={disabled}>
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
          disabled={disabled}
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
            disabled={disabled}
          />
          <DoubleArrowIcon />
          <DateTimePicker
            className="flex-grow"
            name="eventEnd"
            value={endTime}
            onChange={(date) => setEndTime(date)}
            minDateTime={startTime}
            label="Event End Date and Time *"
            disabled={disabled}
          />
        </div>
        <TextField
          label="Location"
          value={eventDetails.location}
          onChange={(e) =>
            setEventDetails((prev) => ({ ...prev, location: e.target.value }))
          }
          required
          disabled={disabled}
        />
        <JobOpeningSelector
          jobOpeningId={jobOpening}
          jobOpeningDetails={jobOpeningDetails}
          setJobOpeningId={setJobOpening}
          setJobOpeningDetails={setJobOpeningDetails}
          disabled={disabled}
        />
        <CompanyDropdown
          company={company}
          setCompany={setCompany}
          disabled={disabled}
        />
        <ParticipatingGroupSelector
          participatingGroups={participatingGroups}
          setParticipatingGroups={setParticipatingGroups}
          disabled={disabled}
        />
        <IndividualParticipantsSelector
          individualParticipants={individualParticipants}
          setIndividualParticipants={setIndividualParticipants}
          disabled={disabled}
        />
        <TextField
          label="Link"
          value={eventDetails.link}
          onChange={(e) =>
            setEventDetails((prev) => ({ ...prev, link: e.target.value }))
          }
          disabled={disabled}
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
                disabled={disabled}
              />
            }
            label="Hidden"
          />
          {!disabled ? (
            <LoadingButton
              variant="contained"
              disabled={!isValid}
              onClick={onSubmit}
              loading={updateEventMutation.isLoading}
            >
              Save Changes
            </LoadingButton>
          ) : (
            <></>
          )}
        </div>
      </Container>
    </>
  );
}
