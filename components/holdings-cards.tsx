"use client";

import {
  ChartNoAxesCombinedIcon,
  HandCoinsIcon,
  InfoIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Box } from "./box";

type HoldingStatCardProps = {
  icon: React.ReactNode;
  title: string | React.ReactNode;
  description: string;
  value: string;
  label: string;
  customContent?: React.ReactNode;
};
export const TotalMarketValue = ({
  value,
  label,
}: Pick<HoldingStatCardProps, "value" | "label">) => {
  return (
    <HoldingStatCard
      icon={
        <ChartNoAxesCombinedIcon
          className="absolute top-0 right-0 z-[1] text-transparent duration-300 translate-y-2 group-hover:translate-y-0 group-hover:text-slate-300 transition"
          width={200}
          height={200}
        />
      }
      description="The combined current value of all your holdings in USD, including cash, accounts, and investments."
      title={"Total Market Value"}
      label={label}
      value={value}
    />
  );
};

export const NumberOfAssets = ({
  value,
  label,
}: Pick<HoldingStatCardProps, "value" | "label">) => {
  return (
    <HoldingStatCard
      icon={
        <HandCoinsIcon
          className="absolute top-0 right-0 z-[1] text-transparent duration-300 translate-y-2 group-hover:translate-y-0 group-hover:text-slate-300 transition"
          width={200}
          height={200}
        />
      }
      description="Total count of unique individual holdings in your portfolio — like accounts, currencies, or instruments."
      title={"Number of Assets"}
      label={label}
      value={value}
    />
  );
};

export const TopPerformingAsset = ({
  value,
  label,
  customContent,
}: Pick<HoldingStatCardProps, "value" | "label" | "customContent">) => {
  return (
    <HoldingStatCard
      icon={
        <TrendingUpIcon
          className="absolute top-0 right-0 z-[1] text-transparent duration-300 translate-y-2 group-hover:translate-y-0 group-hover:text-slate-300 transition"
          width={200}
          height={200}
        />
      }
      description="The holding with the highest portfolio allocation, based on its percentage value compared to your total."
      title={
        <>
          Top <span className="hidden md:block">Performing</span> Asset
        </>
      }
      label={label}
      value={value}
      customContent={customContent}
    />
  );
};

export const WorstPerformingAsset = ({
  value,
  label,
  customContent,
}: Pick<HoldingStatCardProps, "value" | "label" | "customContent">) => {
  return (
    <HoldingStatCard
      icon={
        <TrendingDownIcon
          className="absolute top-0 right-0 z-[1] text-transparent duration-300 translate-y-2 group-hover:translate-y-0 group-hover:text-slate-300 transition"
          width={200}
          height={200}
        />
      }
      description="The holding with the smallest percentage share of your portfolio — often lower in value or allocation."
      title={
        <>
          Worst <span className="hidden md:block">Performing</span> Asset
        </>
      }
      label={label}
      value={value}
      customContent={customContent}
    />
  );
};

export const HoldingStatCard = ({
  icon,
  title,
  description,
  value,
  label,
  customContent,
}: {
  icon: React.ReactNode;
  title: string | React.ReactNode;
  description: string;
  value: string;
  label: string;
  customContent?: React.ReactNode;
}) => {
  return (
    <Box className="lg:h-[200px] h-[120px] md:[150px] relative overflow-hidden group">
      {icon}
      <div className="flex flex-col justify-between gap-2 w-full relative z-[2]">
        <div className="flex items-start w-full">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-2 text-xs lg:text-base">
              <span className="flex gap-1">{title}</span>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon width={14} height={14} className="text-slate-500" />
                </TooltipTrigger>
                <TooltipContent className="bg-black">
                  <div className="max-w-[200px]">
                    <span>{description}</span>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
            <hr className="border-t-4 border-slate-800 w-5 lg:w-10" />
          </div>
        </div>
        <div className="flex justify-between items-end">
          <div className="flex flex-col lg:gap-2 w-full">
            <span className="text-sm capitalize lg:text-4xl font-mono font-bold flex-col flex">
              {value}
            </span>
            <span className="text-slate-400 text-sm lg:text-xl font-bold">
              {label}
            </span>
          </div>
          {customContent}
        </div>
      </div>
    </Box>
  );
};
