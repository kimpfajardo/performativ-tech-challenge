import { clsx, type ClassValue } from "clsx";
import { formatDate, parse } from "date-fns";
import { twMerge } from "tailwind-merge";
import { HoldingNode } from "./types";
import { hierarchy, HierarchyNode } from "d3-hierarchy";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const parseStringDate = (dateString: string) => {
  const date = parse(dateString, "yyyy-MM-dd", new Date());
  return date;
};

export const toNormalDate = (dateString: string) => {
  return formatDate(parseStringDate(dateString), "MMM dd, yyyy");
};

export const formatToUSD = (amount: number) => {
  return Intl.NumberFormat("en-US", { currency: "USD" }).format(
    +amount.toFixed(2) as number
  );
};

export const abbreviateNumber = (value: number): string => {
  if (value < 1000) return value.toString();

  const suffixes = ["", "K", "M", "B", "T"];
  const tier = Math.floor(Math.log10(Math.abs(value)) / 3);

  const suffix = suffixes[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = value / scale;

  return scaled.toFixed(scaled < 10 ? 1 : 0) + suffix;
};

// Flatten recursively for easier processing
export function flattenHoldings(data: HoldingNode[]): HoldingNode[] {
  return data.flatMap((node) => [node, ...flattenHoldings(node.children)]);
}

// Get total market value
export function getTotalMarketValue(data: HoldingNode[]): number {
  return data.reduce((acc, curr) => acc + curr.absolute_value, 0);
}

// Get number of distinct assets (leaf nodes)
export function getNumberOfAssets(data: HoldingNode[]): number {
  return data.length;
}

// Get top performer by percentage
export function getTopPerformer(data: HoldingNode[]): HoldingNode | null {
  return (
    flattenHoldings(data)
      .filter((node) => node.children.length === 0)
      .sort((a, b) => b.percentage - a.percentage)[0] || null
  );
}

// Get worst performer by percentage
export function getWorstPerformer(data: HoldingNode[]): HoldingNode | null {
  return (
    flattenHoldings(data)
      .filter((node) => node.children.length === 0)
      .sort((a, b) => a.percentage - b.percentage)[0] || null
  );
}

export const BASE_COLORS = [
  "#8B0000", // dark red
  "#1E3A8A", // dark blue
  "#7C6F1D", // dark yellow/olive
  "#065F46", // dark teal/emerald
  "#5B21B6", // dark purple/indigo
  "#7C2D12", // dark orange/burnt sienna
];

export type SunburstNode = {
  name: string;
  color: string;
  size?: number;
  children?: SunburstNode[];
  absolute_value?: number;
  currency?: string;
  quantity?: number;
  percentage?: number;
};

export const getHierarchyByBreadcrumb = (
  data: HoldingNode[],
  path: string[]
): HoldingNode | null => {
  if (path.length === 0) return null;

  const currentLevel = data.find((node) => node.name === path[0]);
  if (!currentLevel) return null;

  if (path.length === 1) {
    // Base case: return node with full children
    return { ...currentLevel };
  }

  const child = getHierarchyByBreadcrumb(currentLevel.children, path.slice(1));
  if (!child) return null;

  return {
    ...currentLevel,
    children: [child],
  };
};

export function buildHierarchy(
  data: SunburstNode
): HierarchyNode<SunburstNode> {
  return hierarchy<SunburstNode>(data);
}

export const updateSearchParam = (
  key: string,
  value: string,
  prevSearchParams?: URLSearchParams
) => {
  const params = new URLSearchParams(prevSearchParams?.toString());

  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }

  return params;
};

export const normalizeKey = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\w-]/g, "_");

export const getRandomColor = (): string =>
  "#" +
  Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0");

export const buildColorMapForTree = (
  data: HoldingNode[]
): Record<string, { label: string; color: string }> => {
  const map: Record<string, { label: string; color: string }> = {};
  const usedColors = new Set<string>();

  const walk = (nodes: HoldingNode[]) => {
    for (const node of nodes) {
      const key = normalizeKey(node.name);

      if (!map[key]) {
        let color: string;
        do {
          color = getRandomColor();
        } while (usedColors.has(color));
        usedColors.add(color);

        map[key] = {
          label: node.name,
          color,
        };
      }

      if (Array.isArray(node.children) && node.children.length > 0) {
        walk(node.children);
      }
    }
  };

  walk(data);
  return map;
};

export const addFillToTree = (data: HoldingNode[]) => {
  return data.map((node) => {
    const filledNode = {
      ...node,
      fill: `var(--color-${normalizeKey(node.name)})`,
      key: normalizeKey(node.name),
    };

    if (Array.isArray(node.children) && node.children.length > 0) {
      filledNode.children = addFillToTree(node.children);
    }

    return filledNode;
  });
};
