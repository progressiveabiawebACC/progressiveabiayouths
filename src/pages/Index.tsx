import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import CoreValueIcon from "@/components/CoreValueIcon";
import { coreValues, founder, contactInfo } from "@/data/siteData";
import { useHeroSlides, useEvents, useBlogPosts, usePortfolioItems, usePartners, useSiteStats } from "@/hooks/usePublicData";

const HeroSlider = () => {
  const { data: slides } = useHeroSlides();
  const [current, setCurrent] = useState(0);
  const heroSlides = slides ?? [];

  useEffect(() => {
    if (heroSlides.length === 0) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % heroSlides.length), 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  if (heroSlides.length === 0) return <section className="h-[80vh] min-h-[500px] bg-primary flex items-center justify-center"><p className="text-white font-bold text-xl">Loading...</p></section>;

  const prev = () => setCurrent((c) => (c - 1 + heroSlides.length) % heroSlides.length);
  const next = () => setCurrent((c) => (c + 1) % heroSlides.length);
  const slide = heroSlides[current];

  return (
    <section className="relative h-[80vh] min-h-[500px] overflow-hidden bg-foreground">
      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0 flex items-center">
          <img src={slide.image_url} alt={slide.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-foreground/65" />
          <div className="container relative z-10">
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="max-w-2xl">
              <h1 className="mb-4 font-display text-3xl font-extrabold leading-[1.1] text-white sm:text-4xl md:text-5xl lg:text-6xl" style={{ textWrap: "balance" }}>
                {slide.title}
              </h1>
              <p className="mb-8 text-base font-medium text-white/90 sm:text-lg md:text-xl">{slide.subtitle}</p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-secondary text-white font-bold hover:bg-secondary/90">
                  <Link to={slide.cta1_link}>{slide.cta1_label}</Link>
                </Button>
                <Button asChild size="lg" className="bg-white text-foreground font-bold hover:bg-white/90">
                  <Link to={slide.cta2_link}>{slide.cta2_label}</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
      <button onClick={prev} className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/15 p-2 text-white backdrop-blur transition hover:bg-white/25 active:scale-95"><ChevronLeft className="h-5 w-5" /></button>
      <button onClick={next} className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/15 p-2 text-white backdrop-blur transition hover:bg-white/25 active:scale-95"><ChevronRight className="h-5 w-5" /></button>
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {heroSlides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`h-2 rounded-full transition-all ${i === current ? "w-8 bg-white" : "w-2 bg-white/40"}`} />
        ))}
      </div>
    </section>
  );
};

const Counter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
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
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <div ref={ref} className="text-3xl font-extrabold text-primary sm:text-4xl tabular-nums">{count.toLocaleString()}{suffix}</div>;
};

const fadeIn = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.2 }, transition: { duration: 0.6 } };

