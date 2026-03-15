import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Users, Globe, MapPin, FolderOpen, Calendar, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import {
  heroSlides,
  coreValues,
  stats,
  founder,
  partners,
  events,
  blogPosts,
  portfolioItems,
} from "@/data/siteData";

// ===== HERO SLIDER =====
const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % heroSlides.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + heroSlides.length) % heroSlides.length);
  const next = () => setCurrent((c) => (c + 1) % heroSlides.length);

  return (
    <section className="relative h-[80vh] min-h-[500px] overflow-hidden bg-primary">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 flex items-center"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
          <div className="container relative z-10">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="max-w-2xl"
            >
              <h1 className="mb-4 font-display text-3xl font-bold leading-tight text-primary-foreground sm:text-4xl md:text-5xl lg:text-6xl">
                {heroSlides[current].title}
              </h1>
              <p className="mb-8 text-base text-primary-foreground/85 sm:text-lg md:text-xl">
                {heroSlides[current].subtitle}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" variant="secondary" className="font-semibold">
                  <Link to={heroSlides[current].cta1.link}>{heroSlides[current].cta1.label}</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold">
                  <Link to={heroSlides[current].cta2.link}>{heroSlides[current].cta2.label}</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button onClick={prev} className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-primary-foreground/10 p-2 text-primary-foreground backdrop-blur transition hover:bg-primary-foreground/20">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-primary-foreground/10 p-2 text-primary-foreground backdrop-blur transition hover:bg-primary-foreground/20">
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {heroSlides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`h-2 rounded-full transition-all ${i === current ? "w-8 bg-primary-foreground" : "w-2 bg-primary-foreground/40"}`} />
        ))}
      </div>
    </section>
  );
};

// ===== COUNTER =====
const Counter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            setCount(Math.floor(progress * value));
            if (progress < 1) requestAnimationFrame(tick);
          };
          tick();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-3xl font-bold text-primary sm:text-4xl">
      {count.toLocaleString()}{suffix}
    </div>
  );
};

// ===== MAIN PAGE =====
const Index = () => {
  return (
    <Layout>
      <HeroSlider />

      {/* About Summary */}
      <section className="py-16 sm:py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 font-display text-2xl font-bold text-foreground sm:text-3xl">
              About Progressive Abia Youths
            </h2>
            <p className="mb-10 text-muted-foreground leading-relaxed">
              Progressive Abia Youths (PAY) is a youth-led advocacy organization committed to raising unconventional youths who will drive positive change, good governance, and sustainable development in Abia State, Nigeria.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((val) => (
              <Card key={val.name} className="border-border/50 transition-shadow hover:shadow-md">
                <CardContent className="flex items-start gap-3 p-5">
                  <span className="text-2xl">{val.icon}</span>
                  <div>
                    <h3 className="font-sans text-sm font-semibold text-foreground">{val.name}</h3>
                    <p className="text-xs text-muted-foreground">{val.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link to="/about">Learn More About Us <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/50 py-14">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <Counter value={stat.value} suffix={stat.suffix} />
                <p className="mt-1 text-sm font-medium text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-16 sm:py-20">
        <div className="container">
          <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12">
            <div className="flex h-48 w-48 shrink-0 items-center justify-center rounded-full bg-muted">
              <Users className="h-20 w-20 text-muted-foreground/40" />
            </div>
            <div>
              <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-secondary">Meet the Founder</p>
              <h2 className="mb-2 font-display text-2xl font-bold text-foreground sm:text-3xl">{founder.name}</h2>
              <p className="mb-1 text-sm font-medium text-primary">{founder.title}</p>
              <p className="text-muted-foreground leading-relaxed">{founder.bio}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Events Highlights */}
      <section className="bg-muted/30 py-16 sm:py-20">
        <div className="container">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-secondary">What&apos;s Happening</p>
              <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">Upcoming Events</h2>
            </div>
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link to="/events">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.slice(0, 3).map((event) => (
              <Card key={event.id} className="overflow-hidden transition-shadow hover:shadow-md">
                <div className="h-40 bg-muted flex items-center justify-center">
                  <Calendar className="h-12 w-12 text-muted-foreground/30" />
                </div>
                <CardContent className="p-5">
                  <span className="mb-2 inline-block rounded-full bg-secondary/10 px-2.5 py-0.5 text-xs font-medium text-secondary">{event.category}</span>
                  <h3 className="mb-1 font-sans text-base font-semibold text-foreground line-clamp-2">{event.title}</h3>
                  <p className="mb-3 text-xs text-muted-foreground line-clamp-2">{event.description}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{new Date(event.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</span>
                    <span>•</span>
                    <span>{event.location.split(",")[0]}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Button asChild variant="outline">
              <Link to="/events">View All Events</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Blog Highlights */}
      <section className="py-16 sm:py-20">
        <div className="container">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-secondary">From Our Blog</p>
              <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">Latest Articles</h2>
            </div>
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link to="/blog">Read More <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.slice(0, 3).map((post) => (
              <Card key={post.id} className="overflow-hidden transition-shadow hover:shadow-md">
                <div className="h-40 bg-muted flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground/30" />
                </div>
                <CardContent className="p-5">
                  <span className="mb-2 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{post.category}</span>
                  <h3 className="mb-1 font-sans text-base font-semibold text-foreground line-clamp-2">{post.title}</h3>
                  <p className="mb-3 text-xs text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{new Date(post.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</span>
                    <span>{post.readTime}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery/Projects Teaser */}
      <section className="bg-muted/30 py-16 sm:py-20">
        <div className="container">
          <div className="mb-10 text-center">
            <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-secondary">Our Work</p>
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">Recent Projects</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {portfolioItems.slice(0, 4).map((item) => (
              <div key={item.id} className="group relative overflow-hidden rounded-lg bg-muted aspect-square flex items-center justify-center">
                <FolderOpen className="h-10 w-10 text-muted-foreground/30" />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-foreground/70 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <h3 className="text-sm font-semibold text-primary-foreground">{item.title}</h3>
                  <p className="text-xs text-primary-foreground/80">{item.category}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link to="/portfolio">View Full Portfolio <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-14">
        <div className="container">
          <h2 className="mb-8 text-center font-display text-xl font-bold text-foreground sm:text-2xl">Our Partners</h2>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {partners.map((partner) => (
              <div key={partner.name} className="flex h-16 w-32 items-center justify-center rounded-md bg-muted p-3">
                <span className="text-xs text-muted-foreground">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-secondary py-16 sm:py-20">
        <div className="container text-center">
          <h2 className="mb-4 font-display text-2xl font-bold text-secondary-foreground sm:text-3xl md:text-4xl">
            Take Responsibility
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-secondary-foreground/90">
            Be an agent of progressive change. Join Progressive Abia Youths and help us build a brighter future for Abia State.
          </p>
          <Button asChild size="lg" variant="outline" className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10 font-semibold">
            <Link to="/register">Join Us Today <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
