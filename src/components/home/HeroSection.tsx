import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="bg-navy text-primary-foreground relative overflow-hidden">
      {/* Wave decoration lines */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute top-0 left-0 w-full h-full opacity-20"
          viewBox="0 0 1200 600"
          preserveAspectRatio="none"
        >
          <path
            d="M0,100 Q300,150 600,100 T1200,100"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-primary-foreground/30"
          />
          <path
            d="M0,150 Q300,200 600,150 T1200,150"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-primary-foreground/20"
          />
          <path
            d="M0,200 Q300,250 600,200 T1200,200"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-primary-foreground/10"
          />
        </svg>
      </div>

      <div className="container mx-auto px-6 lg:px-20 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="relative z-10">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6">
              Create, Learn &<br />
              Collaborate — All in One<br />
              Classroom
            </h1>

            <p className="text-lg text-primary-foreground/80 mb-8 max-w-lg">
              An awesome virtual classroom for teachers and students.
            </p>

            <Link
              href="/login"
              className="bg-navy-light text-primary-foreground font-semibold px-5 py-2 rounded-lg hover:bg-accent transition-colors inline-flex items-center gap-2"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Hero Image */}
          <div className="relative z-10 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden ">
              <Image
                src="/hero-img.png"
                alt="Class Pilot virtual classroom"
                fill
                priority
                className="object-contain sm:object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
