"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { Calendar, dayjsLocalizer, Views } from "react-big-calendar";

import { CircularProgress, Tooltip } from "@mui/material";

import useThemeContext from "~/app/_utils/theme/ThemeContext";
import { api } from "~/trpc/react";

import EventTooltip from "../_components/EventTooltip";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./styles.scss";

const localizer = dayjsLocalizer(dayjs);

export default function CalendarView(props: IEventView) {
  let { themeMode } = useThemeContext();
  const [currDate, setCurrDate] = useState(new Date());

  useEffect(() => {
    let startDate = dayjs(currDate)
      .startOf(props.view)
      .subtract(props.view === "month" ? 1 : 0, "w")
      .toDate();
    let endDate = dayjs(currDate)
      .endOf(props.view)
      .add(props.view === "month" ? 1 : 0, "w")
      .toDate();

    props.setDate([startDate, endDate]);
  }, [props.view, currDate]);

  const { data: eventTypes, isLoading } = api.events.getEventTypes.useQuery();

  const events = useMemo(() => {
    if (!props.events || !eventTypes) return [];
    return props.events.map((event) => {
      return {
        title: event.title,
        start: new Date(event.startTime),
        end: new Date(event.endTime),
        resource: {
          className: `event ${eventTypes.find(
            (type) => type.label === event.type,
          )?.color}`,
          data: event,
        },
      };
    });
  }, [props.events]);

  if (isLoading || props.isLoading) {
    return <CircularProgress size={28} className="mx-auto m-2" />;
  }

  return (
    <Calendar
      localizer={localizer}
      events={events}
      views={[Views.MONTH, Views.WEEK]}
      defaultView={props.view}
      view={props.view}
      date={currDate}
      onView={(view: View) => props.setView(view)}
      onNavigate={(date) => {
        setCurrDate(new Date(date));
      }}
      className={themeMode === "dark" ? "rbc-dark" : undefined}
      components={{
        eventWrapper: (props: any) => {
          return (
            <Tooltip title={<EventTooltip event={props.event.resource.data} />}>

              <div className={props.event.resource.className}>
                {props.children}
              </div>

            </Tooltip >
          );
        },
      }}
    />
  );
}
