"use client";

import { useEffect } from "react";

import { CircularProgress, Paper, Typography } from "@mui/material";

import { api } from "~/trpc/react";

import GroupCard from "./GroupCard";

export default function PostGroupSelector(
  props: PostGroupsSelectorProps,
) {
  const { data: yearWisePrograms, isLoading } =
    api.placementConfig.getYearwisePrograms.useQuery();

  useEffect(() => {
    if (yearWisePrograms) {
      const participatingGroups = [];
      Object.keys(yearWisePrograms).forEach((yearStr) => {
        const year = parseInt(yearStr)
        yearWisePrograms[year].forEach((program) => {
          participatingGroups.push({
            admissionYear: year,
            program,
          });
        })
      }
      );
      props.onChange(participatingGroups);
    }
  }, [yearWisePrograms]);

  return (
    <Paper className="flex flex-col gap-4 py-2 px-3">
      <Typography>Eligible student groups:</Typography>
      {!yearWisePrograms || isLoading ? (
        <div className="flex items-center justify-center p-8">
          <CircularProgress />
        </div>
      ) : (
        <div className="grid gap-2 grid-cols-1 md:auto-rows-fr sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
          {props.value.map((group, index) => (
            <GroupCard
              key={index}
              index={index}
              group={group}
              disabled={props.disabled}
              allGroups={Object.fromEntries(
                Object.keys(yearWisePrograms)
                  .filter((key) => {
                    return (
                      props.value?.filter((el, elIdx) => {
                        elIdx !== index && el.admissionYear === Number(key);
                      }).length !== yearWisePrograms[Number(key)].length
                    );
                  })
                  .map((key) => [
                    key,
                    yearWisePrograms[Number(key)].filter((batch) => {
                      return !props.value?.some(
                        (el, elIdx) =>
                          elIdx !== index &&
                          el.program === batch &&
                          el.admissionYear === Number(key),
                      );
                    }),
                  ]),
              )}
              onDelete={() => {
                props.onChange(props.value?.filter((_, i) => i !== index));
              }}
              onChange={(newGroup) => {
                const newValue = [...(props.value || [])];
                newValue[index] = newGroup;
                props.onChange(newValue);
              }}
            />
          ))}
        </div>
      )}
    </Paper>
  );
}
