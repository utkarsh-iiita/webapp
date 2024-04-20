"use client";

import { useCallback } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import { api } from "~/trpc/react";

export default function YearSelector() {
  const pathname = usePathname();

  const utils = api.useUtils();

  const { data, isLoading } =
    api.placementConfig.getStudentPlacementYears.useQuery();

  const { data: session, update } = useSession();

  const { data: adminYears, isLoading: isAdminYearsLoading } =
    api.placementConfig.getAdminPlacementYears.useQuery(null, {
      enabled: !!session?.user?.admin && pathname.includes("/admin"),
    });

  const changeYear = useCallback(
    (year: number) => {
      async function updateYear() {
        await update({
          info: {
            year,
          },
        });

        utils.jobOpenings.invalidate();
      }
      updateYear();
    },
    [update],
  );

  if (data && data.length == 0) {
    return <></>
  }

  if (!session?.user?.admin || (!pathname.includes("/admin") && !isLoading)) {
    if (data && !data.includes(session?.user?.year)) {
      changeYear(data[0]);
    }
  }

  if (
    !session?.user?.year ||
    isLoading ||
    (!!session?.user?.admin &&
      pathname.includes("/admin") &&
      isAdminYearsLoading)
  )
    return <></>;
  return (
    <>
      <FormControl
        size="small"
        disabled={
          !!session?.user?.admin && pathname.includes("/admin")
            ? adminYears.length === 1
            : data.length === 1
        }
      >
        <InputLabel>Year</InputLabel>
        <Select
          color="primary"
          value={session.user.year}
          label="Age"
          onChange={(e) => changeYear(parseInt(e.target.value.toString()))}
        >
          {!!session?.user?.admin && pathname.includes("/admin")
            ? adminYears.map((el) => (
              <MenuItem key={el} value={el}>
                {el}
              </MenuItem>
            ))
            : data.map((el) => (
              <MenuItem key={el} value={el}>
                {el}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </>
  );
}
