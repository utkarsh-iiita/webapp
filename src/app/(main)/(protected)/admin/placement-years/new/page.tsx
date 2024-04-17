"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dayjs, { type Dayjs } from "dayjs";

import AddIcon from "@mui/icons-material/Add";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Button, Container, Divider, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

import FullPageLoader from "~/app/common/components/FullPageLoader";
import { api } from "~/trpc/react";

import JobTypeConfiguration from "../_components/JobTypeConfiguration";

export default function NewPlacementYear() {
  const router = useRouter();
  const [year, setYear] = useState<Dayjs>(dayjs());
  const [placementConfigs, setPlacementConfigs] = useState<PlacementConfig[]>(
    [],
  );
  const { data: existingYears, isLoading: isExistingYearsLoading } =
    api.placementConfig.getAdminPlacementYears.useQuery();

  const { data: placementTypes, isLoading: isPlacementTypesLoading } =
    api.placementConfig.getPlacementTypes.useQuery();

  const { data: yearWisePrograms, isLoading: isYearWiseProgramsLoading } =
    api.placementConfig.getYearwisePrograms.useQuery();

  const createYearMutation =
    api.placementConfig.createParticipatingGroups.useMutation({
      onSuccess: () => {
        router.push("/admin/placement-years");
        router.refresh();
      },
    });

  useEffect(() => {
    if (existingYears?.length > 0) {
      setYear(dayjs().year(existingYears[0] + 1));
    }
  }, [existingYears]);

  if (
    isExistingYearsLoading ||
    isPlacementTypesLoading ||
    isYearWiseProgramsLoading
  )
    return <FullPageLoader />;

  return (
    <>
      <Container className="flex flex-col h-full relative">
        <div className="flex flex-row justify-between items-center py-4">
          <Typography variant="h5" color="primary" className="px-4">
            New Placement Year
          </Typography>
        </div>
        <Divider />
        <div className=" flex-1 overflow-y-auto mb-20">
          <div className="flex flex-col gap-4 py-4">
            <Typography variant="body1">
              Select the year for the placement session
            </Typography>
            <DatePicker
              label="Placement year"
              views={["year"]}
              shouldDisableYear={(year: Dayjs) => {
                return existingYears?.includes(year.year());
              }}
              value={year}
              onChange={(newYear) => setYear(newYear)}
            />
            <Typography variant="body1">
              Select the job types and then the batches applicable for the job
              type
            </Typography>
            {placementConfigs.map((config, index) => (
              <JobTypeConfiguration
                key={index}
                yearWisePrograms={yearWisePrograms}
                placementTypes={placementTypes.filter((val) => {
                  return !placementConfigs.some(
                    (el, elIdx) => elIdx !== index && el.id === val.id,
                  );
                })}
                placementConfig={config}
                setPlacementConfig={(newConfig) => {
                  const newPlacementConfigs = [...placementConfigs];
                  newPlacementConfigs[index] = newConfig;
                  setPlacementConfigs(newPlacementConfigs);
                }}
                onDelete={() => {
                  const newPlacementConfigs = [...placementConfigs];
                  newPlacementConfigs.splice(index, 1);
                  setPlacementConfigs(newPlacementConfigs);
                }}
              />
            ))}
            {placementTypes.length !== placementConfigs.length && (
              <Button
                variant="outlined"
                className="border-dashed"
                onClick={() => {
                  setPlacementConfigs([...placementConfigs, {}]);
                }}
                disabled={
                  placementConfigs.length > 0 && !placementConfigs.at(-1).id
                }
              >
                <AddIcon fontSize="large" />
              </Button>
            )}
          </div>
        </div>
        <Box
          className="fixed bottom-0 w-full left-0 py-4 border-0 border-solid border-t border-white/15"
          sx={{
            backgroundColor: "bgclear",
          }}
        >
          <Container className="flex flex-row justify-end">
            <LoadingButton
              variant="contained"
              disabled={
                !placementConfigs.length ||
                placementConfigs.some(
                  (config) =>
                    !config.id ||
                    !config.batches?.length ||
                    config.batches.some(
                      (group) => !group.program || !group.admissionYear,
                    ),
                )
              }
              loading={createYearMutation.isLoading}
              onClick={async () => {
                await createYearMutation.mutateAsync({
                  year: year.year(),
                  placementConfigs,
                });
              }}
            >
              Create
            </LoadingButton>
          </Container>
        </Box>
      </Container>
    </>
  );
}
