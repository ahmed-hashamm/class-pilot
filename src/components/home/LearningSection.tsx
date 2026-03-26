import ActionButton from "./ActionButton";
const LearningSection = () => {
  return (
    <section className="bg-navy text-primary-foreground relative overflow-hidden py-20 lg:py-32">
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

      <div className="w-full max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 relative z-10">
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
            <ActionButton buttonText="All in one" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LearningSection;
