'use client';

import { Suspense, useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Custom High-Fidelity Progress Bar
 * Reliably intercept navigation events in Next.js 16/React 19.
 */
function ProgressBarInner() {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Reset when path or search params change
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    // Intercept programmatic navigation (router.push, router.replace)
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function (...args) {
      setIsNavigating(true);
      return originalPushState.apply(window.history, args);
    };

    window.history.replaceState = function (...args) {
      setIsNavigating(true);
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
        // Trigger if navigating to a DIFFERENT internal URL
        if (url.pathname !== window.location.pathname || url.search !== window.location.search) {
          setIsNavigating(true);
        }
      }
    };

    window.addEventListener('click', handleAnchorClick);
    return () => {
      window.removeEventListener('click', handleAnchorClick);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

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
