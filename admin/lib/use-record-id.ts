"use client";
import { useEffect, useState } from "react";
export function useRecordId(initialId: string) {
  const [id, setId] = useState(initialId);
  useEffect(() => {
    const queryId = new URLSearchParams(window.location.search).get("id");
    const pathId = window.location.pathname.split("/").filter(Boolean).pop();
    setId(
      queryId ||
        (pathId && pathId !== "placeholder"
          ? decodeURIComponent(pathId)
          : initialId),
    );
  }, [initialId]);
  return id;
}
