import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MapPin, Tag, Share2, Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { useEvents } from "@/hooks/usePublicData";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: events, isLoading } = useEvents();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const event = events?.find((e) => e.id === id);
  const otherEvents = events?.filter((e) => e.id !== id).slice(0, 3) ?? [];

  if (isLoading) {
    return (
      <Layout>
        <section className="py-24">
          <div className="container text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-3" />
            <p className="text-muted-foreground font-medium text-sm">Loading event details...</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <section className="py-24">
          <div className="container text-center max-w-md mx-auto">
            <h1 className="font-display text-2xl font-bold text-foreground mb-3">Event Not Found</h1>
            <p className="text-muted-foreground font-medium text-sm mb-6">
              The event you are looking for doesn't exist or has concluded.
            </p>
            <Button asChild>
              <Link to="/events">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Events
              </Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  const isPast = event.date < new Date().toISOString().split("T")[0];
  const pageUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    toast({ title: "Link copied to clipboard!", description: "Share it with your colleagues and friends." });
    setTimeout(() => setCopied(false), 2000);
  };

  // Google Calendar Link generator
  const startDate = event.date.replace(/-/g, "");
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    event.title
  )}&dates=${startDate}/${startDate}&details=${encodeURIComponent(
    event.description
  )}&location=${encodeURIComponent(event.location)}`;

  const whatsappShareText = encodeURIComponent(
    `Join Progressive Abia Youths at "${event.title}" on ${event.date} in ${event.location}. View details here: ${pageUrl}`
  );

  return (
    <Layout>
      <section className="bg-primary py-16 sm:py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-secondary/85" />
        <div className="container relative">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white font-semibold text-xs sm:text-sm mb-5 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to All Events
          </Link>
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <Badge variant={isPast ? "outline" : "secondary"} className="font-bold text-white border-white/30 text-xs">
              {isPast ? "Past Event" : "Upcoming"}
            </Badge>
            <Badge variant="outline" className="font-bold text-white border-white/30 text-xs">
              {event.category}
            </Badge>
          </div>
          <h1 className="font-display text-2xl font-extrabold text-white sm:text-3xl md:text-4xl max-w-3xl leading-tight">
            {event.title}
          </h1>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="overflow-hidden rounded-xl border border-border/80 shadow-xs bg-muted">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-64 sm:h-96 object-cover"
                />
              </div>

              <div>
                <h2 className="font-display text-2xl font-extrabold text-foreground mb-4">About This Event</h2>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-lg sm:text-xl font-normal text-foreground/90 leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* Share Toolbar */}
              <div className="rounded-xl border border-border/80 bg-card p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-foreground">
                  <Share2 className="h-4.5 w-4.5 text-primary" />
                  <span>Share this event with other youths:</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <a
                    href={`https://wa.me/?text=${whatsappShareText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-4 py-2 text-xs sm:text-sm font-bold text-white transition hover:bg-[#20ba5a] shadow-xs"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${whatsappShareText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-black dark:bg-slate-800 px-4 py-2 text-xs sm:text-sm font-bold text-white transition hover:bg-slate-800 shadow-xs"
                  >
                    X (Twitter)
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#1877F2] px-4 py-2 text-xs sm:text-sm font-bold text-white transition hover:bg-[#166fe5] shadow-xs"
                  >
                    Facebook
                  </a>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 text-xs sm:text-sm font-bold border-border/80"
                    onClick={handleCopyLink}
                  >
                    {copied ? <Check className="mr-1.5 h-4 w-4 text-green-600" /> : <Copy className="mr-1.5 h-4 w-4" />}
                    {copied ? "Copied" : "Copy Link"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar Details Card */}
            <aside>
              <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-6 sticky top-24 shadow-md">
                <h3 className="font-display text-xl font-extrabold text-foreground pb-3 border-b border-border/70">
                  Event Schedule & Details
                </h3>

                <div className="space-y-5">
                  <div className="flex items-start gap-3.5">
                    <Calendar className="h-6 w-6 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-primary uppercase tracking-widest">Date</p>
                      <p className="text-base sm:text-lg font-bold text-foreground mt-0.5 leading-snug">
                        {new Date(event.date).toLocaleDateString("en-NG", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Clock className="h-6 w-6 text-secondary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-secondary uppercase tracking-widest">Time</p>
                      <p className="text-base sm:text-lg font-bold text-foreground mt-0.5">{event.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <MapPin className="h-6 w-6 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-primary uppercase tracking-widest">Location / Venue</p>
                      <p className="text-base sm:text-lg font-bold text-foreground mt-0.5">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Tag className="h-6 w-6 text-secondary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-secondary uppercase tracking-widest">Category</p>
                      <p className="text-base sm:text-lg font-bold text-foreground mt-0.5">{event.category}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-border/60">
                  {!isPast ? (
                    <>
                      <Button asChild className="w-full font-bold shadow-sm" size="lg">
                        <Link to={`/register?event=${encodeURIComponent(event.title)}`}>
                          Register to Attend
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full font-bold text-xs" size="sm">
                        <a href={googleCalendarUrl} target="_blank" rel="noopener noreferrer">
                          <Calendar className="mr-1.5 h-3.5 w-3.5 text-primary" />
                          Add to Google Calendar
                          <ExternalLink className="ml-1 h-3 w-3 opacity-60" />
                        </a>
                      </Button>
                    </>
                  ) : (
                    <div className="rounded-lg bg-muted p-3 text-center text-xs font-medium text-muted-foreground">
                      This event has taken place.
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>

          {/* Related / Other Upcoming Events */}
          {otherEvents.length > 0 && (
            <div className="mt-16 pt-12 border-t border-border/80">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-secondary">Discover More</p>
                  <h3 className="font-display text-xl sm:text-2xl font-extrabold text-foreground">
                    Other Upcoming Events
                  </h3>
                </div>
                <Button asChild variant="ghost" className="font-bold text-xs sm:text-sm">
                  <Link to="/events">View All Events</Link>
                </Button>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {otherEvents.map((oe) => (
                  <Card key={oe.id} className="overflow-hidden border border-border/80 hover:shadow-md transition-shadow">
                    <Link to={`/events/${oe.id}`} className="block h-36 overflow-hidden">
                      <img src={oe.image_url} alt={oe.title} className="h-full w-full object-cover transition-transform hover:scale-105 duration-300" />
                    </Link>
                    <CardContent className="p-4">
                      <Badge className="bg-secondary text-white font-bold text-[10px] mb-2">{oe.category}</Badge>
                      <Link to={`/events/${oe.id}`}>
                        <h4 className="font-sans text-sm font-bold text-foreground hover:text-primary transition-colors line-clamp-2">
                          {oe.title}
                        </h4>
                      </Link>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground font-medium pt-2 border-t border-border/50">
                        <span>{new Date(oe.date).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}</span>
                        <Link to={`/events/${oe.id}`} className="font-bold text-primary hover:underline">
                          Details →
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default EventDetail;
