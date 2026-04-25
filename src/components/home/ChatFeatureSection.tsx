import Image from "next/image";
import ActionButton from "./ActionButton";

const ChatFeatureSection = () => {
  return (
    <section className="bg-primary-foreground text-foreground py-20 lg:py-32">
      <div className="w-full max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Content */}
          <div>
            <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight text-navy">
              Talk, ask,<br />
              debate — in your<br />
              <span className="relative inline-block">
                class channels
                <span className="absolute bottom-1 left-0 w-full h-1.5 bg-yellow rounded-full z-[-1]" />
              </span>
            </h2>

            <p className="mt-8 mb-10 max-w-lg leading-relaxed text-xl text-muted-foreground">
              Every class features dedicated discussion channels. Students can ask questions, share insights, and collaborate with peers—keeping all communication organized and accessible in one place.
            </p>

            <ActionButton buttonText="Explore Discussions" />
          </div>

          {/* Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative aspect-[4/3] w-full max-w-2xl">
              <Image
                src="/discussions3.png"
                alt="Classroom discussions"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ChatFeatureSection;
