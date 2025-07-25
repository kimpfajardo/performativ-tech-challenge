"use client";

import { createContext, useContext, useState } from "react";

type ViewType = {
  viewType: "grid" | "list";
  setViewType?: (value: ViewType["viewType"]) => void;
};

const ViewTypeCtx = createContext<ViewType>({} as ViewType);

export const useViewType = () => {
  return useContext(ViewTypeCtx);
};

export const ViewTypeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [viewType, setViewType] = useState<ViewType["viewType"]>("list");

  return (
    <ViewTypeCtx.Provider
      value={{
        viewType,
        setViewType,
      }}>
      {children}
    </ViewTypeCtx.Provider>
  );
};
