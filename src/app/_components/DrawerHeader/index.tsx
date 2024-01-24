"use client";

import styled from "@emotion/styled";

const DrawerHeader = styled("div")(
  ({ theme }: { theme?: { spacing: any; mixins: any } }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }),
);

export default DrawerHeader;
