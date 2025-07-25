"use client";

import { Grid2X2Icon, ListIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useViewType } from "@/lib/context/view-context";
import { DividerY } from "./divider";

export const ListTypeSelector = () => {
  const { viewType, setViewType } = useViewType();

  const isList = viewType === "list";

  const handleListView = () => {
    setViewType?.("list");
  };

  const handleGridView = () => {
    setViewType?.("grid");
  };

  return (
    <div className="w-fit flex">
      <Button
        onClick={handleListView}
        className="rounded-l-lg rounded-r-none cursor-pointer shrink-0"
        size={"lg"}
        variant={isList ? "default" : "secondary"}>
        <ListIcon />
      </Button>
      <DividerY />
      <Button
        onClick={handleGridView}
        className="rounded-r-lg rounded-l-none cursor-pointer shrink-0"
        size={"lg"}
        variant={!isList ? "default" : "secondary"}>
        <Grid2X2Icon />
      </Button>
    </div>
  );
};
