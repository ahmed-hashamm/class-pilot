"use client";
import { useState } from "react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Simply the best way to run a course online, from teaching to grading. The student feedback loop is incredibly fast and easy.",
    name: "Oberon Shaw, MCH",
    title: "Head of Talent Acquisition, North America",
  },
  {
    quote: "Simply the best way to run a course online. Just try it, you'll be amazed by how much time it saves.",
    name: "Oberon Shaw, MCH",
    title: "Head of Talent Acquisition, North America",
  },
  {
    quote: "Simply the best way to run a course online. Just try it, you'll be amazed by how much time it saves.",
    name: "Oberon Shaw, MCH",
    title: "Head of Talent Acquisition, North America",
  },
];

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(1);

  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="container mx-auto px-6 lg:px-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-center text-foreground mb-12">
          What Our Clients{" "}
          <span className="relative inline-block">
            Says
            <span className="absolute bottom-1 left-0 w-full h-1 bg-accent rounded-full"></span>
          </span>
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`p-6 rounded-2xl transition-all duration-300 ${index === activeIndex
                  ? "bg-navy-light text-primary-foreground shadow-xl scale-110"
                  : "bg-muted text-foreground"
                }`}
            >
              <Quote
                size={50}
                className={index === activeIndex ? "text-primary-foreground mb-4" : "text-navy mb-4"}
              />
              <p className={`mb-6 leading-relaxed ${index === activeIndex ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                {testimonial.quote}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                  <span className="text-lg">👤</span>
                </div>
                <div>
                  <p className={`font-semibold text-sm ${index === activeIndex ? "text-primary-foreground" : "text-foreground"}`}>
                    {testimonial.name}
                  </p>
                  <p className={`text-xs ${index === activeIndex ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {testimonial.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${index === activeIndex ? "bg-navy" : "bg-border"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
