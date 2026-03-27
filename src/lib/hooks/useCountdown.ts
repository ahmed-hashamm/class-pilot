"use client";

import { useState, useEffect, useCallback } from "react";

export function useCountdown(deadline: string | null, closedAt: string | null) {
  const getRemaining = useCallback(() => {
    if (closedAt) return -1;
    if (!deadline) return Infinity;
    return Math.max(0, Math.floor((new Date(deadline).getTime() - Date.now()) / 1000));
  }, [deadline, closedAt]);

  const [remaining, setRemaining] = useState(getRemaining);

  useEffect(() => {
    setRemaining(getRemaining());
    if (closedAt || !deadline) return;
    const id = setInterval(() => {
      const r = getRemaining();
      setRemaining(r);
      if (r <= 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [deadline, closedAt, getRemaining]);

  const isClosed = closedAt !== null && closedAt !== undefined;
  const isExpired = remaining <= 0 && !isClosed && deadline !== null;
  const isActive = !isClosed && !isExpired;

  return { remaining, isClosed, isExpired, isActive };
}
