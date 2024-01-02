"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Paper,
  Typography,
} from "@mui/material";

import vector from "~/assets/vectors/login.svg";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const { data: session, status } = useSession();

  useEffect(() => {
    console.log(session, status);
  }, [session, status]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn("credentials", {
      callbackUrl: "/",
      redirect: false,
      username,
      password,
    });
    // signOut();
    // mutation.mutate({ username, password, remember });
  };
  return (
    <div className="w-full h-screen grid grid-cols-1 md:grid-cols-2 relative">
      <Container className="flex flex-col justify-center items-center">
        <Paper
          component="form"
          className="flex flex-col w-full max-w-sm px-6 py-4"
          elevation={4}
          onSubmit={handleSubmit}
        >
          <Typography
            variant="h5"
            className="w-full text-center font-semibold mb-2"
          >
            LDAP Login
          </Typography>
          <FormControl margin="dense" error={usernameError} required>
            <OutlinedInput
              id="username"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (e.target.value.length === 0) setUsernameError(true);
                else setUsernameError(false);
              }}
              fullWidth
              autoComplete="on"
            />
          </FormControl>

          <FormControl margin="dense" error={passwordError} required>
            <OutlinedInput
              id="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (e.target.value.length === 0) setPasswordError(true);
                else setPasswordError(false);
              }}
              fullWidth
              autoComplete="on"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>

          <FormControlLabel
            control={<Checkbox />}
            label="Remember me"
            className="self-end my-1"
            checked={remember}
            onChange={(e: any) => {
              setRemember(e.target.checked);
            }}
          />

          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            className="mt-2"
            fullWidth
            size="large"
          >
            <span>Login</span>
          </LoadingButton>
        </Paper>
      </Container>
      <Container
        className="hidden md:flex flex-col justify-center items-center max-h-screen"
        sx={{ bgcolor: "primary.main" }}
      >
        <Image src={vector} alt="Login" className="max-w-full max-h-min" />
      </Container>
      <Container
        className="z-10 w-full h-5 absolute bottom-0"
        maxWidth={false}
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          textAlign: "center",
          color: "text.disabled",
          fontSize: "0.8rem",
          backgroundColor: "bgclear",
          backdropFilter: "blur(10px)",
        }}
      >
        Created by Team GeekHaven
      </Container>
    </div>
  );
}
