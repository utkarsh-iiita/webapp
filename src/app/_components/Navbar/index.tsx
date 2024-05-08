"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material/index";

import useThemeContext from "~/app/_utils/theme/ThemeContext";
import Logo from "~/assets/logo.svg";

import ThemeSwitch from "./ThemeSwitch";
import YearSelector from "./YearSelector";

export default function Navbar({
  setIsDrawerOpen,
  noSidebar,
}: {
  setIsDrawerOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  noSidebar?: boolean;
}) {
  let router = useRouter();

  let { themeMode, toggleTheme } = useThemeContext();
  let [menuOpen, setMenuOpen] = useState(false);
  let [sideMenuOpen, setSideMenuOpen] = useState(false);
  let sideMenuRef = useRef(null);
  let menuRef = useRef(null);
  let { data: session, status } = useSession();

  const isStudent = useMemo(() => {
    return session?.user.userGroup === "student";
  }, [session?.user]);

  function handleLogout() {
    signOut();
  }

  return (
    <AppBar
      position="sticky"
      className="sticky top-0 bg-none shadow-none"
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        backgroundColor: "bgclear",
        backdropFilter: "blur(8px)",
      }}
    >
      <Toolbar>
        <Container
          maxWidth="xl"
          className="flex flex-row justify-between px-0 items-center"
        >
          {!noSidebar && (
            <IconButton
              aria-label="Sidebar Toggle"
              aria-controls="sidebar-menu"
              size="large"
              color="primary"
              className="md:hidden mr-4"
              onClick={() => setIsDrawerOpen((prev) => !prev)}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box className="flex flex-row gap-2">
            <Image
              src={Logo.src}
              alt="Utkarsh Logo"
              width={32}
              height={32}
              className="cursor-pointer block md:hidden"
              onClick={() => {
                router.push("/");
              }}
            />
            <Image
              src={Logo.src}
              alt="Utkarsh Logo"
              width={40}
              height={40}
              className="cursor-pointer hidden md:block"
              onClick={() => {
                router.push("/");
              }}
            />
            <Typography
              variant="h1"
              fontFamily={"'Oswald Variable', sans-serif"}
              fontWeight={400}
              color="title"
              className="justify-self-center md:justify-self-start text-2xl block md:hidden cursor-pointer"
              onClick={() => {
                router.push("/");
              }}
            >
              Utkarsh
            </Typography>
            <Typography
              variant="h1"
              fontFamily={"'Oswald Variable', sans-serif"}
              fontWeight={400}
              color="title"
              className="justify-self-center md:justify-self-start text-4xl hidden md:block cursor-pointer"
              onClick={() => {
                router.push("/");
              }}
            >
              Utkarsh
            </Typography>
          </Box>
          <div className="flex-row justify-end items-center gap-2 hidden md:flex">
            {status !== "loading" &&
              (session ? (
                <>
                  <YearSelector />
                  <Button
                    color="primary"
                    className="text-lg"
                    endIcon={<ArrowDropDownIcon />}
                    ref={menuRef}
                    aria-controls={menuOpen ? "menu-list" : undefined}
                    aria-haspopup="true"
                    aria-expanded={menuOpen ? "true" : undefined}
                    onClick={() => setMenuOpen(true)}
                  >
                    {session.user.username}
                  </Button>
                  <Menu
                    slotProps={{
                      paper: {
                        id: "menu-list",
                      },
                    }}
                    anchorEl={menuRef.current}
                    open={menuOpen}
                    onClose={() => setMenuOpen(false)}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <MenuItem>
                      Dark Mode
                      <ThemeSwitch
                        sx={{ ml: 1 }}
                        small="true"
                        checked={themeMode === "dark"}
                        onClick={toggleTheme}
                      />
                    </MenuItem>
                    {isStudent && (
                      <MenuItem
                        onClick={() => {
                          router.push("/dashboard/profile");
                          setMenuOpen(false);
                        }}
                      >
                        My Profile
                      </MenuItem>
                    )}
                    <MenuItem
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                    >
                      Log Out
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <ThemeSwitch
                    checked={themeMode === "dark"}
                    onClick={toggleTheme}
                  />

                  <Button
                    aria-label="Login Button"
                    variant="outlined"
                    className="normal-case font-semibold tracking-wider border-2"
                    onClick={() => {
                      router.push("/login");
                    }}
                  >
                    Log In
                  </Button>
                </>
              ))}
          </div>
          <IconButton
            size="large"
            color="primary"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            ref={sideMenuRef}
            onClick={() => setSideMenuOpen(!sideMenuOpen)}
            className="md:hidden"
            aria-label="User Actions"
          >
            <AccountCircleIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={sideMenuRef.current}
            open={sideMenuOpen}
            onClose={() => setSideMenuOpen(false)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <MenuItem>
              Dark Mode
              <ThemeSwitch
                sx={{ ml: 1 }}
                small="true"
                checked={themeMode === "dark"}
                onClick={toggleTheme}
              />
            </MenuItem>
            {status !== "loading" &&
              (session ? (
                [
                  isStudent && (
                    <MenuItem
                      onClick={() => {
                        router.push("/dashboard/profile");
                        setSideMenuOpen(false);
                      }}
                      key="profile"
                    >
                      My Profile
                    </MenuItem>
                  ),
                  <MenuItem
                    onClick={() => {
                      handleLogout();
                      setSideMenuOpen(false);
                    }}
                    key="logout"
                  >
                    Log Out
                  </MenuItem>,
                ]
              ) : (
                <MenuItem
                  onClick={() => {
                    router.push("/login");
                    setSideMenuOpen(false);
                  }}
                >
                  Log In
                </MenuItem>
              ))}
          </Menu>
        </Container>
      </Toolbar>
    </AppBar>
  );
}