const Index = () => {
  const { data: statsData } = useSiteStats();
  const { data: eventsData } = useEvents();
  const { data: postsData } = useBlogPosts();
  const { data: portfolioData } = usePortfolioItems();
  const { data: partnersData } = usePartners();
  const [partnersIndex, setPartnersIndex] = useState(0);
  const partnersRef = useRef<HTMLDivElement>(null);
  const [partnersPerPage, setPartnersPerPage] = useState(4);

  const stats = statsData ?? [];
  const events = eventsData ?? [];
  const blogPosts = postsData ?? [];
  const portfolioItems = portfolioData ?? [];
  const partnersList = partnersData ?? [];

  useEffect(() => {
    const updatePerPage = () => {
      const w = window.innerWidth;
      setPartnersPerPage(w < 640 ? 2 : w < 1024 ? 3 : 4);
    };
    updatePerPage();
    window.addEventListener("resize", updatePerPage);
    return () => window.removeEventListener("resize", updatePerPage);
  }, []);

  return (
    <Layout>
      <HeroSlider />

      {/* About Summary */}
      <motion.section {...fadeIn} className="py-16 sm:py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 font-display text-2xl font-extrabold text-foreground sm:text-3xl">About Progressive Abia Youths</h2>
            <p className="mb-10 text-base font-medium text-muted-foreground leading-relaxed">
              Progressive Abia Youths (PAY) is a youth-led advocacy organization committed to raising unconventional youths who will drive positive change, good governance, and sustainable development in Abia State, Nigeria.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((val) => (
              <Card key={val.name} className="border-border/50 transition-shadow hover:shadow-md">
                <CardContent className="flex items-start gap-3 p-5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <CoreValueIcon icon={val.icon} className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-sans text-sm font-bold text-foreground">{val.name}</h3>
                    <p className="text-xs font-medium text-muted-foreground">{val.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline" className="font-bold">
              <Link to="/about">Learn More About Us <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Stats */}
      {stats.length > 0 && (
        <motion.section {...fadeIn} className="border-y bg-muted/50 py-14">
          <div className="container">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.id} className="text-center">
                  <Counter value={stat.value} suffix={stat.suffix} />
                  <p className="mt-1 text-sm font-bold text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Founder */}
      <motion.section {...fadeIn} className="py-16 sm:py-20">
        <div className="container">
          <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12">
            <img src={founder.image} alt={founder.name} className="h-48 w-48 shrink-0 rounded-full object-cover shadow-lg" />
            <div>
              <p className="mb-1 text-sm font-bold uppercase tracking-wider text-secondary">Meet the Founder</p>
              <h2 className="mb-2 font-display text-2xl font-extrabold text-foreground sm:text-3xl">{founder.name}</h2>
              <p className="mb-1 text-sm font-bold text-primary">{founder.title}</p>
              <p className="text-base font-medium text-muted-foreground leading-relaxed">{founder.bio}</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Events Highlights */}
      {events.length > 0 && (
        <motion.section {...fadeIn} className="bg-muted/30 py-16 sm:py-20">
          <div className="container">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="mb-1 text-sm font-bold uppercase tracking-wider text-secondary">What&apos;s Happening</p>
                <h2 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">Upcoming Events</h2>
              </div>
              <Button asChild variant="ghost" className="hidden font-bold sm:inline-flex">
                <Link to="/events">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.slice(0, 3).map((event) => (
                <Card key={event.id} className="overflow-hidden transition-shadow hover:shadow-md">
                  <div className="h-40 overflow-hidden">
                    <img src={event.image_url} alt={event.title} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
                  </div>
                  <CardContent className="p-5">
                    <span className="mb-2 inline-block rounded-full bg-secondary/10 px-2.5 py-0.5 text-xs font-bold text-secondary">{event.category}</span>
                    <h3 className="mb-1 font-sans text-base font-bold text-foreground line-clamp-2">{event.title}</h3>
                    <p className="mb-3 text-xs font-medium text-muted-foreground line-clamp-2">{event.description}</p>
                    <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                      <span>{new Date(event.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</span>
                      <span>•</span>
                      <span>{event.location.split(",")[0]}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-6 text-center sm:hidden">
              <Button asChild variant="outline" className="font-bold"><Link to="/events">View All Events</Link></Button>
            </div>
          </div>
        </motion.section>
      )}

      {/* Blog Highlights */}
      {blogPosts.length > 0 && (
        <motion.section {...fadeIn} className="py-16 sm:py-20">
          <div className="container">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="mb-1 text-sm font-bold uppercase tracking-wider text-secondary">From Our Blog</p>
                <h2 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">Latest Articles</h2>
              </div>
              <Button asChild variant="ghost" className="hidden font-bold sm:inline-flex">
                <Link to="/blog">Read More <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogPosts.slice(0, 3).map((post) => (
                <Card key={post.id} className="overflow-hidden transition-shadow hover:shadow-md">
                  <div className="h-40 overflow-hidden">
                    <img src={post.image_url} alt={post.title} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
                  </div>
                  <CardContent className="p-5">
                    <span className="mb-2 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">{post.category}</span>
                    <h3 className="mb-1 font-sans text-base font-bold text-foreground line-clamp-2">{post.title}</h3>
                    <p className="mb-3 text-xs font-medium text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                      <span>{new Date(post.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</span>
                      <span>{post.read_time}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Gallery/Projects Teaser */}
      {portfolioItems.length > 0 && (
        <motion.section {...fadeIn} className="bg-muted/30 py-16 sm:py-20">
          <div className="container">
            <div className="mb-10 text-center">
              <p className="mb-1 text-sm font-bold uppercase tracking-wider text-secondary">Our Work</p>
              <h2 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">Recent Projects</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {portfolioItems.slice(0, 4).map((item) => (
                <div key={item.id} className="group relative overflow-hidden rounded-lg aspect-square">
                  <img src={item.image_url} alt={item.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-foreground/80 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    <p className="text-xs font-medium text-white/80">{item.category}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button asChild variant="outline" className="font-bold"><Link to="/portfolio">View Full Portfolio <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
            </div>
          </div>
        </motion.section>
      )}

      {/* Partners */}
      {partnersList.length > 0 && (
        <motion.section {...fadeIn} className="py-14">
          <div className="container">
            <h2 className="mb-8 text-center font-display text-xl font-extrabold text-foreground sm:text-2xl">Our Partners</h2>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {partnersList.map((partner) => (
                <div key={partner.id} className="flex h-20 w-36 items-center justify-center rounded-lg bg-white p-3 shadow-sm border border-border/30">
                  <img src={partner.logo_url} alt={partner.name} className="max-h-full max-w-full object-contain" />
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Final CTA */}
      <section className="bg-primary py-16 sm:py-20">
        <div className="container text-center">
          <h2 className="mb-4 font-display text-2xl font-extrabold text-white sm:text-3xl md:text-4xl" style={{ textWrap: "balance" }}>Take Responsibility</h2>
          <p className="mx-auto mb-8 max-w-xl text-base font-medium text-white/90">
            Be an agent of progressive change. Join Progressive Abia Youths and help us build a brighter future for Abia State.
          </p>
          <Button asChild size="lg" className="bg-white text-primary font-bold hover:bg-white/90">
            <Link to="/register">Join Us Today <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
