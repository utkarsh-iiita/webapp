"use client";

import { CircularProgress, Paper, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { blueberryTwilightPalette } from "@mui/x-charts/colorPalettes";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { PieChart } from "@mui/x-charts/PieChart";

import { api } from "~/trpc/react";

interface RegDetailsProps {
  jobId: string;
}

const StyledText = styled("text")(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 20,
}));

function PieCenterLabel({ children }: { children: React.ReactNode }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2} fontWeight={700}>
      {children}
    </StyledText>
  );
}

export default function RegDetails(props: RegDetailsProps) {
  const { data, isLoading } = api.jobOpenings.adminGetRegDetails.useQuery(
    props.jobId,
  );
  const theme = useTheme();

  return (
    <Paper elevation={1} className="p-4 pb-5 flex flex-col gap-4">
      <Typography variant="subtitle1">Registrations Stats:</Typography>
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <CircularProgress />
        </div>
      ) : (
        <div className="flex flex-row gap-4 flex-wrap justify-between items-center">
          <PieChart
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            width={200}
            height={200}
            className="w-full h-96"
            series={[
              {
                data: data.map((item) => ({
                  id: item.admissionYear + "_" + item.program,
                  value: item._count._all,
                  label: `${item.program} (${item.admissionYear})`,
                })),
                innerRadius: 60,
              },
            ]}
            slotProps={{
              pieArc: {
                height: 200,
              },
              legend: {
                hidden: true,
              },
            }}
          >
            <PieCenterLabel>
              {data.reduce((acc, item) => acc + item._count._all, 0)}
            </PieCenterLabel>
          </PieChart>
          <div className="flex flex-row md:flex-col gap-2 flex-wrap justify-center">
            {data.map((item, index) => (
              <div key={item.admissionYear + "_" + item.program}>
                <div className="flex flex-row gap-2 items-center">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: blueberryTwilightPalette(
                        theme.palette.mode,
                      )[
                        index %
                          blueberryTwilightPalette(theme.palette.mode).length
                      ],
                    }}
                  />
                  <div>{`${item.program} (${item.admissionYear})`}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Paper>
  );
}
