"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from "@mui/material/index";

import { ADMIN_SIDEBAR } from "./AdminDrawer/constants";
import { USER_SIDEBAR } from "./UserDrawer/constants";

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
  const pathname = usePathname();

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
      {!(isAdmin && user.admin?.permissions === 0) &&
        (isAdmin ? ADMIN_SIDEBAR : USER_SIDEBAR).map((list, index) => {
          return (
            <Fragment key={index}>
              <List>
                {list.title && (
                  <ListSubheader disableSticky>{list.title}</ListSubheader>
                )}
                {list.links.map((item) => (
                  <Link
                    key={item.label}
                    href={list.base + item.path}
                    onClick={() => setOpen(false)}
                  >
                    <ListItem disablePadding>
                      <ListItemButton
                        selected={pathname === list.base + item.path}
                      >
                        <ListItemIcon>
                          <item.icon
                            color={
                              pathname === list.base + item.path
                                ? "primary"
                                : undefined
                            }
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={item.label}
                          primaryTypographyProps={{
                            color:
                              pathname === list.base + item.path
                                ? "primary"
                                : undefined,
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  </Link>
                ))}
              </List>
              <Divider />
            </Fragment>
          );
        })}
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
          user?.userGroup === "student" && (
            <Link href="/dashboard" onClick={() => setOpen(false)}>
              <ListItemButton>
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary={"User Panel"} />
              </ListItemButton>
            </Link>
          )
        ))}
    </div>
  );

  return (
    <Box
      component="nav"
      className={`w-0 md:w-[240px] flex-shrink md:flex-shrink-0 h-dvh`}
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
