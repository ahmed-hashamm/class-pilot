import { DIFF_CARDS } from "@/lib/db_data_fetching/marketingData";

export function Differentiators() {
    return (
        <section className="py-20 bg-secondary">
            <div className="max-w-5xl mx-auto px-6">
                <div className="cp-reveal mb-12">
                    <p className="text-[11px] font-semibold tracking-[.2em] uppercase text-navy mb-2">
                        What makes us different
                    </p>
                    <h2 className="font-black text-[clamp(26px,4vw,44px)] leading-tight tracking-tight">
                        Built-in intelligence,<br />at every step
                    </h2>
                </div>

                <div className="cp-reveal grid grid-cols-1 md:grid-cols-3 gap-px
                    bg-border border border-border rounded-2xl overflow-hidden">
                    {DIFF_CARDS.map((d, i) => (
                        <div key={i}
                            className="relative bg-background hover:bg-navy/[.025]
                                transition-colors duration-200 p-8 group">
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-navy
                                scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-2xl" />

                            <span className="inline-block text-[10px] font-bold tracking-widest uppercase
                                text-navy bg-yellow rounded-full px-3 py-0.5 mb-5">
                                {d.badge}
                            </span>

                            <div className="size-11 rounded-xl bg-navy/8 border border-navy/12
                                flex items-center justify-center text-navy mb-5">
                                {d.icon}
                            </div>

                            <h3 className="font-bold text-[20px] leading-snug tracking-tight mb-3">{d.title}</h3>
                            <p className="text-[14px] text-muted-foreground leading-relaxed">{d.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
