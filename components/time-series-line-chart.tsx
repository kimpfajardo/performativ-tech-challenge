import { abbreviateNumber, formatToUSD, toNormalDate } from "@/lib/utils";
import { Box } from "./box";
import { ResponsiveLine } from "@nivo/line";
import { TimeSeriesPoint } from "@/lib/types";

export const TimeSeriesLineChart = ({
  timeseriesArray,
  onClick,
}: {
  timeseriesArray: (TimeSeriesPoint & { x: string; y: number | string })[];
  onClick?: (point: TimeSeriesPoint) => void;
}) => {
  return (
    <ResponsiveLine
      data={[
        {
          id: "0",
          data: timeseriesArray,
        },
      ]}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      curve="cardinal"
      axisBottom={null}
      axisLeft={{
        format: (val) => {
          return abbreviateNumber(val);
        },
        tickValues: 4,
        tickPadding: 12,
      }}
      onClick={(point) => {
        // @ts-expect-error
        onClick?.(point.data);
      }}
      enableGridX={false}
      enableGridY={false}
      colors={{ scheme: "dark2" }}
      enablePoints={true}
      pointSize={5}
      pointColor={{ theme: "background" }}
      pointBorderWidth={3}
      pointBorderColor={{ from: "seriesColor", modifiers: [] }}
      pointLabel="data.y"
      pointLabelYOffset={15}
      enableSlices={false}
      enableTouchCrosshair={true}
      useMesh={true}
      motionConfig="stiff"
      tooltip={({ point }) => {
        return (
          <Box className="shadow-sm bg-white w-max">
            <div>
              <p className="text-xs mb-1">{toNormalDate(point.data.date)}</p>
              <p className="font-mono font-bold">
                {formatToUSD(point.data.value)}{" "}
                <span className="text-slate-400 text-xs font-normal">USD</span>
              </p>
            </div>
          </Box>
        );
      }}
    />
  );
};
