"use client";

import {
  ChartNoAxesCombinedIcon,
  HandCoinsIcon,
  ScrollTextIcon,
} from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const navigationList = [
  {
    label: "Transactions",
    url: "/transactions",
    icon: ScrollTextIcon,
  },
  {
    label: "Performance",
    url: "/performance",
    icon: ChartNoAxesCombinedIcon,
  },
  {
    label: "Holdings",
    url: "/holdings",
    icon: HandCoinsIcon,
  },
];

const isActive = (currentPath: string, referencePath: string) => {
  return currentPath === referencePath;
};

export const Navigation = () => {
  const pathname = usePathname();
  return (
    <nav className="flex items-center justify-between h-full p-4 text-white shadow-xl lg:flex-col bg-slate-900 rounded-2xl">
      <Link href="/">
        <h1 className="text-4xl text-center font-brand">KF</h1>
      </Link>

      <ul className="flex gap-8 lg:flex-col">
        {navigationList.map(({ icon: Icon, label, url }) => {
          return (
            <li key={url}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    className={cn(
                      "p-4 flex justify-center items-center hover:text-black hover:bg-slate-200 rounded-xl transition-all",
                      {
                        "text-black bg-white": isActive(pathname, url),
                      }
                    )}
                    href={url}>
                    <Icon width={28} height={28} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent sideOffset={20} side="right">
                  <span>{label}</span>
                </TooltipContent>
              </Tooltip>
            </li>
          );
        })}
      </ul>

      <div className="hidden lg:block" />
    </nav>
  );
};
