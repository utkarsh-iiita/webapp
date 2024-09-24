import { Pagination } from "@mui/material";

import EventRow from "../_components/EventRow";

export default function ListView(props: IEventView) {
  return (
    <>
      {props.events?.map((event) => <EventRow key={event.id} event={event} />)}
      <Pagination
        className="ml-auto"
        count={Math.ceil(props.totalEvents / 20)}
        page={props.page}
        onChange={(_, page) => props.setPage(page)}
      />
    </>
  );
}
