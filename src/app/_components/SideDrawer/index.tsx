"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import {
  Box,
  Divider,
  Drawer,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from "@mui/material";

interface ResponsiveDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  isAdmin: boolean;
}

const DRAWER_WIDTH = 240;

export default function ResponsiveDrawer({
  open,
  setOpen,
  isAdmin,
}: ResponsiveDrawerProps) {
  const { data: session } = useSession();
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  if (!session) return null;
  const { user } = session;

  const drawer = (
    <div id="sidebar-menu">
      <Toolbar>
        <Typography
          variant="h2"
          className="w-full text-xl text-center"
          color="primary"
        >
          {isAdmin ? "Admin" : "Dashboard"}
        </Typography>
      </Toolbar>
      <Divider />
      {/* All Routes will go here */}
      {user?.admin &&
        (!isAdmin ? (
          <Link href="/admin" onClick={() => setOpen(false)}>
            <ListItemButton>
              <ListItemIcon>
                <VerifiedUserIcon />
              </ListItemIcon>
              <ListItemText primary={"Admin Panel"} />
            </ListItemButton>
          </Link>
        ) : (
          <Link href="/dashboard" onClick={() => setOpen(false)}>
            <ListItemButton>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary={"User Panel"} />
            </ListItemButton>
          </Link>
        ))}
    </div>
  );

  return (
    <Box
      component="nav"
      className={`w-0 md:w-[${DRAWER_WIDTH}px] flex-shrink md:flex-shrink-0 h-dvh`}
      aria-label="mailbox folders"
    >
      <SwipeableDrawer
        variant="temporary"
        open={open}
        onClose={handleDrawerToggle}
        onOpen={handleDrawerToggle}
        ModalProps={{
          keepMounted: false,
        }}
        color="background"
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: DRAWER_WIDTH,
            backgroundImage: "none",
          },
        }}
        className="md:hidden block"
      >
        {drawer}
      </SwipeableDrawer>
      <Drawer
        variant="permanent"
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: DRAWER_WIDTH,
          },
        }}
        className="md:block hidden"
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
