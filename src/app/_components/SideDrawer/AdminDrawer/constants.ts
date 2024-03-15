import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PeopleIcon from "@mui/icons-material/People";

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
    ],
  },
];
