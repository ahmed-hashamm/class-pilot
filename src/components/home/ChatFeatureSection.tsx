import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const ChatFeatureSection = () => {
  return (
    <section className="bg-primary-foreground text-foreground py-16 lg:py-24">
      <div className="container mx-auto px-6 lg:px-20 ">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Content */}
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
              Talk, ask,<br />
              debate — right<br />
              <span className="relative inline-block">
                under the task
                <span className="absolute bottom-1 left-0 w-full h-1 bg-accent rounded-full" />
              </span>
            </h2>

            <p className="mt-6 mb-8 max-w-lg leading-relaxed text-muted-foreground">
              Every class and assignment has its own discussion thread. Students
              can ask questions, share answers, or clarify doubts — all from a
              single file icon.
            </p>

            <Link
              href="/login"
              className="bg-navy-light text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-accent transition-colors inline-flex items-center gap-2"
            >
              Get On
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative aspect-[4/3] w-full max-w-md rounded-2xl overflow-hidden">
              <Image
                src="/discussions3.png"
                alt="Classroom discussions"
                fill
                className="object-contain sm:object-cover"
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
