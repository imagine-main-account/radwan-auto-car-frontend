import { MessageCircle, Phone } from "lucide-react";

import { FacebookIcon } from "@/components/icons";
import { useSiteContent } from "@/hooks/use-site-content";
import { LinkButton, type LinkButtonProps } from "./link-button";

type ContactButtonProps = Omit<LinkButtonProps, "href" | "icon">;

export function WhatsAppButton({ children = "واتساب", ...props }: ContactButtonProps) {
  const { contact } = useSiteContent();
  return (
    <LinkButton href={contact.whatsapp.href} icon={MessageCircle} {...props}>
      {children}
    </LinkButton>
  );
}

/** Shows the phone number by default. */
export function PhoneButton({ children, ...props }: ContactButtonProps) {
  const { contact } = useSiteContent();
  return (
    <LinkButton href={contact.phone.href} icon={Phone} {...props}>
      {children ?? <span dir="ltr">{contact.phone.label}</span>}
    </LinkButton>
  );
}

export function FacebookButton({ href, ...props }: ContactButtonProps & { href?: string }) {
  const { siteInfo } = useSiteContent();
  return <LinkButton href={href ?? siteInfo.facebook.page} icon={FacebookIcon} {...props} />;
}
