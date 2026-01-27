import { ArrowRight } from "lucide-react";
import Link from "next/link";

const CTASection = () => {
  return (
    <section className="bg-secondary text-accent-foreground py-16 lg:py-24">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
          Join Class Pilot<br />today
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Built as a Final Year Project — aiming to make digital learning actually usable.
        </p>
        <Link
          href="/login"
          className="bg-navy-light text-primary-foreground font-semibold px-8 py-3 rounded-lg hover:bg-navy-light transition-colors inline-flex items-center gap-2"
        >
          Try Class Pilot
          <ArrowRight size={18} />
        </Link>
        <p className="mt-6 text-sm text-muted-foreground">
          Have some thoughts?{" "}
          <a href="#" className=" hover:underline font-medium">
            Contact us
          </a>
        </p>
      </div>
    </section>
  );
};

export default CTASection;