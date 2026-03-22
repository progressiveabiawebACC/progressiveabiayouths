import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MapPin, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { useEvents } from "@/hooks/usePublicData";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: events, isLoading } = useEvents();
  const event = events?.find((e) => e.id === id);

  if (isLoading) {
    return (
      <Layout>
        <section className="py-20">
          <div className="container text-center">
            <p className="text-muted-foreground font-medium">Loading event...</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <section className="py-20">
          <div className="container text-center">
            <h1 className="font-display text-2xl font-bold text-foreground mb-4">Event Not Found</h1>
            <p className="text-muted-foreground font-medium mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <Link to="/events">
              <Button><ArrowLeft className="mr-2 h-4 w-4" /> Back to Events</Button>
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  const isPast = event.date < new Date().toISOString().split("T")[0];

  return (
    <Layout>
      <section className="bg-primary py-16 sm:py-20">
        <div className="container">
          <Link to="/events" className="inline-flex items-center gap-2 text-white/80 hover:text-white font-semibold text-sm mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Events
          </Link>
          <h1 className="font-display text-2xl font-extrabold text-white sm:text-3xl md:text-4xl max-w-3xl">{event.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Badge variant={isPast ? "outline" : "secondary"} className="font-bold text-white border-white/30">
              {isPast ? "Past Event" : "Upcoming"}
            </Badge>
            <Badge variant="outline" className="font-bold text-white border-white/30">{event.category}</Badge>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-8 overflow-hidden rounded-lg">
                <img src={event.image_url} alt={event.title} className="w-full h-64 sm:h-96 object-cover" />
              </div>
              <h2 className="font-display text-xl font-bold text-foreground mb-4">About This Event</h2>
              <p className="text-base font-medium text-muted-foreground leading-relaxed whitespace-pre-wrap">{event.description}</p>
            </div>
            <aside>
              <div className="rounded-lg border border-border p-6 space-y-5 sticky top-24">
                <h3 className="font-display text-base font-extrabold text-foreground">Event Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-foreground">Date</p>
                      <p className="text-sm font-medium text-muted-foreground">{new Date(event.date).toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-foreground">Time</p>
                      <p className="text-sm font-medium text-muted-foreground">{event.time}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-foreground">Location</p>
                      <p className="text-sm font-medium text-muted-foreground">{event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Tag className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-foreground">Category</p>
                      <p className="text-sm font-medium text-muted-foreground">{event.category}</p>
                    </div>
                  </div>
                </div>
                {!isPast && (
                  <Link to="/register">
                    <Button className="w-full font-bold mt-2">Register to Attend</Button>
                  </Link>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EventDetail;
