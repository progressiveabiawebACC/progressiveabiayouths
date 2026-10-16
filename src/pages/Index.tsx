import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import CoreValueIcon from "@/components/CoreValueIcon";
import { coreValues, founder, contactInfo } from "@/data/siteData";
import { useHeroSlides, useEvents, useBlogPosts, usePortfolioItems, usePartners, useSiteStats } from "@/hooks/usePublicData";

const HeroSlider = () => {
  const { data: slides } = useHeroSlides();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const heroSlides = slides ?? [];

  useEffect(() => {
    if (heroSlides.length === 0 || isPaused) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % heroSlides.length), 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length, isPaused]);

  if (heroSlides.length === 0) {
    return (
      <section className="h-[75vh] min-h-[480px] bg-primary/90 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
          <p className="text-white font-semibold text-lg">Loading experience...</p>
        </div>
      </section>
    );
  }

  const prev = () => setCurrent((c) => (c - 1 + heroSlides.length) % heroSlides.length);
  const next = () => setCurrent((c) => (c + 1) % heroSlides.length);
  const slide = heroSlides[current];

  return (
    <section
      className="relative h-[80vh] min-h-[520px] overflow-hidden bg-slate-950"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      aria-label="Featured Highlights Carousel"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 flex items-center"
        >
          <img
            src={slide.image_url}
            alt={slide.title}
            className="absolute inset-0 h-full w-full object-cover scale-105 transition-transform duration-10000"
          />
          {/* Multi-stop protective scrim ensures >10:1 contrast everywhere */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/65 to-slate-950/40" />

          <div className="container relative z-10 py-12">
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md mb-4">
                Abia Youth Movement
              </div>
              <h1
                className="mb-4 font-display text-3xl font-extrabold leading-[1.15] text-white sm:text-4xl md:text-5xl lg:text-6xl drop-shadow-sm"
                style={{ textWrap: "balance" }}
              >
                {slide.title}
              </h1>
              <p className="mb-8 text-base font-medium text-slate-100 sm:text-lg md:text-xl leading-relaxed max-w-xl">
                {slide.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button asChild size="lg" className="w-full sm:w-auto bg-secondary text-white font-bold hover:bg-secondary/90 shadow-md">
                  <Link to={slide.cta1_link}>{slide.cta1_label}</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto bg-white/95 text-slate-900 font-bold hover:bg-white shadow-md border border-white/20 transition-all hover:scale-102"
                >
                  <Link to={slide.cta2_link}>{slide.cta2_label}</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next controls with mobile-friendly positioning */}
      <button
        onClick={prev}
        className="absolute left-2 sm:left-4 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60 active:scale-95 border border-white/10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 sm:right-4 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60 active:scale-95 border border-white/10"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2.5 p-2 bg-black/30 backdrop-blur-sm rounded-full">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2.5 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
              i === current ? "w-8 bg-white" : "w-2.5 bg-white/40 hover:bg-white/70"
            }`}
          />
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
      <motion.section {...fadeIn} className="py-20 sm:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary mb-4">
              Our Identity
            </div>
            <h2 className="mb-5 font-display text-3xl font-extrabold text-foreground sm:text-4xl md:text-5xl">
              About Progressive Abia Youths
            </h2>
            <p className="mb-12 text-lg sm:text-xl font-normal text-foreground/85 leading-relaxed max-w-2xl mx-auto">
              Progressive Abia Youths (PAY) is a youth-led advocacy movement committed to raising <span className="font-serif-italic font-semibold text-primary">unconventional leaders</span> who will drive good governance, policy reform, and sustainable progress across Abia State.
            </p>
          </div>
          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((val) => (
              <Card key={val.name} className="border-border/80 transition-all hover:shadow-md bg-card">
                <CardContent className="flex flex-col items-start gap-3.5 p-5 sm:p-6 text-left">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <CoreValueIcon icon={val.icon} className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg sm:text-xl font-bold text-foreground mb-1.5">{val.name}</h3>
                    <p className="text-sm sm:text-base font-normal text-foreground/80 leading-relaxed">{val.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild size="lg" variant="outline" className="font-bold border-primary/30 text-foreground hover:bg-primary hover:text-white w-full sm:w-auto">
              <Link to="/about">Learn More About Our Mission <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Stats */}
      {stats.length > 0 && (
        <motion.section {...fadeIn} className="border-y bg-muted/40 py-12 sm:py-16">
          <div className="container">
            <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.id} className="text-center">
                  <Counter value={stat.value} suffix={stat.suffix} />
                  <p className="mt-2 text-xs sm:text-base font-bold text-foreground/85 uppercase tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Founder */}
      <motion.section {...fadeIn} className="py-16 sm:py-24">
        <div className="container">
          <div className="flex flex-col items-center gap-6 sm:gap-8 md:flex-row md:gap-14 max-w-5xl mx-auto">
            <img
              src={founder.image}
              alt={founder.name}
              className="h-44 w-44 sm:h-56 sm:w-56 shrink-0 rounded-2xl object-cover shadow-xl border-2 border-primary/20 mx-auto md:mx-0"
            />
            <div className="text-center md:text-left">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-secondary">Leadership</p>
              <h2 className="mb-2 font-display text-2xl sm:text-3xl font-extrabold text-foreground md:text-4xl">{founder.name}</h2>
              <p className="mb-4 text-sm sm:text-base md:text-lg font-bold text-primary">{founder.title}</p>
              <p className="text-base sm:text-lg md:text-xl font-normal text-foreground/85 leading-relaxed">{founder.bio}</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Events Highlights */}
      {events.length > 0 && (
        <motion.section {...fadeIn} className="bg-muted/30 py-20 sm:py-24">
          <div className="container">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-secondary">Statewide Engagements</p>
                <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">Upcoming Events</h2>
              </div>
              <Button asChild variant="ghost" size="lg" className="hidden font-bold sm:inline-flex text-base">
                <Link to="/events">View All Events <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.slice(0, 3).map((event) => (
                <Card key={event.id} className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/40 border border-border/80 group flex flex-col justify-between bg-card">
                  <div>
                    <Link to={`/events/${event.id}`} className="block h-52 overflow-hidden relative">
                      <img src={event.image_url} alt={event.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <span className="absolute top-3.5 left-3.5 rounded-full bg-secondary text-white font-bold px-3 py-1 text-xs shadow-md">{event.category}</span>
                    </Link>
                    <CardContent className="p-6">
                      {/* Bold Event Date & Time */}
                      <div className="flex flex-wrap items-center gap-3 mb-3 text-xs sm:text-sm font-bold text-foreground/85">
                        <span className="flex items-center gap-1.5 text-primary">
                          <Calendar className="h-4 w-4 shrink-0" />
                          {new Date(event.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-secondary">
                          <Clock className="h-4 w-4 shrink-0" />
                          {event.time}
                        </span>
                      </div>
                      <Link to={`/events/${event.id}`}>
                        <h3 className="mb-2 font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {event.title}
                        </h3>
                      </Link>
                      <p className="text-sm sm:text-base font-normal text-foreground/80 line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>
                    </CardContent>
                  </div>
                  <div className="px-6 pb-6 pt-3 border-t border-border/60 flex items-center justify-between text-sm font-semibold text-foreground/80">
                    <span className="flex items-center gap-1.5 truncate max-w-[180px]">
                      <MapPin className="h-4 w-4 text-primary shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </span>
                    <Link to={`/events/${event.id}`} className="font-bold text-primary hover:underline shrink-0">
                      View RSVP →
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Button asChild size="lg" variant="outline" className="font-bold w-full"><Link to="/events">View All Events</Link></Button>
            </div>
          </div>
        </motion.section>
      )}

      {/* Blog Highlights */}
      {blogPosts.length > 0 && (
        <motion.section {...fadeIn} className="py-20 sm:py-24">
          <div className="container">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-secondary">Editorial & Policy</p>
                <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">Latest Articles</h2>
              </div>
              <Button asChild variant="ghost" size="lg" className="hidden font-bold sm:inline-flex text-base">
                <Link to="/blog">All Articles <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogPosts.slice(0, 3).map((post) => (
                <Card key={post.id} className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/40 border border-border/80 group flex flex-col justify-between bg-card">
                  <div>
                    <Link to={`/blog/${post.id}`} className="block h-52 overflow-hidden relative">
                      <img src={post.image_url} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <span className="absolute top-3.5 left-3.5 rounded-full bg-primary text-white font-bold px-3 py-1 text-xs shadow-md">{post.category}</span>
                    </Link>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3 text-xs sm:text-sm font-bold text-foreground/80">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-primary shrink-0" />
                          {new Date(post.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-secondary">
                          <Clock className="h-4 w-4 shrink-0" />
                          {post.read_time}
                        </span>
                      </div>
                      <Link to={`/blog/${post.id}`}>
                        <h3 className="mb-2 font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-sm sm:text-base font-normal text-foreground/80 line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </CardContent>
                  </div>
                  <div className="px-6 pb-6 pt-3 border-t border-border/60 flex items-center justify-between text-sm font-semibold text-foreground/80">
                    <span className="truncate max-w-[170px]">{post.author}</span>
                    <Link to={`/blog/${post.id}`} className="font-bold text-primary hover:underline shrink-0">
                      Read Article →
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Gallery/Projects Teaser */}
      {portfolioItems.length > 0 && (
        <motion.section {...fadeIn} className="bg-muted/30 py-20 sm:py-24">
          <div className="container">
            <div className="mb-12 text-center">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-secondary">Our Track Record</p>
              <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">Recent Projects</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {portfolioItems.slice(0, 4).map((item) => (
                <div key={item.id} className="group relative overflow-hidden rounded-xl aspect-square shadow-sm">
                  <img src={item.image_url} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">{item.category}</span>
                    <h3 className="text-base font-bold text-white leading-tight">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button asChild size="lg" variant="outline" className="font-bold border-primary/30"><Link to="/portfolio">View Full Portfolio <ArrowRight className="ml-1.5 h-4 w-4" /></Link></Button>
            </div>
          </div>
        </motion.section>
      )}

      {/* Partners Slider */}
      {partnersList.length > 0 && (
        <motion.section {...fadeIn} className="py-14 overflow-hidden">
          <div className="container">
            <h2 className="mb-8 text-center font-display text-xl font-extrabold text-foreground sm:text-2xl">Our Partners</h2>
            <div className="relative">
              <div className="overflow-hidden" ref={partnersRef}>
                <motion.div
                  className="flex"
                  animate={{ x: `-${partnersIndex * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  {Array.from({ length: Math.ceil(partnersList.length / partnersPerPage) }).map((_, pageIdx) => (
                    <div key={pageIdx} className="flex min-w-full items-center justify-center gap-6 px-2">
                      {partnersList.slice(pageIdx * partnersPerPage, (pageIdx + 1) * partnersPerPage).map((partner) => (
                        <a
                          key={partner.id}
                          href={partner.website_url || "#"}
                          target={partner.website_url ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="flex h-20 w-28 sm:w-36 shrink-0 items-center justify-center rounded-lg bg-card/90 dark:bg-card p-3 shadow-xs border border-border/70 transition-all hover:border-primary/50 hover:shadow-md"
                        >
                          <img src={partner.logo_url} alt={partner.name} className="max-h-full max-w-full object-contain filter dark:brightness-105" />
                        </a>
                      ))}
                    </div>
                  ))}
                </motion.div>
              </div>
              {Math.ceil(partnersList.length / partnersPerPage) > 1 && (
                <>
                  <button onClick={() => setPartnersIndex((i) => Math.max(0, i - 1))} disabled={partnersIndex === 0} className="absolute -left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-primary/10 p-2 text-primary transition hover:bg-primary/20 disabled:opacity-30">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={() => setPartnersIndex((i) => Math.min(Math.ceil(partnersList.length / partnersPerPage) - 1, i + 1))} disabled={partnersIndex >= Math.ceil(partnersList.length / partnersPerPage) - 1} className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-primary/10 p-2 text-primary transition hover:bg-primary/20 disabled:opacity-30">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
              {Math.ceil(partnersList.length / partnersPerPage) > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                  {Array.from({ length: Math.ceil(partnersList.length / partnersPerPage) }).map((_, i) => (
                    <button key={i} onClick={() => setPartnersIndex(i)} className={`h-2 rounded-full transition-all ${i === partnersIndex ? "w-6 bg-primary" : "w-2 bg-primary/30"}`} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.section>
      )}

      {/* Final CTA */}
      <section className="bg-primary py-16 sm:py-20 text-white">
        <div className="container text-center">
          <h2 className="mb-4 font-display text-2xl font-extrabold text-white sm:text-3xl md:text-4xl" style={{ textWrap: "balance" }}>Take Responsibility</h2>
          <p className="mx-auto mb-8 max-w-xl text-base font-medium text-white/90 leading-relaxed">
            Be an agent of progressive change. Join Progressive Abia Youths and help us build a brighter future for Abia State.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-white text-slate-950 font-extrabold hover:bg-slate-100 shadow-lg transition-transform active:scale-95">
              <Link to="/register">Join Us Today <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-slate-950 hover:border-white font-extrabold shadow-sm transition-all active:scale-95"
            >
              <Link to="/about">Learn Our Story</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
