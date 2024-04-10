import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EmailIcon from '@mui/icons-material/Email';
import FeedbackIcon from "@mui/icons-material/Feedback";
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
export const ADMIN_SIDEBAR = [
  {
    base: "/admin",
    title: "",
    links: [
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
        icon: WorkIcon,
      },
      {
        label: "Help Chat",
        path: "/help-chat",
        icon: FeedbackIcon,
      },
      {
        label: "Post",
        path: "/post",
        icon: EmailIcon,
      },

    ],
  },
];
