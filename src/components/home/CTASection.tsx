import ActionButton from "./ActionButton";

const CTASection = () => {
  return (
    <section className="bg-secondary text-accent-foreground py-20 lg:py-32">
      <div className="w-full max-w-[1600px] mx-auto px-8 md:px-12 lg:px-20 text-center">
        <h2 className="text-4xl lg:text-5xl font-extrabold mb-8 text-navy leading-tight">
          Join Class Pilot<br />today
        </h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          Built as a Final Year Project — aiming to make digital learning actually usable.
        </p>
        <ActionButton buttonText="Try Class Pilot" />
        <p className="mt-8 text-sm text-muted-foreground">
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
