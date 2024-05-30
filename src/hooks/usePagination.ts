import { useEffect, useState, useMemo } from "react";

export const usePagination = <T>(data: T[], pageSize: number = 8) => {
  const [activePage, setActivePage] = useState(1);

  const maxPages = Math.ceil(data?.length / pageSize);

  const next = () => {
    setActivePage((n) => (n + 1 >= maxPages ? maxPages : n + 1));
  };

  const prev = () => {
    setActivePage((n) => (n - 1 <= 0 ? 0 : n - 1));
  };

  const pageData = useMemo(() => {
    if (!data) return [];

    const start = (activePage - 1) * pageSize;
    return data.slice(start, start + pageSize);
    // react be like this data is the same so stringified it
    // because the upstream memos seems to be correct so fk
  }, [pageSize, activePage, JSON.stringify(data, (_, value) => (typeof value === "bigint" ? value.toString() : value))]);

  useEffect(() => {
    if (data?.length > 0) {
      setActivePage(1);
    }
  }, [data?.length]);

  return {
    activePage,
    data: pageData,
    next,
    prev,
    maxPages,
    pageSize,
    onChange: (n: any) => setActivePage(Number(n)),
  };
}
