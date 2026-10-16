import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Tag, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { usePortfolioItems } from "@/hooks/usePublicData";

const Portfolio = () => {
  const { data: itemsData, isLoading } = usePortfolioItems();
  const portfolioItems = itemsData ?? [];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const categories = ["All", ...Array.from(new Set(portfolioItems.map((p) => p.category)))];
  const filtered = selectedCategory === "All" ? portfolioItems : portfolioItems.filter((p) => p.category === selectedCategory);

  const currentLightboxIndex = filtered.findIndex((p) => p.id === lightbox);
  const lightboxItem = currentLightboxIndex >= 0 ? filtered[currentLightboxIndex] : null;

  const handleNext = useCallback(() => {
    if (filtered.length === 0) return;
    const nextIdx = (currentLightboxIndex + 1) % filtered.length;
    setLightbox(filtered[nextIdx].id);
  }, [currentLightboxIndex, filtered]);

  const handlePrev = useCallback(() => {
    if (filtered.length === 0) return;
    const prevIdx = (currentLightboxIndex - 1 + filtered.length) % filtered.length;
    setLightbox(filtered[prevIdx].id);
  }, [currentLightboxIndex, filtered]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightbox) return;
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox, handleNext, handlePrev]);

  return (
    <Layout>
      <section className="bg-primary py-16 sm:py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-secondary/85" />
        <div className="container relative text-center">
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl md:text-5xl">Our Impact Portfolio</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-white/90">
            A visual chronicle of our programs, community outreach, rallies, and student support across Abia State.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          {/* Categories */}
          <div className="mb-8 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground mr-1 flex items-center gap-1">
              <Tag className="h-3 w-3" /> Category:
            </span>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "secondary" : "outline"}
                size="sm"
                className={`rounded-full text-xs font-semibold h-8 px-3.5 ${
                  selectedCategory === cat ? "font-bold shadow-xs" : "border-border/80"
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <div className="py-24 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-3" />
              <p className="text-muted-foreground font-medium text-sm">Loading gallery...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3.5 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="group relative cursor-pointer overflow-hidden rounded-xl aspect-square border border-border/80 shadow-xs bg-muted"
                  onClick={() => setLightbox(item.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`View ${item.title}`}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setLightbox(item.id); }}
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-secondary text-white text-xs font-bold px-2.5 py-0.5">
                        {item.category}
                      </Badge>
                      <ZoomIn className="h-5 w-5 text-white/90" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white leading-snug">{item.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal with Keyboard Navigation */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-h-[90vh] max-w-2xl w-full overflow-hidden rounded-2xl bg-card border border-border shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setLightbox(null)}
                className="absolute right-3.5 top-3.5 z-20 rounded-full bg-slate-950/60 p-2 text-white transition hover:bg-slate-950/80 active:scale-95 border border-white/20"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Prev / Next Buttons */}
              {filtered.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/60 text-white transition hover:bg-slate-950/80 active:scale-95 border border-white/20"
                    aria-label="Previous item"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/60 text-white transition hover:bg-slate-950/80 active:scale-95 border border-white/20"
                    aria-label="Next item"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Image Container */}
              <div className="h-64 sm:h-96 overflow-hidden bg-slate-950 relative">
                <img
                  src={lightboxItem.image_url}
                  alt={lightboxItem.title}
                  className="h-full w-full object-contain"
                />
                <div className="absolute bottom-3 left-4 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-white border border-white/10">
                  {currentLightboxIndex + 1} of {filtered.length}
                </div>
              </div>

              {/* Details */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-2.5">
                  <Badge variant="secondary" className="font-bold text-xs px-3 py-1">
                    {lightboxItem.category}
                  </Badge>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground mb-3 leading-snug">
                  {lightboxItem.title}
                </h2>
                <p className="text-base sm:text-lg font-normal text-foreground/85 leading-relaxed">
                  {lightboxItem.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Portfolio;
