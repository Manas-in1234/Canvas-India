"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

function readIdFromLocation(initialId: string) {
  const queryId = new URLSearchParams(window.location.search).get("id");
  const pathId = window.location.pathname.split("/").filter(Boolean).pop();
  return (
    queryId ||
    (pathId && pathId !== "placeholder" ? decodeURIComponent(pathId) : initialId)
  );
}

/**
 * Static export serves every detail page from a "placeholder" shell, so the real
 * id lives in the URL (?id=... or the last path segment). After a client-side
 * navigation the URL can lag behind the first render, so re-read it on route
 * changes and retry briefly until the real id shows up.
 */
export function useRecordId(initialId: string) {
  const [id, setId] = useState(initialId);
  const pathname = usePathname();
  useEffect(() => {
    let tries = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const sync = () => {
      const next = readIdFromLocation(initialId);
      setId(next);
      if (next === "placeholder" && tries++ < 20) timer = setTimeout(sync, 50);
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("popstate", sync);
    };
  }, [initialId, pathname]);
  return id;
}
