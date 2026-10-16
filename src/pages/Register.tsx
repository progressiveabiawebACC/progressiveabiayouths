import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { ExternalLink, CheckCircle2, ShieldCheck, Users, Award, BookOpen, MessageCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Layout from "@/components/Layout";
import { registerFormUrl, contactInfo } from "@/data/siteData";

const benefits = [
  {
    icon: Users,
    title: "17-LGA Grassroots Network",
    description: "Connect with proactive, like-minded young leaders across all 17 Local Government Areas of Abia State.",
  },
  {
    icon: Award,
    title: "Leadership & Civic Training",
    description: "Access workshops, policy dialogues, and capacity-building programs designed for the next generation.",
  },
  {
    icon: BookOpen,
    title: "Educational & Tech Support",
    description: "Eligibility for our scholarship initiatives, digital literacy campaigns, and laptop support programs.",
  },
  {
    icon: ShieldCheck,
    title: "Certified Membership",
    description: "Official recognition as a certified Progressive Abia Youths Ambassador with a recognized voice in advocacy.",
  },
];

const faqs = [
  {
    q: "Is membership registration free?",
    a: "Yes, membership registration is 100% free. Progressive Abia Youths is a grassroots civic organization and does not charge any registration fees.",
  },
  {
    q: "Who is eligible to join?",
    a: "Any young person who originates from, resides in, works in, or is passionately committed to the progressive development and good governance of Abia State.",
  },
  {
    q: "What happens after I register?",
    a: "Our Secretariat and your respective LGA Coordinator will review your submission and contact you within 48–72 hours via email/WhatsApp to welcome you to your local chapter.",
  },
  {
    q: "Can Abians in the diaspora or other states join?",
    a: "Yes! We have dedicated national and diaspora wings that actively participate in strategy, mentorship, and project sponsorship.",
  },
];

const Register = () => {
  const [searchParams] = useSearchParams();
  const eventParam = searchParams.get("event");
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const cleanPhone = contactInfo.phone.replace(/[^0-9]/g, "");

  return (
    <Layout>
      {/* Header Banner */}
      <section className="bg-primary py-16 sm:py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-secondary/85" />
        <div className="container relative text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md mb-4 border border-white/20">
            Official Membership Registration
          </div>
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl md:text-5xl">
            {eventParam ? "Event RSVP & Membership" : "Join the Movement"}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-white/90 leading-relaxed">
            {eventParam ? (
              <span>You are registering for <strong className="underline underline-offset-4">{eventParam}</strong>. Please complete the details below.</span>
            ) : (
              "Take responsibility for our homeland. Become a verified member of Progressive Abia Youths and help steer our state toward sustainable progress."
            )}
          </p>
        </div>
      </section>

      {/* Value Proposition Highlights */}
      <section className="py-16 bg-muted/40 border-b border-border/80">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">Why Join Progressive Abia Youths?</h2>
            <p className="text-base text-foreground/80 mt-2">Four core pillars of our statewide youth community</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-foreground mb-1.5">{b.title}</h3>
                  <p className="text-sm sm:text-base font-normal text-foreground/80 leading-relaxed">{b.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Registration Form Container */}
      <section className="py-12">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            {/* Form helper & direct fallback link */}
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-card border border-border/80 rounded-xl p-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-secondary shrink-0" />
                <span>Secure form hosted directly on Google Workspace. Takes ~3 minutes.</span>
              </div>
              <Button asChild variant="outline" size="sm" className="h-8 text-xs font-bold shrink-0">
                <a href={registerFormUrl} target="_blank" rel="noopener noreferrer">
                  Open in New Window <ExternalLink className="ml-1 h-3.5 w-3.5" />
                </a>
              </Button>
            </div>

            {/* Embedded Iframe with Loading Skeleton */}
            <div className="relative overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm min-h-[600px]">
              {!iframeLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-card p-8 text-center z-10">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-3" />
                  <p className="font-medium text-sm text-foreground">Loading Registration Portal...</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                    If this takes more than a few seconds, you can also{" "}
                    <a href={registerFormUrl} target="_blank" rel="noopener noreferrer" className="text-primary font-bold underline">
                      click here to open the form directly
                    </a>.
                  </p>
                </div>
              )}
              <iframe
                src={registerFormUrl}
                title="Progressive Abia Youths Registration Form"
                className="h-[850px] w-full border-0"
                onLoad={() => setIframeLoaded(true)}
                allowFullScreen
              >
                Loading form…
              </iframe>
            </div>

            {/* Need Help WhatsApp banner */}
            <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
                  <MessageCircle className="h-5 w-5 fill-current" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Need assistance or prefer registering offline?</h4>
                  <p className="text-xs text-muted-foreground">Chat with our secretariat directly on WhatsApp.</p>
                </div>
              </div>
              <Button asChild size="sm" className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold shrink-0">
                <a
                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hello! I need help with registering for Progressive Abia Youths.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp Secretariat
                </a>
              </Button>
            </div>

            {/* FAQ Accordion */}
            <div className="mt-16 pt-12 border-t border-border/80">
              <div className="text-center mb-8">
                <HelpCircle className="h-7 w-7 text-primary mx-auto mb-2" />
                <h3 className="font-display text-2xl font-extrabold text-foreground">Frequently Asked Questions</h3>
                <p className="text-sm sm:text-base text-foreground/80 mt-1">Everything you need to know about joining PAY</p>
              </div>

              <Accordion type="single" collapsible className="w-full space-y-2">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border border-border/80 rounded-xl px-4 bg-card">
                    <AccordionTrigger className="text-left font-display text-base sm:text-lg font-bold text-foreground hover:no-underline py-4">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm sm:text-base font-normal text-foreground/85 leading-relaxed pb-4">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Register;
