import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ClassIcon from "@mui/icons-material/Class";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EmailIcon from "@mui/icons-material/Email";
import EventIcon from "@mui/icons-material/Event";
import FeedbackIcon from "@mui/icons-material/Feedback";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import PeopleIcon from "@mui/icons-material/People";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import WorkIcon from "@mui/icons-material/Work";

export const ADMIN_SIDEBAR = [
  {
    base: "/admin",
    title: "",
    links: [
      {
        label: "Dashboard",
        path: "",
        icon: DashboardIcon,
      },
      {
        label: "Job Openings",
        path: "/job-openings",
        icon: WorkIcon,
      },
      {
        label: "Post",
        path: "/post",
        icon: EmailIcon,
      },
      {
        label: "Events",
        path: "/event",
        icon: EventIcon,
      },
    ],
  },
  {
    base: "/admin",
    title: "",
    links: [
      {
        label: "Track Student",
        path: "/student",
        icon: PersonSearchIcon,
      },
      {
        label: "Help Chat",
        path: "/help-chat",
        icon: FeedbackIcon,
      },
      {
        label: "FAQs",
        path: "/faq",
        icon: LiveHelpIcon,
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
    ],
  },
];
