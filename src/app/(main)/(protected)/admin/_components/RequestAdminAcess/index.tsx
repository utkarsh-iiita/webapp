"use client";

import { signOut } from "next-auth/react";

import LoadingButton from "@mui/lab/LoadingButton";

import { api } from "~/trpc/react";

export default function RequestAdminAccess() {
  const requestAdminAccessMutation = api.admin.raiseAdminRequest.useMutation();
  return (
    <LoadingButton
      variant="outlined"
      loading={requestAdminAccessMutation.isLoading}
      onClick={() => {
        requestAdminAccessMutation.mutate();
        signOut();
      }}
    >
      Request Admin Access
    </LoadingButton>
  );
}
