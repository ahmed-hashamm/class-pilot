import { ArrowRight } from "lucide-react";
import Link from "next/link";
const LearningSection = () => {
  return (
    <section className="bg-navy text-primary-foreground relative overflow-hidden py-16 lg:py-24">
      {/* Wave decoration lines */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute top-0 left-0 w-full h-full opacity-20" viewBox="0 0 1200 400" preserveAspectRatio="none">
          <path
            d="M0,50 Q300,100 600,50 T1200,50"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-primary-foreground/30"
          />
          <path
            d="M0,100 Q300,150 600,100 T1200,100"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-primary-foreground/20"
          />
          <path
            d="M0,350 Q300,300 600,350 T1200,350"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-primary-foreground/20"
          />
        </svg>
      </div>

      <div className="container mx-auto px-6 lg:px-20 relative z-10">
        <div className=" gap-12 items-center">
          {/* Content */}
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold leading-tight mb-6">
              Less chaos and more{" "}
              <span className="relative inline-block">
                learning
                <span className="absolute bottom-1 left-0 w-full h-1 bg-accent rounded-full"></span>
              </span>
            </h2>
            <p className="text-primary-foreground/80 mb-8 mx-auto lg:mx-48 leading-relaxed">
              Class Pilot was built for everyone that teaches and / or learns it all in one highly
              intuitive, distraction-free platform. WhatsApp, Google Drive, LMSs, and scattered links. It because every big plan — class online, assignment, or AI — to that teaching
              becomes easy.
            </p>
            <Link href={"/login"} className="bg-navy-light text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:brightness-110 transition-all inline-flex items-center gap-2">
              All in one
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LearningSection;
