"use client"
export default function BlogSPageClock() {
    return (
        <div className="mx-auto mb-10 w-[200px] h-[200px]">
            <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
                {/* Outer ring */}
                <circle cx="100" cy="100" r="88" stroke="#E5E5E5" strokeWidth="1.5" strokeDasharray="6 4" />
                {/* Inner circle */}
                <circle cx="100" cy="100" r="60" fill="rgba(4,56,115,0.05)" stroke="#043873" strokeWidth="1.5" />
                {/* Clock face */}
                <circle cx="100" cy="100" r="44" fill="white" stroke="#043873" strokeWidth="1.5" />
                {/* Hour markers */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
                    const rad = ((deg - 90) * Math.PI) / 180;
                    const r1 = i % 3 === 0 ? 36 : 38;
                    return (
                        <line key={i}
                            x1={100 + r1 * Math.cos(rad)} y1={100 + r1 * Math.sin(rad)}
                            x2={100 + 42 * Math.cos(rad)} y2={100 + 42 * Math.sin(rad)}
                            stroke={i % 3 === 0 ? "#043873" : "#E5E5E5"} strokeWidth={i % 3 === 0 ? 1.5 : 1}
                            strokeLinecap="round" />
                    );
                })}
                {/* Hour hand — pointing ~10 o'clock */}
                <line x1="100" y1="100" x2="82" y2="80" stroke="#043873" strokeWidth="2.5" strokeLinecap="round" />
                {/* Minute hand — pointing ~2 o'clock */}
                <line x1="100" y1="100" x2="118" y2="74" stroke="#043873" strokeWidth="2" strokeLinecap="round" />
                {/* Centre dot */}
                <circle cx="100" cy="100" r="4" fill="#FFE492" stroke="#043873" strokeWidth="1.5" />
                {/* Stars */}
                {[[28, 32], [168, 28], [172, 158], [24, 162]].map(([cx, cy], i) => (
                    <polygon key={i}
                        points={`${cx},${cy - 6} ${cx + 1.5},${cy - 2} ${cx + 5},${cy - 2} ${cx + 2.5},${cy + 1} ${cx + 3.5},${cy + 5} ${cx},${cy + 2.5} ${cx - 3.5},${cy + 5} ${cx - 2.5},${cy + 1} ${cx - 5},${cy - 2} ${cx - 1.5},${cy - 2}`}
                        fill="#FFE492" stroke="#043873" strokeWidth="0.8" opacity={i % 2 === 0 ? 1 : 0.5} />
                ))}
            </svg>
        </div>

    )
}