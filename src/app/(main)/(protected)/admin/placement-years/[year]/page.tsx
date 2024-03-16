"use client";

import { useCallback, useEffect, useState } from "react";
import { redirect, useParams, useRouter } from "next/navigation";

import AddIcon from "@mui/icons-material/Add";
import CreateIcon from "@mui/icons-material/Create";
import DoneIcon from "@mui/icons-material/Done";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Button,
  Container,
  Divider,
  ToggleButton,
  Typography,
} from "@mui/material";

import FullPageLoader from "~/app/common/components/FullPageLoader";
import { api } from "~/trpc/react";

import JobTypeConfiguration from "../_components/JobTypeConfiguration";

export default function IndividualPlacementYear() {
  const router = useRouter();
  const { year } = useParams();

  const [editMode, setEditMode] = useState<boolean>(false);
  const [placementConfigs, setPlacementConfigs] = useState<PlacementConfig[]>(
    [],
  );

  const {
    data: participatingGroups,
    isLoading,
    isError,
  } = api.placementConfig.getParticipatingGroups.useQuery(Number(year));

  const { data: placementTypes, isLoading: isPlacementTypesLoading } =
    api.placementConfig.getPlacementTypes.useQuery();

  const { data: yearWisePrograms, isLoading: isYearWiseProgramsLoading } =
    api.placementConfig.getYearwisePrograms.useQuery();

  const updateYearMutation =
    api.placementConfig.editParticipatingGroups.useMutation({
      onSuccess: () => {
        router.refresh();
        setEditMode(false);
      },
    });

  const computePlacementConfigs = useCallback(() => {
    if (!participatingGroups) {
      return [];
    }
    const configs: PlacementConfig[] = [];
    participatingGroups.forEach((el) => {
      if (!configs.find((conf) => conf.id === el.placementType.id)) {
        configs.push({
          id: el.placementType.id,
          name: el.placementType.name,
          batches: [],
        });
      }
      configs
        .find((conf) => conf.id === el.placementType.id)
        ?.batches.push({
          program: el.program,
          admissionYear: el.admissionYear,
        });
    });

    return configs;
  }, [participatingGroups]);

  useEffect(() => {
    setPlacementConfigs(computePlacementConfigs());
  }, [participatingGroups]);

  if (isPlacementTypesLoading || isYearWiseProgramsLoading || isLoading)
    return <FullPageLoader />;

  if (isError) {
    redirect("/admin/placement-years");
  }

  return (
    <>
      <Container className="flex flex-col h-full relative">
        <div className="flex flex-row justify-between items-center py-4">
          <Typography variant="h5" color="primary" className="px-4">
            Placement Year - {year}
          </Typography>
          <ToggleButton
            value="check"
            selected={editMode}
            color={editMode ? "success" : undefined}
            onChange={() => {
              setPlacementConfigs(computePlacementConfigs());
              setEditMode((edit) => !edit);
            }}
            size="small"
          >
            {editMode ? <DoneIcon /> : <CreateIcon />}
          </ToggleButton>
        </div>
        <Divider />
        <div className=" flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4 py-4">
            <Typography variant="body1">
              Editing the following job types and batches will not affect
              already created Job Openings
            </Typography>
            {placementConfigs.map((config, index) => (
              <JobTypeConfiguration
                key={index}
                disabled={!editMode}
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
        {editMode && (
          <div className="fixed bottom-0 w-full left-0 py-4 border-0 border-solid border-t border-white/15">
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
                loading={updateYearMutation.isLoading}
                onClick={async () => {
                  await updateYearMutation.mutateAsync({
                    year: Number(year),
                    placementConfigs,
                  });
                }}
              >
                Save Changes
              </LoadingButton>
            </Container>
          </div>
        )}
      </Container>
    </>
  );
}
