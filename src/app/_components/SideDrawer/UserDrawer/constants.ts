import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
export const USER_SIDEBAR = [
  {
    base: "/dashboard",
    title: "",
    links: [
      {
        label: "Profile",
        path: "/profile",
        icon: AccountCircleIcon,
      },
      {
        label: "Help",
        path: "/help",
        icon: LiveHelpIcon,
      },
    ],
  },
];
