import { PhoneButton, WhatsAppButton } from "@/components/shared/contact-buttons";

/** Call / WhatsApp bar pinned to the bottom of the screen on phones. */
export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t bg-background/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
      <PhoneButton variant="outline">اتصل</PhoneButton>
      <WhatsAppButton />
    </div>
  );
}
