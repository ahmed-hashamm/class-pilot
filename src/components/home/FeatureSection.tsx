import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
    <section className={`${bgClass} py-16 lg:py-24`}>
      <div className="container mx-auto px-6 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div
            className={`relative ${
              imagePosition === "right" ? "lg:order-2" : "lg:order-1"
            }`}
          >
            <div className="relative aspect-[4/3] max-w-md mx-auto rounded-2xl overflow-hidden">
              <Image
                src={imageSrc}
                alt={title}
                fill
                className="object-contain sm:object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          {/* Content */}
          <div
            className={`${
              imagePosition === "right" ? "lg:order-1" : "lg:order-2"
            }`}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
              {title}
              {titleHighlight && (
                <>
                  <br />
                  <span className="relative inline-block">
                    {titleHighlight}
                    <span className="absolute bottom-1 left-0 w-full h-1 bg-accent rounded-full" />
                  </span>
                </>
              )}
            </h2>

            <p className="text-muted-foreground mt-6 mb-8 max-w-lg leading-relaxed">
              {description}
            </p>

            <Link
              href="/login"
              className="bg-navy-light text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-accent transition-colors inline-flex items-center gap-2"
            >
              {buttonText}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
