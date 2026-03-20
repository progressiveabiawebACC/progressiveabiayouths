import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { portfolioItems } from "@/data/siteData";

const categories = ["All", ...Array.from(new Set(portfolioItems.map((p) => p.category)))];

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const filtered = selectedCategory === "All" ? portfolioItems : portfolioItems.filter((p) => p.category === selectedCategory);
  const lightboxItem = portfolioItems.find((p) => p.id === lightbox);

  return (
    <Layout>
      <section className="bg-primary py-16 sm:py-20">
        <div className="container text-center">
          <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">Portfolio</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-white/85">A gallery of our projects, events, and community impact across Abia State.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button key={cat} variant={selectedCategory === cat ? "secondary" : "ghost"} size="sm" className="font-semibold" onClick={() => setSelectedCategory(cat)}>
                {cat}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className="group relative cursor-pointer overflow-hidden rounded-lg aspect-square"
                onClick={() => setLightbox(item.id)}
              >
                <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-foreground/80 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  <p className="text-xs font-medium text-white/80">{item.category}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 p-4 backdrop-blur-sm"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-h-[80vh] max-w-2xl w-full overflow-hidden rounded-lg bg-card"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setLightbox(null)} className="absolute right-3 top-3 z-10 rounded-full bg-foreground/50 p-1.5 text-white transition hover:bg-foreground/70 active:scale-95">
                <X className="h-4 w-4" />
              </button>
              <div className="h-64 overflow-hidden sm:h-80">
                <img src={lightboxItem.image} alt={lightboxItem.title} className="h-full w-full object-cover" />
              </div>
              <div className="p-6">
                <span className="mb-2 inline-block rounded-full bg-secondary/10 px-2.5 py-0.5 text-xs font-bold text-secondary">{lightboxItem.category}</span>
                <h2 className="mb-2 font-display text-xl font-extrabold text-foreground">{lightboxItem.title}</h2>
                <p className="text-sm font-medium text-muted-foreground">{lightboxItem.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Portfolio;
