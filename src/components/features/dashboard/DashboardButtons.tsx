"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
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

  return (
    <>
      <div className="flex flex-wrap gap-2.5">
        <motion.div whileTap={{ scale: 0.97 }}>
          <Button 
            variant="yellow"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={15} />
            Create class
          </Button>
        </motion.div>

        <motion.div whileTap={{ scale: 0.97 }}>
          <Button 
            variant="yellow"
            onClick={() => setShowJoinModal(true)}
          >
            <LinkIcon size={15} />
            Join class
          </Button>
        </motion.div>

        {DASHBOARD_NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="inline-flex">
            <motion.div whileTap={{ scale: 0.97 }}>
              <Button variant="ghost" className="bg-white/10 border border-white/20 text-white/80 hover:bg-white/15 hover:text-white px-3.5">
                {link.icon && <link.icon size={15} />}
                {link.label}
              </Button>
            </motion.div>
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
