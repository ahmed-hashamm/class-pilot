'use client'

import { useState } from "react";
import { sendContactForm, ContactFormState } from "@/actions/ContactActions";
import { Select } from "@/components/ui";

const MESSAGE_TYPES = [
    "General question",
    "Bug report",
    "Feature request",
    "Partnership",
];

function Field({
    label,
    required,
    children,
    error,
}: {
    label: string;
    required?: boolean;
    children: React.ReactNode;
    error?: string;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-foreground">
                {label}
                {required && <span className="text-navy ml-0.5">*</span>}
            </label>
            {children}
            {error && (
                <p className="text-[12px] text-red-500 font-medium">{error}</p>
            )}
        </div>
    );
}

function SuccessState({ name, onReset }: { name: string; onReset: () => void }) {
    return (
        <div className="flex flex-col items-center text-center py-12 px-6">
            <div className="size-16 rounded-full bg-navy flex items-center justify-center mb-6">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M6 14l6 6 10-10" stroke="#FFE492" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <h3 className="font-black text-[24px] tracking-tight mb-2">
                Message sent, {name.split(" ")[0]}.
            </h3>
            <p className="text-[15px] text-muted-foreground leading-relaxed max-w-sm mb-2">
                We've received your message and will get back to you within a few hours.
                Check your inbox — we've sent you a confirmation too.
            </p>
            <p className="text-[13px] text-muted-foreground mb-8">
                In the meantime, try the{" "}
                <a href="/help" className="text-navy font-semibold hover:underline">
                    Help Center
                </a>{" "}
                for quick answers.
            </p>
            <button
                onClick={onReset}
                className="text-[13px] font-semibold text-muted-foreground
          hover:text-navy transition cursor-pointer bg-transparent border-none">
                ← Send another message
            </button>
        </div>
    );
}

export function ContactForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [type, setType] = useState(MESSAGE_TYPES[0]);
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState<ContactFormState>({ status: "idle" });
    const [errors, setErrors] = useState<Record<string, string>>({});

    function validate() {
        const e: Record<string, string> = {};
        if (!name.trim()) e.name = "Name is required.";
        if (!email.trim()) e.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            e.email = "Enter a valid email address.";
        if (!body.trim()) e.body = "Message is required.";
        return e;
    }

    async function handleSubmit() {
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        setErrors({});
        setLoading(true);
        const { data: resData, error: resError } = await sendContactForm({ name, email, type, subject, body });
        if (resError) {
            setState({ status: "error", message: resError });
        } else {
            setState({ status: "success" });
        }
        setLoading(false);
    }

    const inputClass = (field: string) =>
        `w-full bg-white border rounded-lg px-4 py-3 text-[14px] text-foreground
    placeholder:text-muted-foreground focus:outline-none focus:ring-2
    focus:ring-navy/20 focus:border-navy transition
    ${errors[field] ? "border-red-400" : "border-border"}`;

    if (state.status === "success") {
        return (
            <SuccessState
                name={name}
                onReset={() => {
                    setState({ status: "idle" });
                    setName(""); setEmail(""); setSubject(""); setBody("");
                    setType(MESSAGE_TYPES[0]);
                }}
            />
        );
    }

    return (
        <div className="p-8 flex flex-col gap-5">
            <div>
                <h2 className="font-black text-[20px] tracking-tight mb-1">
                    Send us a message
                </h2>
                <p className="text-[13px] text-muted-foreground">
                    Fields marked <span className="text-navy font-semibold">*</span> are required.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Name" required error={errors.name}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Smith"
                        className={inputClass("name")}
                    />
                </Field>
                <Field label="Email" required error={errors.email}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jane@school.com"
                        className={inputClass("email")}
                    />
                </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Type">
                    <Select
                        name="type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        {MESSAGE_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </Select>
                </Field>
                <Field label="Subject">
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Brief summary (optional)"
                        className={inputClass("subject")}
                    />
                </Field>
            </div>

            <Field label="Message" required error={errors.body}>
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Tell us what's on your mind…"
                    rows={6}
                    className={`${inputClass("body")} resize-none`}
                />
            </Field>

            {state.status === "error" && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200
rounded-lg px-4 py-3">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                        <circle cx="8" cy="8" r="7" stroke="#ef4444" strokeWidth="1.5" />
                        <path d="M8 5v4M8 11v.5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <p className="text-[13px] text-red-600 font-medium">{state.message}</p>
                </div>
            )}

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 bg-navy text-white
font-semibold text-[14px] px-7 py-3.5 rounded-lg
hover:bg-navy/90 hover:-translate-y-0.5 transition-all
disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0
cursor-pointer border-none self-start">
                {loading ? (
                    <>
                        <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="1.5" strokeDasharray="8 6" />
                        </svg>
                        Sending…
                    </>
                ) : (
                    <>
                        Send message
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6"
                                strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </>
                )}
            </button>
        </div>
    );
}
