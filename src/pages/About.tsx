import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Target, Eye, MapPin, Search, Phone, UserCheck, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import CoreValueIcon from "@/components/CoreValueIcon";
import { coreValues } from "@/data/siteData";
import { useTeamMembers, useLgaCoordinators } from "@/hooks/usePublicData";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5 },
};

// Canonical Abia State Senatorial Districts mapping
const districtMap: Record<string, "Abia Central" | "Abia North" | "Abia South"> = {
  "Aba North": "Abia South",
  "Aba South": "Abia South",
  "Arochukwu": "Abia North",
  "Bende": "Abia North",
  "Ikwuano": "Abia Central",
  "Isiala Ngwa North": "Abia Central",
  "Isiala Ngwa South": "Abia Central",
  "Isuikwuato": "Abia North",
  "Obi Ngwa": "Abia South",
  "Ohafia": "Abia North",
  "Osisioma": "Abia Central",
  "Ugwunagbo": "Abia South",
  "Ukwa East": "Abia South",
  "Ukwa West": "Abia South",
  "Umuahia North": "Abia Central",
  "Umuahia South": "Abia Central",
  "Umu Nneochi": "Abia North",
};

const About = () => {
  const { data: teamData } = useTeamMembers();
  const { data: lgaData } = useLgaCoordinators();
  const teamMembers = teamData ?? [];
  const lgaCoordinators = lgaData ?? [];

  const [selectedDistrict, setSelectedDistrict] = useState<string>("All");
  const [lgaSearch, setLgaSearch] = useState<string>("");

  const filteredLgas = useMemo(() => {
    return lgaCoordinators.filter((coord) => {
      const district = districtMap[coord.lga] || "Abia Central";
      const matchesDistrict = selectedDistrict === "All" || district === selectedDistrict;
      const matchesSearch = coord.lga.toLowerCase().includes(lgaSearch.toLowerCase()) ||
                            coord.name.toLowerCase().includes(lgaSearch.toLowerCase());
      return matchesDistrict && matchesSearch;
    });
  }, [lgaCoordinators, selectedDistrict, lgaSearch]);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <img src="/images/about/about-hero.jpg" alt="About Progressive Abia Youths" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-primary/85 to-primary/80" />
        <div className="container relative text-center">
          <motion.h1 {...fadeIn} className="font-display text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">About Us</motion.h1>
          <motion.p {...fadeIn} transition={{ delay: 0.1 }} className="mx-auto mt-4 max-w-2xl text-base font-medium text-white/90">Get to know Progressive Abia Youths — our story, mission, and the team driving change.</motion.p>
        </div>
      </section>

      {/* History */}
      <section className="py-20 sm:py-24">
        <div className="container">
          <motion.div {...fadeIn} className="mx-auto max-w-3xl space-y-6 leading-relaxed">
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-secondary">Our Roots & Heritage</span>
              <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl mt-1">Our Story</h2>
            </div>
            <p className="text-lg sm:text-xl font-normal text-foreground/85 leading-relaxed">
              Progressive Abia Youths (PAY) was founded with the bold vision of raising <span className="font-serif-italic font-semibold text-primary">unconventional youths</span> — young Abians who refuse to accept the status quo and instead work towards progressive change, constitutional literacy, and good governance in Abia State, Nigeria.
            </p>
            <p className="text-lg sm:text-xl font-normal text-foreground/85 leading-relaxed">
              Since our inception, we have grown from a small group of passionate youths in Umuahia to a statewide movement spanning all 17 Local Government Areas of Abia State.
            </p>
            <p className="text-lg sm:text-xl font-normal text-foreground/85 leading-relaxed">
              Our approach is rooted in the belief that young people are not just the leaders of tomorrow — they are the change-makers of today.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-muted/40 py-20 sm:py-24 border-y border-border/70">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
            <motion.div {...fadeIn}>
              <Card className="h-full border-l-4 border-l-primary shadow-sm bg-card">
                <CardContent className="p-8 sm:p-10">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Target className="h-7 w-7" />
                  </div>
                  <h2 className="mb-3 font-display text-2xl font-extrabold text-foreground">Our Mission</h2>
                  <p className="text-lg font-normal text-foreground/85 leading-relaxed">
                    To raise unconventional youths who will champion progressive governance, civic engagement, and sustainable development across every ward of Abia State.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
              <Card className="h-full border-l-4 border-l-secondary shadow-sm bg-card">
                <CardContent className="p-8 sm:p-10">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                    <Eye className="h-7 w-7" />
                  </div>
                  <h2 className="mb-3 font-display text-2xl font-extrabold text-foreground">Our Vision</h2>
                  <p className="text-lg font-normal text-foreground/85 leading-relaxed">
                    A progressive Abia State where young people are active participants in governance, driving equitable economic development and social equity.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 sm:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-secondary">What We Stand For</p>
            <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">Our Core Values</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((val, i) => (
              <motion.div key={val.name} {...fadeIn} transition={{ delay: i * 0.04 }}>
                <Card className="transition-all hover:shadow-lg hover:border-primary/40 border border-border/80 bg-card">
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <CoreValueIcon icon={val.icon} className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-foreground mb-1">{val.name}</h3>
                      <p className="text-sm sm:text-base font-normal text-foreground/80 leading-relaxed">{val.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Frontiers */}
      {teamMembers.length > 0 && (
        <section className="bg-muted/30 py-16">
          <div className="container">
            <div className="mb-10 text-center">
              <p className="mb-1 text-sm font-bold uppercase tracking-wider text-secondary">Leadership</p>
              <h2 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">The Frontiers</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member, i) => (
                <motion.div key={member.id} {...fadeIn} transition={{ delay: i * 0.05 }}>
                  <Card className="overflow-hidden text-center border border-border/80 shadow-xs hover:shadow-md transition-shadow">
                    <div className="flex h-48 items-center justify-center bg-muted overflow-hidden">
                      <img src={member.image_url} alt={member.name} className="h-full w-full object-cover transition-transform hover:scale-105 duration-300" />
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-sans text-base font-bold text-foreground">{member.name}</h3>
                      <p className="text-sm font-bold text-primary mt-0.5">{member.role}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LGA Coordinators Explorer */}
      {lgaCoordinators.length > 0 && (
        <section className="py-16">
          <div className="container">
            <div className="mb-8 text-center">
              <p className="mb-1 text-sm font-bold uppercase tracking-wider text-secondary">Across Abia State</p>
              <h2 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">LGA Chapters & Coordinators</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm font-medium text-muted-foreground">
                Connecting grassroots youth leadership across all 17 Local Government Areas of Abia State.
              </p>
            </div>

            {/* Interactive Filters & Search */}
            <div className="mx-auto max-w-4xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {["All", "Abia Central", "Abia North", "Abia South"].map((dist) => (
                  <Button
                    key={dist}
                    size="sm"
                    variant={selectedDistrict === dist ? "default" : "outline"}
                    className="font-bold text-xs"
                    onClick={() => setSelectedDistrict(dist)}
                  >
                    {dist === "All" ? `All 17 LGAs` : dist}
                  </Button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search LGA..."
                  className="pl-9 h-9 text-xs"
                  value={lgaSearch}
                  onChange={(e) => setLgaSearch(e.target.value)}
                />
              </div>
            </div>

            {/* LGA Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredLgas.map((coord) => {
                const district = districtMap[coord.lga] || "Abia Central";
                return (
                  <div
                    key={coord.id}
                    className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4.5 shadow-xs transition-all hover:border-primary/50 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-display text-base sm:text-lg font-bold text-foreground">{coord.lga}</h3>
                          <Badge variant="outline" className="text-xs px-2 py-0.5 mt-0.5 font-semibold text-muted-foreground border-border/80">
                            {district}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3.5 pt-3 border-t border-border/60 flex items-center justify-between text-sm font-semibold text-foreground/80">
                      <span className="truncate">{coord.name || "Representative"}</span>
                      {coord.phone ? (
                        <a
                          href={`tel:${coord.phone}`}
                          className="flex items-center gap-1.5 font-bold text-primary hover:underline text-sm"
                        >
                          <Phone className="h-4 w-4" /> Call
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground font-semibold">Active Chapter</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredLgas.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                <p className="font-medium text-sm">No LGA found matching your search.</p>
                <Button
                  variant="link"
                  className="mt-2 text-primary font-bold"
                  onClick={() => { setSelectedDistrict("All"); setLgaSearch(""); }}
                >
                  Clear filters
                </Button>
              </div>
            )}

            {/* Volunteer / Coordinate your ward banner */}
            <div className="mt-12 rounded-2xl bg-gradient-to-r from-primary/10 via-card to-secondary/10 border border-primary/20 p-6 sm:p-8 text-center max-w-3xl mx-auto shadow-xs">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                <UserCheck className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">
                Want to lead grassroots action in your LGA or Ward?
              </h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                We are actively appointing ward ambassadors and youth organizers across all 17 LGAs. Join Progressive Abia Youths today.
              </p>
              <Button asChild className="mt-5 font-bold shadow-sm" size="default">
                <Link to="/register">
                  Apply as Youth Ambassador <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default About;
