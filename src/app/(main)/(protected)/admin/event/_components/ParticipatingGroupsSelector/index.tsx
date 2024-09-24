import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { CircularProgress, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { api } from "~/trpc/react";

import {
  type ParticipatingGroup,
  type ParticipatingGroupSelectorProps,
} from "./types";

function not(a: ParticipatingGroup[], b: ParticipatingGroup[]) {
  return a.filter((value) => !b.includes(value));
}

function intersection(a: ParticipatingGroup[], b: ParticipatingGroup[]) {
  return a.filter((value) => b.includes(value));
}

function union(a: ParticipatingGroup[], b: ParticipatingGroup[]) {
  return [...a, ...not(b, a)];
}

export default function ParticipatingGroupSelector(
  props: ParticipatingGroupSelectorProps,
) {
  const { data: session } = useSession();
  const { data: allGroups, isLoading } =
    api.placementConfig.getParticipatingGroups.useQuery(session?.user?.year, {
      enabled: !!session?.user?.year,
    });

  const [checked, setChecked] = useState<ParticipatingGroup[]>([]);
  const [left, setLeft] = useState<ParticipatingGroup[]>([]);
  const [right, setRightRoot] = useState<ParticipatingGroup[]>([]);

  const setRight = useCallback(
    (newValue: ParticipatingGroup[]) => {
      setRightRoot(newValue);
      props.setParticipatingGroups(newValue.map((group) => group.id));
    },
    [setRightRoot, props.setParticipatingGroups],
  );

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  useEffect(() => {
    if (allGroups) {
      setRightRoot(
        allGroups.filter((group) =>
          props.participatingGroups.includes(group.id),
        ),
      );
      setLeft(
        allGroups.filter(
          (group) => !props.participatingGroups.includes(group.id),
        ),
      );
    }
  }, [props.participatingGroups, allGroups]);

  const handleToggle = (value: ParticipatingGroup) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items: ParticipatingGroup[]) =>
    intersection(checked, items).length;

  const handleToggleAll = (items: ParticipatingGroup[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title: React.ReactNode, items: ParticipatingGroup[]) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={!props.disabled ? handleToggleAll(items) : undefined}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={props.disabled || items.length === 0}
            inputProps={{
              "aria-label": "all items selected",
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List
        sx={{
          height: 230,
          bgcolor: "background.paper",
          overflow: "auto",
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value: ParticipatingGroup) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItemButton
              key={value.id}
              role="listitem"
              onClick={!props.disabled ? handleToggle(value) : undefined}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.includes(value)}
                  disabled={props.disabled}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={`${value.placementType.id} - ${value.admissionYear} - ${value.program}`}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Card>
  );

  if (isLoading) {
    return (
      <Grid container sx={{ justifyContent: "center", alignItems: "center" }}>
        <CircularProgress color="inherit" />
      </Grid>
    );
  }

  return (
    <>
      <Typography variant="body2" className="px-1">
        Select Participating Groups
      </Typography>
      <Grid
        container
        className="grid lg:grid-cols-[1fr_64px_1fr] grid-cols-1 items-center gap-4"
      >
        <Grid item>{customList("Remaining Groups", left)}</Grid>
        <Grid item>
          <Grid
            container
            className="flex-row lg:flex-col items-center gap-2 justify-center"
          >
            <Button
              variant="outlined"
              size="small"
              onClick={handleCheckedRight}
              disabled={props.disabled || leftChecked.length === 0}
              aria-label="move selected right"
            >
              <KeyboardArrowRightIcon className="rotate-90 lg:rotate-0" />
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={handleCheckedLeft}
              disabled={props.disabled || rightChecked.length === 0}
              aria-label="move selected left"
            >
              <KeyboardArrowLeftIcon className="rotate-90 lg:rotate-0" />
            </Button>
          </Grid>
        </Grid>
        <Grid item>{customList("Selected Groups", right)}</Grid>
      </Grid>
    </>
  );
}
