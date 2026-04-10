import { DiagramAIChat, DiagramGroupCollab } from "@/components/illustrations/HowItWorksPageDiagrams";

export function AssistantSpotlight() {
    return (
        <section className="py-20 bg-background">
            <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="cp-reveal">
                    <p className="text-[11px] font-semibold tracking-[.2em] uppercase text-navy mb-2">
                        Spotlight
                    </p>
                    <h2 className="font-black text-[clamp(24px,3.5vw,40px)] leading-tight tracking-tight mb-4">
                        An AI tutor that only knows{" "}
                        <span className="relative inline-block">
                            your class
                            <span className="absolute bottom-0 left-0 right-0 h-1 bg-yellow rounded-full" />
                        </span>
                    </h2>
                    <p className="text-[15px] text-muted-foreground leading-relaxed mb-4">
                        The Class AI Assistant is built from the materials you upload — lecture notes,
                        textbook chapters, past papers, revision guides. Students get accurate,
                        on-syllabus answers, every time.
                    </p>
                    <p className="text-[15px] text-muted-foreground leading-relaxed">
                        Every answer is cited back to the source so students can verify it themselves.
                        You stay in complete control of what the AI knows.
                    </p>
                </div>
                <div className="cp-reveal cp-float" style={{ transitionDelay: "0.15s" }}>
                    <div className="bg-white border border-border rounded-2xl shadow-sm p-5 overflow-hidden">
                        <DiagramAIChat />
                    </div>
                </div>
            </div>
        </section>
    );
}

export function CollabSpotlight() {
    return (
        <section className="py-20 bg-secondary">
            <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="cp-reveal cp-float order-2 md:order-1">
                    <div className="bg-white border border-border rounded-2xl shadow-sm p-5 overflow-hidden">
                        <DiagramGroupCollab />
                    </div>
                </div>
                <div className="cp-reveal order-1 md:order-2" style={{ transitionDelay: "0.15s" }}>
                    <p className="text-[11px] font-semibold tracking-[.2em] uppercase text-navy mb-2">
                        Spotlight
                    </p>
                    <h2 className="text-primary text-[clamp(24px,3.5vw,40px)] leading-tight tracking-tight mb-4">
                        Group work,<br />fully visible
                    </h2>
                    <p className="text-[15px] text-muted-foreground leading-relaxed mb-4">
                        Students collaborate in a shared workspace — writing, editing, and commenting
                        in real time. No switching to external tools, no version confusion.
                    </p>
                    <p className="text-[15px] text-muted-foreground leading-relaxed">
                        Teachers see a single submission so that there is no repetition — saving them a lot of time.
                    </p>
                </div>
            </div>
        </section>
    );
}
