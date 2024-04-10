import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ClassIcon from "@mui/icons-material/Class";
import FeedbackIcon from "@mui/icons-material/Feedback";
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
export const ADMIN_SIDEBAR = [
  {
    base: "/admin",
    title: "",
    links: [
      {
        label: "Job Openings",
        path: "/job-openings",
        icon: WorkIcon,
      },
      {
        label: "Admin Access",
        path: "/manage-admins",
        icon: PeopleIcon,
      },
      {
        label: "Placement Years",
        path: "/placement-years",
        icon: CalendarMonthIcon,
      },
      {
        label: "Job Types",
        path: "/job-types",
        icon: ClassIcon,
      },
      {
        label: "Help Chat",
        path: "/help-chat",
        icon: FeedbackIcon,
      },
    ],
  },
];
