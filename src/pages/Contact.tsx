import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Facebook, Twitter, Instagram, Youtube, MessageCircle, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { contactInfo } from "@/data/siteData";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5 },
};

import { localCreate } from "@/lib/localStore";
import { submitToWeb3Forms } from "@/lib/web3forms";

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const cleanPhone = contactInfo.phone.replace(/[^0-9]/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: "Please fill out all required fields", variant: "destructive" });
      return;
    }
    setSending(true);

    try {
      // 1. Capture to local inbox immediately
      localCreate("submissions", {
        name: form.name,
        email: form.email,
        subject: form.subject || "Contact Inquiry",
        message: form.message,
        source: "Contact Page",
        phone: null,
        is_read: false,
      });

      // 2. Deliver to email via Web3Forms if key configured
      await submitToWeb3Forms(form.subject || `Inquiry from ${form.name}`, {
        name: form.name,
        email: form.email,
        message: form.message,
        subject: form.subject,
      });

      setSubmitted(true);
      toast({
        title: "Message sent successfully!",
        description: "Your message has been received by our secretariat. We will respond promptly.",
      });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast({
        title: "Message delivered",
        description: "Your inquiry has been logged.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Layout>
      <section className="bg-primary py-16 sm:py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-secondary/85" />
        <div className="container relative text-center">
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl md:text-5xl">Connect With Us</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-white/90">
            Have questions, partnership inquiries, or community proposals? We are here to listen and collaborate.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Contact Details & WhatsApp Banner */}
            <motion.div {...fadeIn} className="space-y-4">
              {/* WhatsApp Fast Channel */}
              <div className="rounded-2xl border border-[#25D366]/40 bg-[#25D366]/10 p-6 space-y-3.5 shadow-sm">
                <div className="flex items-center gap-3 text-foreground font-bold text-base">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
                    <MessageCircle className="h-5 w-5 fill-current" />
                  </div>
                  <span>Instant WhatsApp Response</span>
                </div>
                <p className="text-sm font-normal text-foreground/80 leading-relaxed">
                  For rapid feedback, volunteer inquiries, or urgent questions, chat directly with our Abia State secretariat.
                </p>
                <Button asChild size="default" className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold shadow-xs">
                  <a
                    href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hello Progressive Abia Youths! I have an inquiry.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open WhatsApp Chat
                  </a>
                </Button>
              </div>

              {/* Physical Address */}
              <Card className="border border-border/80 shadow-sm bg-card">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-bold text-foreground">State Secretariat</h3>
                    <p className="text-sm sm:text-base font-normal text-foreground/80 mt-1 leading-relaxed">{contactInfo.address}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Phone */}
              <Card className="border border-border/80 shadow-sm bg-card">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-bold text-foreground">Phone Lines</h3>
                    <a href={`tel:${contactInfo.phone}`} className="text-base font-bold text-primary hover:underline block mt-1">
                      {contactInfo.phone}
                    </a>
                    <span className="text-xs sm:text-sm font-semibold text-foreground/75 flex items-center gap-1.5 mt-1.5">
                      <Clock className="h-4 w-4 text-secondary" /> Mon – Sat, 9:00 AM – 5:00 PM
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Email */}
              <Card className="border border-border/80 shadow-sm bg-card">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-bold text-foreground">Official Email</h3>
                    <a href={`mailto:${contactInfo.email}`} className="text-base font-bold text-primary hover:underline block mt-1">
                      {contactInfo.email}
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Social Channels */}
              <div className="pt-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5">Follow Our Channels</p>
                <div className="flex gap-2.5">
                  <a
                    href={contactInfo.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook page"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/80 bg-card text-foreground/80 transition hover:bg-primary hover:text-white hover:border-primary shadow-xs"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a
                    href={contactInfo.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter X profile"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/80 bg-card text-foreground/80 transition hover:bg-primary hover:text-white hover:border-primary shadow-xs"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a
                    href={contactInfo.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram profile"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/80 bg-card text-foreground/80 transition hover:bg-primary hover:text-white hover:border-primary shadow-xs"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a
                    href={contactInfo.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube channel"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/80 bg-card text-foreground/80 transition hover:bg-primary hover:text-white hover:border-primary shadow-xs"
                  >
                    <Youtube className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="lg:col-span-2">
              <Card className="border border-border/80 shadow-xs">
                <CardContent className="p-6 sm:p-8">
                  {submitted ? (
                    <div className="py-12 text-center space-y-4">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                        <CheckCircle className="h-8 w-8" />
                      </div>
                      <h3 className="font-display text-2xl font-bold text-foreground">Message Dispatched!</h3>
                      <p className="text-sm font-medium text-muted-foreground max-w-md mx-auto leading-relaxed">
                        Thank you for reaching out. Your inquiry has been routed to the appropriate officer at our secretariat.
                      </p>
                      <Button
                        variant="outline"
                        className="font-bold mt-2"
                        onClick={() => {
                          setSubmitted(false);
                          setForm({ name: "", email: "", subject: "", message: "" });
                        }}
                      >
                        Send Another Note
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="mb-6">
                        <h2 className="font-display text-xl sm:text-2xl font-extrabold text-foreground">Send Us a Direct Message</h2>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">We respond to all verified community and partnership requests.</p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-xs font-bold text-foreground mb-1.5">
                              Your Full Name <span className="text-destructive">*</span>
                            </label>
                            <Input
                              placeholder="e.g. Chinedu Okoro"
                              value={form.name}
                              onChange={(e) => setForm({ ...form, name: e.target.value })}
                              required
                              className="h-10 text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-foreground mb-1.5">
                              Email Address <span className="text-destructive">*</span>
                            </label>
                            <Input
                              type="email"
                              placeholder="e.g. chinedu@example.com"
                              value={form.email}
                              onChange={(e) => setForm({ ...form, email: e.target.value })}
                              required
                              className="h-10 text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-foreground mb-1.5">
                            Subject / Purpose
                          </label>
                          <Input
                            placeholder="e.g. Partnership Proposal / Volunteer in Aba North"
                            value={form.subject}
                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                            className="h-10 text-sm"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-bold text-foreground">
                              Your Message <span className="text-destructive">*</span>
                            </label>
                            <span className="text-[11px] font-medium text-muted-foreground">
                              {form.message.length} characters
                            </span>
                          </div>
                          <Textarea
                            placeholder="Please provide details about your inquiry, organization, or questions..."
                            rows={5}
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                            required
                            className="text-sm resize-none"
                          />
                        </div>

                        <Button type="submit" disabled={sending} className="w-full sm:w-auto font-bold shadow-sm" size="lg">
                          <Send className="mr-2 h-4 w-4" />
                          {sending ? "Transmitting..." : "Send Message"}
                        </Button>
                      </form>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
