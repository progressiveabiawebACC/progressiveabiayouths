import { motion } from "framer-motion";
import { Target, Eye, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import CoreValueIcon from "@/components/CoreValueIcon";
import { coreValues, teamMembers, lgaCoordinators } from "@/data/siteData";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5 },
};

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <img src="/images/about/about-hero.jpg" alt="About Progressive Abia Youths" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-primary/85" />
        <div className="container relative text-center">
          <motion.h1 {...fadeIn} className="font-display text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
            About Us
          </motion.h1>
          <motion.p {...fadeIn} transition={{ delay: 0.1 }} className="mx-auto mt-4 max-w-2xl text-base font-medium text-white/85">
            Get to know Progressive Abia Youths — our story, mission, and the team driving change.
          </motion.p>
        </div>
      </section>

      {/* History & Overview */}
      <section className="py-16">
        <div className="container">
          <motion.div {...fadeIn} className="mx-auto max-w-3xl space-y-4 leading-relaxed">
            <h2 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">Our Story</h2>
            <p className="text-base font-medium text-muted-foreground">
              Progressive Abia Youths (PAY) was founded with the bold vision of raising unconventional youths — young Abians who refuse to accept the status quo and instead work towards progressive change and good governance in Abia State, Nigeria.
            </p>
            <p className="text-base font-medium text-muted-foreground">
              Since our inception, we have grown from a small group of passionate youths in Umuahia to a statewide movement spanning all 17 Local Government Areas of Abia State. Through voter sensitization campaigns, educational support programs, scholarship awards, and civic engagement activities, we have touched thousands of lives.
            </p>
            <p className="text-base font-medium text-muted-foreground">
              Our approach is rooted in the belief that young people are not just the leaders of tomorrow — they are the change-makers of today. We empower youths with the knowledge, skills, and platforms needed to actively participate in governance and community development.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2">
            <motion.div {...fadeIn}>
              <Card className="h-full border-l-4 border-l-primary">
                <CardContent className="p-8">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="mb-3 font-display text-xl font-extrabold text-foreground">Our Mission</h2>
                  <p className="text-base font-medium text-muted-foreground leading-relaxed">
                    To raise unconventional youths who will champion progressive governance, civic engagement, and sustainable development in Abia State through education, advocacy, and community action.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
              <Card className="h-full border-l-4 border-l-secondary">
                <CardContent className="p-8">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                    <Eye className="h-6 w-6 text-secondary" />
                  </div>
                  <h2 className="mb-3 font-display text-xl font-extrabold text-foreground">Our Vision</h2>
                  <p className="text-base font-medium text-muted-foreground leading-relaxed">
                    A progressive Abia State where young people are active participants in governance, driving equitable development and holding leaders accountable for the welfare of all citizens.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="container">
          <div className="mb-10 text-center">
            <p className="mb-1 text-sm font-bold uppercase tracking-wider text-secondary">What We Stand For</p>
            <h2 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">Our Core Values</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((val, i) => (
              <motion.div key={val.name} {...fadeIn} transition={{ delay: i * 0.05 }}>
                <Card className="transition-shadow hover:shadow-md">
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Frontiers */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <div className="mb-10 text-center">
            <p className="mb-1 text-sm font-bold uppercase tracking-wider text-secondary">Leadership</p>
            <h2 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">The Frontiers</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member, i) => (
              <motion.div key={member.name} {...fadeIn} transition={{ delay: i * 0.05 }}>
                <Card className="overflow-hidden text-center">
                  <div className="flex h-48 items-center justify-center bg-muted overflow-hidden">
                    <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-sans text-base font-bold text-foreground">{member.name}</h3>
                    <p className="text-sm font-semibold text-primary">{member.role}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LGA Coordinators */}
      <section className="py-16">
        <div className="container">
          <div className="mb-10 text-center">
            <p className="mb-1 text-sm font-bold uppercase tracking-wider text-secondary">Across Abia State</p>
            <h2 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">LGA Coordinators</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm font-medium text-muted-foreground">Our representatives across all 17 Local Government Areas of Abia State.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {lgaCoordinators.map((coord) => (
              <div key={coord.lga} className="flex items-center gap-3 rounded-lg border bg-card p-4">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                <div>
                  <h3 className="font-sans text-sm font-bold text-foreground">{coord.lga}</h3>
                  <p className="text-xs font-medium text-muted-foreground">{coord.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
