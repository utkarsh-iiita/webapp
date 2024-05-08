"use client";

import {
  CircularProgress,
  Paper,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import {
  blueberryTwilightPalette,
  PieChart,
  useDrawingArea,
} from "@mui/x-charts";

import { api } from "~/trpc/react";

interface JobAnalyticsRowProps {
  jobType: {
    id: string;
    name: string;
    description: string;
  };
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

export default function JobAnalyticsRow(props: JobAnalyticsRowProps) {
  const { data, isLoading } =
    api.analytics.getJobTypeSelectionAnalytics.useQuery(props.jobType.id);

  const totalObj = data?.find((item) => item.group.program === "Unselected");
  const theme = useTheme();

  return (
    <Paper elevation={1} className="p-4 pb-5 flex flex-col gap-4">
      <div>
        <Typography variant="h6">{props.jobType.name}</Typography>
        <Typography variant="body1" color="GrayText">
          {props.jobType.description}
        </Typography>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="flex flex-row gap-4 flex-wrap justify-between items-center">
            <PieChart
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              width={200}
              height={200}
              className="w-full h-96"
              series={[
                {
                  data: data.map((item) => ({
                    id: item.group.admissionYear + "_" + item.group.program,
                    value: item.selected,
                    label: `${item.group.program} ${
                      item.group.admissionYear
                        ? `(${item.group.admissionYear})`
                        : ""
                    }`,
                  })),
                  innerRadius: 60,
                  valueFormatter: (v, { dataIndex }) => {
                    const { all } = data[dataIndex];
                    return `${v.value}/${all}`;
                  },
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
                {totalObj.all - totalObj.selected} / {totalObj.all}
              </PieCenterLabel>
            </PieChart>
            <div className="flex flex-row md:flex-col gap-2 flex-wrap justify-center">
              {data.map((item, index) => (
                <div key={item.group.admissionYear + "_" + item.group.program}>
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
                    <div>{`${item.group.program} ${
                      item.group.admissionYear
                        ? `(${item.group.admissionYear})`
                        : ""
                    }`}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </Paper>
  );
}
