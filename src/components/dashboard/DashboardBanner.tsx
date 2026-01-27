"use client";

import WavePattern from "../layout/WavePattern";
import DashboardButtons from "./DashboardButtons";

export default function DashboardHero({ userName, userId,role }: any) {
  return (
    <>
      <div className="relative bg-navy text-primary-foreground w-full py-16 pb-6">
        {/* Wave decoration */}
        <WavePattern />
        <div className="relative container flex flex-col justify-between mx-auto px-6 lg:px-20">
          {/* Greeting */}
          <h1 className="text-4xl  font-bold">
            Hello {userName}...
          </h1>
          {/* Action Buttons */}
          <DashboardButtons userId={userId} role={role} />
        </div>
      </div>
    </>
  );
}
