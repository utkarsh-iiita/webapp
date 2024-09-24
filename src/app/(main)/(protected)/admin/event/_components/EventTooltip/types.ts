interface Event {
  id: string;
  title: string;
  type: string;
  description: string | null;
  location: string;
  startTime: Date;
  endTime: Date;
  hidden: Boolean;
  company: {
    id: string;
    logo: string;
    name: string;
  };
  jobOpening: {
    id: string;
    title: string;
  };
}

export interface EventTooltipProps {
  event: Event;
}
