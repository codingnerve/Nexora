import { Phone } from "lucide-react";

import { ContactForm } from "@/components/forms/ContactForm";
import { PANEL_SURFACE } from "@/components/forms/InquiryCard";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CONTACT, IS_TOLL_FREE_CONFIGURED, toTelHref } from "@/lib/constants";

/**
 * Site-wide enquiry band, rendered by `<PageShell>` just above the footer.
 *
 * A short version of the contact form (name, email, phone, message). It posts
 * to the same general-enquiry endpoint, then sends the visitor to /thank-you,
 * which leads with a call prompt for these submissions.
 */
export function EnquiryBand() {
  return (
    <Section id="enquiry" tone="muted" space="md" className="scroll-mt-24">
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Enquiry"
            title="Have a question? Ask us."
            lede="Leave your details and a Nexora travel specialist will get back to you about flights, stays, cabs or a whole trip."
            size="md"
          />

          {IS_TOLL_FREE_CONFIGURED ? (
            <a
              href={toTelHref(CONTACT.tollFree)}
              aria-label={`Call toll-free: ${CONTACT.tollFree}`}
              className="group mt-8 inline-flex items-center gap-3"
            >
              <span
                aria-hidden="true"
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-clay-500/12 text-clay-700 transition-colors duration-200 group-hover:bg-clay-500 group-hover:text-ink-900"
              >
                <Phone className="size-5" strokeWidth={1.75} />
              </span>
              <span>
                <span className="block text-caption font-bold uppercase tracking-[0.12em] text-stone-500">
                  Prefer to talk?
                </span>
                <span className="nx-figures block text-[1.1875rem] font-bold tracking-[-0.01em] text-ink-900 transition-colors duration-200 group-hover:text-clay-700">
                  {CONTACT.tollFree}
                </span>
              </span>
            </a>
          ) : null}
        </div>

        <div className={`lg:col-span-7 ${PANEL_SURFACE}`}>
          <div className="p-5 sm:p-7 lg:p-8">
            <ContactForm condensed offerCall />
          </div>
        </div>
      </div>
    </Section>
  );
}
