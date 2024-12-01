"use client";

import { useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";

import AddBoxIcon from "@mui/icons-material/AddBox";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import {
  Button,
  Container,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

import { api } from "~/trpc/react";

import CalendarView from "./_views/calendar";
import ListView from "./_views/list";
import PlacementTypeSelector from "../_components/PlacementTypeSelector";

export default function EventsPage() {
  const [pageView, setPageView] = useState<"calendar" | "list">("calendar");
  const [view, setView] = useState<"month" | "week">("month");
  const [placementType, setPlacementType] = useState<string | null>(null);
  const [date, setDate] = useState<[Date, Date]>([
    dayjs()
      .startOf(view)
      .subtract(view === "month" ? 1 : 0, "w")
      .toDate(),
    dayjs()
      .endOf(view)
      .add(view === "month" ? 1 : 0, "w")
      .toDate(),
  ]);
  const [page, setPage] = useState(1);

  const { data: calendarEvents, isLoading: isCalendarEventLoading } =
    api.events.getAdminEventsInTimeRange.useQuery(
      {
        startDate: date[0],
        endDate: date[1],
        placementType
      },
      { enabled: pageView === "calendar" },
    );

  const { data: listEvents, isLoading: isListEventsLoading } =
    api.events.getPaginatedAdminEvents.useQuery(
      {
        page: page,
        placementType
      },
      {
        enabled: pageView === "list",
      },
    );

  return (
    <>
      <Container className="flex flex-col gap-4 py-4">
        <div className="flex flex-row justify-between items-center">
          <Typography variant="h5" color="primary" className="px-4">
            Events
          </Typography>
          <div className="flex flex-row gap-4">
            <PlacementTypeSelector
              selectedPlacementTypes={placementType}
              setSelectedPlacementTypes={setPlacementType}
            />
            <ToggleButtonGroup
              value={pageView}
              size="small"
              aria-label="page view"
            >
              <ToggleButton
                value="calendar"
                aria-label="calendar"
                onClick={() => setPageView("calendar")}
              >
                <CalendarMonthIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton
                value="list"
                aria-label="list"
                onClick={() => setPageView("list")}
              >
                <FormatListBulletedIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
            <Link href="./event/new">
              <Button
                size="small"
                color="primary"
                variant="outlined"
                className="inline-flex p-2 min-w-0"
              >
                <AddBoxIcon fontSize="small" />
              </Button>
            </Link>
          </div>
        </div>
        <Divider />
        {pageView === "calendar" ? (
          <CalendarView
            events={calendarEvents?.events}
            date={date}
            page={page}
            isLoading={isCalendarEventLoading}
            totalEvents={calendarEvents?.total}
            setDate={setDate}
            setPage={setPage}
            view={view}
            setView={setView}
          />
        ) : (
          <ListView
            events={listEvents?.events}
            date={date}
            page={page}
            isLoading={isListEventsLoading}
            totalEvents={listEvents?.total}
            setDate={setDate}
            setPage={setPage}
            view={view}
            setView={setView}
          />
        )}
      </Container>
    </>
  );
}
