// "use client";

// import WavePattern from "../layout/WavePattern";
// import DashboardButtons from "./DashboardButtons";

// export default function DashboardHero({ userName, userId,role }: any) {
//   return (
//     <>
//       <div className="relative bg-navy text-primary-foreground w-full py-16 pb-6">
//         {/* Wave decoration */}
//         <WavePattern />
//         <div className="relative container flex flex-col justify-between mx-auto px-6 lg:px-8">
//           {/* Greeting */}
//           <h1 className="text-4xl  font-bold">
//             Hello {userName}...
//           </h1>
//           {/* Action Buttons */}
//           <DashboardButtons userId={userId} role={role} />
//         </div>
//       </div>
//     </>
//   );
// }

"use client";

import WavePattern from "@/components/layout/WavePattern";
import DashboardButtons from "./DashboardButtons";

/**
 * A bold, visual header for the user's dashboard.
 * 
 * Features:
 * - Dynamic time-of-day greeting (Morning/Afternoon/Evening)
 * - Decorative WavePattern SVG with glassmorphism backgrounds
 * - Personalized name extraction (displays first name only)
 * - Quick action buttons (Join Class, Create Class)
 */
export default function DashboardBanner({ userName, userId, role }: any) {
  /* ── Extraction helper for first name only ── */
  const firstName = userName?.split(" ")[0] || userName;

  /* ── Time-based greeting logic based on user's system clock ── */
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" :
      hour < 17 ? "Good afternoon" :
        "Good evening";

  return (
    <div className="relative bg-navy text-white w-full py-14 pb-8 overflow-hidden">
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,_rgba(79,156,249,.2)_0%,_transparent_70%)]"
      />

      <WavePattern />

      <div className="relative w-full max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16">
        {/* Eyebrow */}
        <span className="inline-flex items-center gap-2 text-[11px] font-semibold
          tracking-[.18em] uppercase bg-white/10 border border-white/20
          rounded-full px-3 py-1 mb-4 text-white/70">
          <span className="size-1.5 rounded-full bg-yellow inline-block" />
          Dashboard
        </span>

        {/* Greeting */}
        <h1 className="text-[clamp(26px,4vw,42px)] font-black tracking-tight leading-tight mb-1">
          {greeting},{" "}
          <span className="text-yellow">{firstName}</span>
          <span className="text-white/40">.</span>
        </h1>

        <p className="text-white/50 text-[14px] font-light mb-8">
          Here's what's happening across your classes today.
        </p>

        <DashboardButtons userId={userId} role={role} />
      </div>
    </div>
  );
}
