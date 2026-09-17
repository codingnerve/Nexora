import { Mail, Phone } from "lucide-react";

import { ButtonLink, type ButtonSize } from "@/components/ui/Button";
import { CONTACT, IS_TOLL_FREE_CONFIGURED, toTelHref } from "@/lib/constants";

/**
 * The secondary "Call Toll-Free" button that sits beside a primary request
 * action. When no toll-free number is configured it becomes a link to the
 * contact page, so no section ever renders a placeholder number.
 */
export function CallButton({
  onDark = false,
  size = "lg",
  fullWidthOnMobile = true,
  className,
}: {
  onDark?: boolean;
  size?: ButtonSize;
  fullWidthOnMobile?: boolean;
  className?: string;
}) {
  if (IS_TOLL_FREE_CONFIGURED) {
    return (
      <ButtonLink
        href={toTelHref(CONTACT.tollFree)}
        variant={onDark ? "secondary" : "phone"}
        size={size}
        onDark={onDark}
        iconLeft={<Phone />}
        fullWidthOnMobile={fullWidthOnMobile}
        className={className}
        aria-label={`Call toll-free: ${CONTACT.tollFree}`}
      >
        Call Toll-Free
      </ButtonLink>
    );
  }

  return (
    <ButtonLink
      href="/contact"
      variant="secondary"
      size={size}
      onDark={onDark}
      iconLeft={<Mail />}
      fullWidthOnMobile={fullWidthOnMobile}
      className={className}
    >
      Contact Us
    </ButtonLink>
  );
}
