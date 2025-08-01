"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";

export type PageMeta = {
  cursorUsed: string | null;
  nextCursor: string | null;
};

export type GenericResponse<T> = T & {
  last_evaluated_key: string;
};

export const useCursorPagination = <T,>(
  initialData: T,
  initialNextCursor: string | null,
  fetchFn: (
    limit?: number | undefined,
    lastKey?: string | undefined
  ) => Promise<GenericResponse<T>>,
  limit: number
) => {
  const didHydrate = useRef(false);

  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState<T>(initialData);

  const [pages, setPages] = useState<PageMeta[]>([
    { cursorUsed: null, nextCursor: initialNextCursor },
  ]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const canPrevious = currentPageIndex > 0;
  const canNext = !!pages[currentPageIndex]?.nextCursor;

  const memoizedFetchFn = useCallback(
    (limit?: number, lastKey?: string) => {
      return fetchFn(limit, lastKey);
    },
    [fetchFn]
  );

  const goNext = async () => {
    if (!canNext) return;

    setIsLoading(true);

    const nextIndex = currentPageIndex + 1;
    const cursor = pages[currentPageIndex]?.nextCursor;

    const res = await memoizedFetchFn(+limit!, cursor!);

    const updatedPages = [...pages];
    updatedPages[nextIndex] = {
      cursorUsed: cursor,
      nextCursor: res.last_evaluated_key ?? null,
    };

    setPages(updatedPages);
    setCurrentPageIndex(nextIndex);
    setData(res);

    setIsLoading(false);
  };

  const goPrevious = async () => {
    setIsLoading(true);

    if (!canPrevious) return;

    const prevIndex = currentPageIndex - 1;
    const cursor = pages[prevIndex]?.cursorUsed ?? null;

    const res = await memoizedFetchFn(+limit!, cursor!);

    setCurrentPageIndex(prevIndex);
    setData(res);

    setIsLoading(false);
  };

  const refetch = async () => {
    setIsLoading(true);

    const currentCursor = pages[currentPageIndex]?.cursorUsed ?? null;
    const res = await memoizedFetchFn(limit, currentCursor ?? undefined);

    setData(res);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!didHydrate.current ||  typeof window !== "undefined") {
      didHydrate.current = true;
      return;
    }
    const reset = async () => {
      setIsLoading(true);
      const res = await memoizedFetchFn(limit);
      setData(res);
      setPages([
        {
          cursorUsed: null,
          nextCursor: res.last_evaluated_key ?? null,
        },
      ]);
      setCurrentPageIndex(0);
      setIsLoading(false);
    };

    reset();
  }, [limit, memoizedFetchFn]);
  return {
    data,
    canPrevious,
    canNext,
    goNext,
    goPrevious,
    currentPageIndex,
    isLoading,
    refetch,
  };
};

export const useLimitFromUrl = (defaultLimit = 20): number => {
  const searchParams = useSearchParams();
  const rawLimit = searchParams.get("limit");
  const parsed = parseInt(rawLimit || "", 10);
  return isNaN(parsed) ? defaultLimit : parsed;
};

export const useResponsiveInnerRadius = () => {
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const innerRadius = useMemo(() => {
    if (windowWidth > 1200) return 120;
    if (windowWidth > 800) return 100;
    if (windowWidth > 480) return 80;
    return 50;
  }, [windowWidth]);

  return innerRadius;
};