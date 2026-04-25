import ActionButton from "./ActionButton";

const CTASection = () => {
  return (
    <section className="bg-secondary text-accent-foreground py-20 lg:py-32">
      <div className="w-full max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 text-center">
        <h2 className="text-4xl lg:text-5xl font-extrabold mb-8 text-navy leading-tight">
          Join Class Pilot<br />today
        </h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          Empowering educators and students with the next generation of classroom tools.
        </p>
        <ActionButton buttonText="Try Class Pilot" />
        <p className="mt-8 text-sm text-muted-foreground">
          Have questions or feedback?{" "}
          <a href="/contact" className="hover:underline font-medium text-navy">
            Contact our team
          </a>
        </p>
      </div>
    </section>
  );
};

export default CTASection;
