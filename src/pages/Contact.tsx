import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
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

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      toast({ title: "Message sent!", description: "We'll get back to you soon." });
      setForm({ name: "", email: "", subject: "", message: "" });
      setSending(false);
    }, 1000);
  };

  return (
    <Layout>
      <section className="bg-primary py-16 sm:py-20">
        <div className="container text-center">
          <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">Contact Us</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-white/85">
            Have a question or want to collaborate? Reach out to us.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-3">
            <motion.div {...fadeIn} className="space-y-4">
              <Card>
                <CardContent className="flex items-start gap-3 p-5">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h3 className="font-sans text-sm font-bold text-foreground">Address</h3>
                    <p className="text-sm font-medium text-muted-foreground">{contactInfo.address}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-start gap-3 p-5">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h3 className="font-sans text-sm font-bold text-foreground">Phone</h3>
                    <a href={`tel:${contactInfo.phone}`} className="text-sm font-medium text-muted-foreground hover:text-primary">{contactInfo.phone}</a>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-start gap-3 p-5">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h3 className="font-sans text-sm font-bold text-foreground">Email</h3>
                    <a href={`mailto:${contactInfo.email}`} className="text-sm font-medium text-muted-foreground hover:text-primary">{contactInfo.email}</a>
                  </div>
                </CardContent>
              </Card>
              <div className="flex gap-3 pt-2">
                <a href={contactInfo.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition hover:bg-primary/20"><Facebook className="h-4 w-4" /></a>
                <a href={contactInfo.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition hover:bg-primary/20"><Twitter className="h-4 w-4" /></a>
                <a href={contactInfo.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition hover:bg-primary/20"><Instagram className="h-4 w-4" /></a>
                <a href={contactInfo.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition hover:bg-primary/20"><Youtube className="h-4 w-4" /></a>
              </div>
            </motion.div>

            <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-6 font-display text-xl font-extrabold text-foreground">Send us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                      <Input type="email" placeholder="Your Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                    </div>
                    <Input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
                    <Textarea placeholder="Your Message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                    <Button type="submit" disabled={sending} className="w-full font-bold sm:w-auto">
                      <Send className="mr-2 h-4 w-4" /> {sending ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
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
