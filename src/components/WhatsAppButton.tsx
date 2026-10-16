import { MessageCircle } from "lucide-react";
import { contactInfo } from "@/data/siteData";

export function WhatsAppButton() {
  // Convert phone number "+234 706 6022 292" to standard wa.me format "2347066022292"
  const cleanPhone = contactInfo.phone.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    "Hello Progressive Abia Youths (PAY)! I would like to get involved / ask a question."
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg transition-all hover:bg-[#20ba5a] hover:scale-105 hover:shadow-xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 dark:focus:ring-offset-background"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle className="h-5 w-5 fill-current" />
      <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider">
        Chat with Us
      </span>
    </a>
  );
}
