import Image from "next/image";
import ActionButton from "./ActionButton";

const HeroSection = () => {
  return (
    <section className="bg-navy h-full text-primary-foreground relative overflow-hidden">
      {/* Background decoration: clean wavy line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute top-0 right-0 w-1/2 h-full opacity-10"
          viewBox="0 0 600 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M600 0C600 331.371 331.371 600 0 600"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="w-full max-w-[1600px] mx-auto p-8 py-16 md:p-12 lg:p-16">
        <div className="grid lg:grid-cols-2 gap-20 sm:gap-16 items-center">
          {/* Text Content */}
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl lg:text-5xl font-extrabold leading-[1.1] mb-8 tracking-tight">
              Create, Learn &<br />
              Collaborate — All in<br />
              One Classroom
            </h1>

            <p className="text-xl text-primary-foreground/80 mb-10 max-w-lg leading-relaxed">
              An awesome virtual classroom for teachers and students.
            </p>

            <ActionButton buttonText="Get Started" />
          </div>

          {/* Hero Image / Illustration */}
          <div className="relative z-10 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-2xl aspect-[4/3]">
              <Image
                src="/hero-img.png"
                alt="Class Pilot virtual classroom"
                fill
                priority
                className="object-contain"
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
