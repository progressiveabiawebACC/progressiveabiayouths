import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Search, X, ArrowRight, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { useEvents } from "@/hooks/usePublicData";

const Events = () => {
  const { data: eventsData, isLoading } = useEvents();
  const events = eventsData ?? [];
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const now = new Date().toISOString().split("T")[0];

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(events.map((e) => e.category)))];
  }, [events]);

  const filtered = useMemo(() => {
    let result = events;
    if (selectedCategory !== "All") result = result.filter((e) => e.category === selectedCategory);
    if (tab === "upcoming") result = result.filter((e) => e.date >= now);
    else result = result.filter((e) => e.date < now);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => (tab === "upcoming" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)));
  }, [events, selectedCategory, tab, now, search]);

  const resetFilters = () => {
    setSelectedCategory("All");
    setSearch("");
    setTab("upcoming");
  };

  return (
    <Layout>
      <section className="bg-primary py-16 sm:py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-secondary/80" />
        <div className="container relative text-center">
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl md:text-5xl">Events & Rallies</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-white/90">
            Join our civic sensitization campaigns, educational initiatives, and grassroots youth gatherings across Abia State.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          {/* Controls Bar */}
          <div className="mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Tabs & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex rounded-lg border border-border p-1 bg-muted/40">
                <Button
                  variant={tab === "upcoming" ? "default" : "ghost"}
                  size="sm"
                  className="font-bold text-xs"
                  onClick={() => setTab("upcoming")}
                >
                  Upcoming
                </Button>
                <Button
                  variant={tab === "past" ? "default" : "ghost"}
                  size="sm"
                  className="font-bold text-xs"
                  onClick={() => setTab("past")}
                >
                  Past Events
                </Button>
              </div>

              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search events, city, topic..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-8 h-9 text-xs"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Status Count */}
            <div className="text-xs font-semibold text-muted-foreground hidden lg:block">
              Showing {filtered.length} {filtered.length === 1 ? "event" : "events"}
            </div>
          </div>

          {/* Category Pills */}
          <div className="mb-8 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground flex items-center gap-1 mr-1">
              <Tag className="h-3 w-3" /> Filter:
            </span>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "secondary" : "outline"}
                size="sm"
                className={`text-xs font-semibold rounded-full h-8 px-3.5 ${
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
              <p className="text-muted-foreground font-medium text-sm">Loading events schedule...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-16 text-center max-w-lg mx-auto p-6 bg-card">
              <Calendar className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
              <h3 className="font-display text-base font-bold text-foreground">No events found</h3>
              <p className="text-xs text-muted-foreground font-medium mt-1 mb-5">
                No {tab} events match your current filter criteria or search query.
              </p>
              <Button onClick={resetFilters} variant="outline" size="sm" className="font-bold">
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="h-full"
                >
                  <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/40 border border-border/80 flex flex-col h-full group bg-card">
                    <Link to={`/events/${event.id}`} className="block relative h-52 overflow-hidden bg-muted">
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3.5 left-3.5 flex gap-2">
                        <Badge className="bg-secondary text-white font-bold text-xs px-3 py-1 shadow-md">
                          {event.category}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3.5 right-3.5 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-md flex items-center gap-1.5 border border-white/10">
                        <Calendar className="h-3.5 w-3.5 text-secondary" />
                        {new Date(event.date).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                    </Link>

                    <CardContent className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <Link to={`/events/${event.id}`}>
                          <h2 className="mb-2.5 font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                            {event.title}
                          </h2>
                        </Link>
                        <p className="mb-4 text-sm sm:text-base font-normal text-foreground/80 line-clamp-2 leading-relaxed">
                          {event.description}
                        </p>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-border/70">
                        <div className="flex items-center gap-2.5 text-sm sm:text-base font-bold text-foreground/90">
                          <Clock className="h-4.5 w-4.5 text-secondary shrink-0" />
                          <span>Time: {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-sm font-semibold text-foreground/80">
                          <MapPin className="h-4.5 w-4.5 text-primary shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="pt-2">
                          <Button asChild className="w-full font-bold group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors" size="default">
                            <Link to={`/events/${event.id}`}>
                              {tab === "upcoming" ? "View Details & RSVP" : "View Event Recap"}
                              <ArrowRight className="ml-1.5 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Events;
