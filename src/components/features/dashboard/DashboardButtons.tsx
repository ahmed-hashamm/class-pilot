"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Link as LinkIcon } from "lucide-react";
import CreateClassModal from "@/components/features/classes/modals/CreateClassModal";
import JoinClassModal from "@/components/features/classes/modals/JoinClassModal";
import { DASHBOARD_NAV_LINKS } from "@/lib/data/navigation";

interface DashboardButtonsProps {
  userId: string;
  role: string;
}

export default function DashboardButtons({
  userId,
  role,
}: DashboardButtonsProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const router = useRouter();

  const handleSuccess = () => router.refresh();

  const primaryBtn =
    "inline-flex items-center gap-2 bg-yellow text-navy text-[13px] font-bold " +
    "px-3.5 py-2 rounded-md hover:bg-yellow/90 hover:-translate-y-0.5 " +
    "transition-all shadow-sm whitespace-nowrap cursor-pointer border-none";

  const ghostBtn =
    "inline-flex items-center gap-2 bg-white/10 border border-white/20 " +
    "text-white/80 text-[13px] font-semibold px-3.5 py-2 rounded-md " +
    "hover:bg-white/15 hover:text-white transition-all whitespace-nowrap";

  return (
    <>
      <div className="flex flex-wrap gap-2.5">
        <button onClick={() => setShowCreateModal(true)} className={primaryBtn}>
          <Plus size={15} />
          Create class
        </button>

        <button onClick={() => setShowJoinModal(true)} className={primaryBtn}>
          <LinkIcon size={15} />
          Join class
        </button>

        {DASHBOARD_NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className={ghostBtn}>
            {link.icon && <link.icon size={15} />}
            {link.label}
          </Link>
        ))}
      </div>

      {showCreateModal && userId && (
        <CreateClassModal
          userId={userId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleSuccess}
        />
      )}

      {showJoinModal && userId && (
        <JoinClassModal
          userId={userId}
          onClose={() => setShowJoinModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
