import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ActionButton({ buttonText }: { buttonText: string }) {
    return (
        <Link
            href="/login"
            className="bg-navy-light hover:bg-navy-light/80 text-white font-bold px-6 py-3 rounded-sm transition-all shadow-lg hover:shadow-blue-500/20 inline-flex items-center gap-3 text-md hover:scale-110 active:scale-95"
        >
            {buttonText}
            <ArrowRight size={22} strokeWidth={3} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
    )
}