'use client';

import { Suspense, useEffect, useState, useRef, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

/** Max time (ms) the progress bar can stay visible before auto-resetting. */
const PROGRESS_BAR_TIMEOUT_MS = 8000;

/**
 * Custom High-Fidelity Progress Bar
 * Reliably intercept navigation events in Next.js 16/React 19.
 *
 * Safety features:
 * - Auto-resets after PROGRESS_BAR_TIMEOUT_MS to prevent stuck states
 * - Ignores replaceState calls that don't actually change the URL
 * - Only triggers for genuine cross-page navigations
 */
function ProgressBarInner() {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Clear any existing safety timeout */
  const clearSafetyTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  /** Start navigation with a safety timeout fallback */
  const startNavigation = useCallback(() => {
    // Defer state update to avoid "useInsertionEffect must not schedule updates"
    // which happens when Next.js calls pushState during a forbidden phase.
    setTimeout(() => {
      setIsNavigating(true);
      clearSafetyTimeout();
      timeoutRef.current = setTimeout(() => {
        setIsNavigating(false);
      }, PROGRESS_BAR_TIMEOUT_MS);
    }, 0);
  }, [clearSafetyTimeout]);

  /** Stop navigation and clear timeout */
  const stopNavigation = useCallback(() => {
    // Defer state update for consistency and safety
    setTimeout(() => {
      setIsNavigating(false);
      clearSafetyTimeout();
    }, 0);
  }, [clearSafetyTimeout]);

  // Reset when path or search params change (navigation completed)
  useEffect(() => {
    stopNavigation();
  }, [pathname, searchParams, stopNavigation]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => clearSafetyTimeout();
  }, [clearSafetyTimeout]);

  useEffect(() => {
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    /**
     * Check if the target URL from a history state call is actually
     * different from the current URL. Prevents false triggers from
     * router.replace() calls that just update search params in-place
     * (e.g. tab switching within the same classroom page).
     */
    const isActualNavigation = (url: unknown): boolean => {
      if (!url || typeof url !== 'string') return false;
      try {
        const target = new URL(url, window.location.origin);
        return target.pathname !== window.location.pathname;
      } catch {
        return false;
      }
    };

    window.history.pushState = function (...args) {
      const [, , url] = args;
      if (isActualNavigation(url)) {
        startNavigation();
      }
      return originalPushState.apply(window.history, args);
    };

    window.history.replaceState = function (...args) {
      const [, , url] = args;
      if (isActualNavigation(url)) {
        startNavigation();
      }
      return originalReplaceState.apply(window.history, args);
    };

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');

      if (
        anchor && 
        anchor.href && 
        anchor.href.startsWith(window.location.origin) && 
        anchor.target !== '_blank' &&
        !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey
      ) {
        const url = new URL(anchor.href);
        // Only trigger for genuinely different pages (not just query/hash changes)
        if (url.pathname !== window.location.pathname) {
          startNavigation();
        }
      }
    };

    window.addEventListener('click', handleAnchorClick);
    return () => {
      window.removeEventListener('click', handleAnchorClick);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, [startNavigation]);

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          key="progress-bar"
          initial={{ width: '0%', opacity: 1 }}
          animate={{ 
            width: '70%',
            transition: { duration: 15, ease: [0.1, 0.05, 0, 1] } 
          }}
          exit={{ 
            width: '100%',
            opacity: 0,
            transition: { duration: 0.3, ease: 'easeOut' }
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '4px',
            backgroundColor: '#FFE492', // Brand Yellow
            zIndex: 99999,
            pointerEvents: 'none',
            boxShadow: '0 0 10px rgba(255, 228, 146, 0.4)',
            borderRadius: '0 2px 2px 0'
          }}
        />
      )}
    </AnimatePresence>
  );
}

const ProgressBarProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Suspense fallback={null}>
        <ProgressBarInner />
      </Suspense>
      {children}
    </>
  );
};

export default ProgressBarProvider;
