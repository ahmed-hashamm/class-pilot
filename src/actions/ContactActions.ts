"use server";

import { ContactService, ContactFormData } from "@/lib/services/contact.service";
import { contactFormSchema } from "@/lib/validations/contact";

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────────────────── */
export interface ContactFormState {
  status: "idle" | "success" | "error";
  message?: string;
}

export { type ContactFormData };

/* ─────────────────────────────────────────────────────────────────────────────
   ACTION
───────────────────────────────────────────────────────────────────────────── */

export async function sendContactForm(
  payload: unknown
): Promise<{ data: 'success' | null; error: string | null }> {
  const parsed = contactFormSchema.safeParse(payload)
  if (!parsed.success) {
    return { data: null, error: parsed.error.errors[0]?.message || "Invalid input." }
  }

  try {
    await ContactService.sendContactForm(parsed.data);
    return { data: "success", error: null };
  } catch (err) {
    return {
      data: null,
      error: "Something went wrong. Please try again or email us directly.",
    };
  }
}