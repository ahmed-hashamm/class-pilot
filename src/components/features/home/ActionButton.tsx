import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ActionButton({ buttonText }: { buttonText: string }) {
    return (
        <Link
            href="/login"
            className="group bg-navy-light hover:bg-navy text-white font-bold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/25 inline-flex items-center gap-2.5 text-base hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]"
        >
            {buttonText}
            <ArrowRight size={18} strokeWidth={3} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
    )
}