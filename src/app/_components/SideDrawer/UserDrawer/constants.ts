import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArticleIcon from "@mui/icons-material/Article";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import MailIcon from "@mui/icons-material/Mail";
import QuizIcon from "@mui/icons-material/Quiz";
import WorkIcon from "@mui/icons-material/Work";
import EventIcon from "@mui/icons-material/Event";
export const USER_SIDEBAR = [
  {
    base: "/dashboard",
    title: "",
    links: [
      {
        label: "Inbox",
        path: "",
        icon: MailIcon,
      },
      {
        label: "Job Openings",
        path: "/job",
        icon: WorkIcon,
      },
      {
        label: "My Applications",
        path: "/application",
        icon: ArticleIcon,
      },
      {
        label: "Events",
        path: "/event",
        icon: EventIcon,
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
