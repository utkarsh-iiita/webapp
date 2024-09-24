type View = "month" | "week";

interface IEventView {
  events: any[];
  date: [Date, Date];
  page: number;
  view: View;
  totalEvents: number;
  isLoading: boolean;
  setView: (view: View) => void;
  setDate: ([start, end]: [Date, Date]) => void;
  setPage: (page: number) => void;
}
