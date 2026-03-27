import Image from "next/image";
import ActionButton from "./ActionButton";

interface FeatureSectionProps {
  title: string;
  titleHighlight?: string;
  description: string;
  buttonText: string;
  imageSrc: string; // ✅ NEW
  imagePosition: "left" | "right";
  bgColor: "white" | "gray";
}

const FeatureSection = ({
  title,
  titleHighlight,
  description,
  buttonText,
  imageSrc,
  imagePosition,
  bgColor,
}: FeatureSectionProps) => {
  const bgClass = bgColor === "white" ? "bg-background" : "bg-secondary";

  return (
    <section className={`${bgClass} py-20 lg:py-32 overflow-hidden`}>
      <div className="w-full max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div
            className={`relative ${imagePosition === "right" ? "lg:order-2" : "lg:order-1"
              }`}
          >
            <div className="relative aspect-[4/3] w-full max-w-2xl mx-auto">
              <Image
                src={imageSrc}
                alt={title}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          {/* Content */}
          <div
            className={`${imagePosition === "right" ? "lg:order-1" : "lg:order-2"
              }`}
          >
            <h2 className="text-4xl lg:text-5xl font-extrabold text-navy leading-tight">
              {title}
              {titleHighlight && (
                <>
                  <br />
                  <span className="relative inline-block">
                    {titleHighlight}
                    <span className="absolute bottom-1 left-0 w-full h-1.5 bg-yellow rounded-full z-[-1]" />
                  </span>
                </>
              )}
            </h2>

            <p className="text-xl text-muted-foreground mt-8 mb-10 max-w-lg leading-relaxed">
              {description}
            </p>

            <ActionButton buttonText={buttonText} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
