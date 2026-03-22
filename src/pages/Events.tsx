import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useEvents } from "@/hooks/usePublicData";

const categories = ["All", "Voter Sensitization", "Laptop Support", "Scholarships", "Press Conference", "Quiz Competition"];

const Events = () => {
  const { data: eventsData, isLoading } = useEvents();
  const events = eventsData ?? [];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const now = new Date().toISOString().split("T")[0];

  const filtered = useMemo(() => {
    let result = events;
    if (selectedCategory !== "All") result = result.filter((e) => e.category === selectedCategory);
    if (tab === "upcoming") result = result.filter((e) => e.date >= now);
    else result = result.filter((e) => e.date < now);
    return result.sort((a, b) => (tab === "upcoming" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)));
  }, [events, selectedCategory, tab, now]);

  return (
    <Layout>
      <section className="bg-primary py-16 sm:py-20">
        <div className="container text-center">
          <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">Events</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-white/85">Stay updated with our campaigns, workshops, and community engagements.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="mb-6 flex gap-2">
            <Button variant={tab === "upcoming" ? "default" : "outline"} size="sm" className="font-bold" onClick={() => setTab("upcoming")}>Upcoming</Button>
            <Button variant={tab === "past" ? "default" : "outline"} size="sm" className="font-bold" onClick={() => setTab("past")}>Past</Button>
          </div>
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button key={cat} variant={selectedCategory === cat ? "secondary" : "ghost"} size="sm" className="font-semibold" onClick={() => setSelectedCategory(cat)}>{cat}</Button>
            ))}
          </div>
          {isLoading ? (
            <p className="text-center text-muted-foreground font-medium py-20">Loading events...</p>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
              <p className="font-medium">No {tab} events found in this category.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((event, i) => (
                <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="overflow-hidden transition-shadow hover:shadow-md h-full">
                    <Link to={`/events/${event.id}`}>
                      <div className="h-40 overflow-hidden">
                        <img src={event.image_url} alt={event.title} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
                      </div>
                    </Link>
                    <CardContent className="p-5">
                      <span className="mb-2 inline-block rounded-full bg-secondary/10 px-2.5 py-0.5 text-xs font-bold text-secondary">{event.category}</span>
                      <Link to={`/events/${event.id}`}>
                        <h3 className="mb-2 font-sans text-base font-bold text-foreground hover:text-primary transition-colors">{event.title}</h3>
                      </Link>
                      <p className="mb-4 text-sm font-medium text-muted-foreground line-clamp-2">{event.description}</p>
                      <div className="space-y-1.5 text-xs font-medium text-muted-foreground">
                        <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" />{new Date(event.date).toLocaleDateString("en-NG", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</div>
                        <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" />{event.time}</div>
                        <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{event.location}</div>
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
