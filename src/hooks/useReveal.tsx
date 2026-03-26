import { useEffect } from "react";
/**
 * Observes all `.cp-reveal` elements and adds `.cp-visible` when they
 * enter the viewport, triggering the fade-up animation defined in globals.css.
 *
 * @param dep - Optional dependency (e.g. a tab/view state) that causes the
 *              hook to re-observe newly rendered elements when it changes.
 *
 * @example
 * // Basic usage
 * useReveal();
 *
 * // Re-observe when a toggle changes (e.g. teacher/student tab)
 * useReveal(activeView);
 */
export function useReveal(dep?: unknown) {
    useEffect(() => {
      // Small delay lets React flush new DOM nodes before we query them
      const id = setTimeout(() => {
        const els = document.querySelectorAll<HTMLElement>(".cp-reveal:not(.cp-visible)");
        const obs = new IntersectionObserver(
          (entries) =>
            entries.forEach((e) => {
              if (e.isIntersecting) e.target.classList.add("cp-visible");
            }),
          { threshold: 0.08 }
        );
        els.forEach((el) => obs.observe(el));
        return () => obs.disconnect();
      }, 50);
  
      return () => clearTimeout(id);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dep]);
  }
