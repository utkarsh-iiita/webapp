import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import QuizIcon from "@mui/icons-material/Quiz";
import WorkIcon from "@mui/icons-material/Work";

export const USER_SIDEBAR = [
  {
    base: "/dashboard",
    title: "",
    links: [
      {
        label: "Job Openings",
        path: "/job",
        icon: WorkIcon,
      },
    ],
  },
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
        label: "Resumes",
        path: "/resume",
        icon: InsertDriveFileIcon,
      },
      {
        label: "Help",
        path: "/help",
        icon: LiveHelpIcon,
      },
      {
        label: "FAQ",
        path: "/faq",
        icon: QuizIcon,
      },
    ],
  },
];
