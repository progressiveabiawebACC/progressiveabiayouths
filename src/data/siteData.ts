// ========== HERO SLIDES ==========
export const heroSlides = [
  {
    id: 1,
    title: "Raising Unconventional Youths",
    subtitle: "Transforming good thoughts into democratic actions for a progressive Abia State.",
    cta1: { label: "Learn More", link: "/about" },
    cta2: { label: "Join Us", link: "/register" },
    image: "/images/heroes/hero-1.jpg",
  },
  {
    id: 2,
    title: "Empowering Youth Voices",
    subtitle: "Creating platforms for young Abians to participate in governance and civic engagement.",
    cta1: { label: "Our Events", link: "/events" },
    cta2: { label: "Join Us", link: "/register" },
    image: "/images/heroes/hero-2.jpeg",
  },
  {
    id: 3,
    title: "Inspiring the Next Generation",
    subtitle: "To steer the course of progressive development in Abia State through youth empowerment.",
    cta1: { label: "View Portfolio", link: "/portfolio" },
    cta2: { label: "Join Us", link: "/register" },
    image: "/images/heroes/hero-3.jpeg",
  },
];

// ========== CORE VALUES ==========
export const coreValues = [
  { icon: "Users", name: "Inclusion", description: "Embracing diversity and ensuring every voice is heard." },
  { icon: "Scale", name: "Fairness", description: "Just and equitable treatment for all." },
  { icon: "UserCheck", name: "Equal Representation", description: "Ensuring balanced participation across all demographics." },
  { icon: "Shield", name: "Character", description: "Upholding strong moral values and integrity." },
  { icon: "Eye", name: "Transparency", description: "Open and honest in all our engagements." },
  { icon: "Lightbulb", name: "Creativity", description: "Innovative approaches to problem-solving." },
  { icon: "Flag", name: "Patriotism", description: "Love for our state and nation." },
  { icon: "Handshake", name: "Unity", description: "Strength through collective action." },
  { icon: "Heart", name: "Love", description: "Compassion and care for our communities." },
];

// ========== STATS ==========
export const stats = [
  { label: "Ambassadors", value: 500, suffix: "+" },
  { label: "People Reached", value: 10000, suffix: "+" },
  { label: "States Covered", value: 5, suffix: "" },
  { label: "Projects Completed", value: 20, suffix: "+" },
];

// ========== FOUNDER ==========
export const founder = {
  name: "Ekejiuba Daberechi Kingsley",
  title: "Founder & Convener",
  bio: "A visionary leader passionate about youth empowerment and civic engagement in Abia State. Ekejiuba founded Progressive Abia Youths with the mission of raising unconventional youths who will drive positive change and progressive development.",
  image: "/images/team/founder.png",
};

// ========== TEAM - THE FRONTIERS ==========
export const teamMembers = [
  { name: "Ekejiuba Daberechi Kingsley", role: "Convener", image: "/images/team/founder.png" },
  { name: "Team Member 2", role: "Deputy Convener", image: "/placeholder.svg" },
  { name: "Team Member 3", role: "Secretary General", image: "/placeholder.svg" },
  { name: "Team Member 4", role: "Director of Finance", image: "/placeholder.svg" },
  { name: "Team Member 5", role: "Director of Socials", image: "/placeholder.svg" },
  { name: "Team Member 6", role: "Director of Media", image: "/placeholder.svg" },
];

// ========== LGA COORDINATORS ==========
export const lgaCoordinators = [
  { lga: "Aba North", name: "Coordinator Name", phone: "" },
  { lga: "Aba South", name: "Coordinator Name", phone: "" },
  { lga: "Arochukwu", name: "Coordinator Name", phone: "" },
  { lga: "Bende", name: "Coordinator Name", phone: "" },
  { lga: "Ikwuano", name: "Coordinator Name", phone: "" },
  { lga: "Isiala Ngwa North", name: "Coordinator Name", phone: "" },
  { lga: "Isiala Ngwa South", name: "Coordinator Name", phone: "" },
  { lga: "Isuikwuato", name: "Coordinator Name", phone: "" },
  { lga: "Obi Ngwa", name: "Coordinator Name", phone: "" },
  { lga: "Ohafia", name: "Coordinator Name", phone: "" },
  { lga: "Osisioma", name: "Coordinator Name", phone: "" },
  { lga: "Ugwunagbo", name: "Coordinator Name", phone: "" },
  { lga: "Ukwa East", name: "Coordinator Name", phone: "" },
  { lga: "Ukwa West", name: "Coordinator Name", phone: "" },
  { lga: "Umuahia North", name: "Coordinator Name", phone: "" },
  { lga: "Umuahia South", name: "Coordinator Name", phone: "" },
  { lga: "Umu Nneochi", name: "Coordinator Name", phone: "" },
];

// ========== EVENTS ==========
export type EventItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image: string;
};

export const events: EventItem[] = [
  {
    id: "1",
    title: "Voter Sensitization Campaign - Umuahia",
    description: "A grassroots campaign to educate voters on the importance of civic participation and responsible voting in the upcoming elections.",
    date: "2026-04-15",
    time: "10:00 AM",
    location: "Umuahia City Hall, Umuahia",
    category: "Voter Sensitization",
    image: "/images/events/voter-sensitization.jpg",
  },
  {
    id: "2",
    title: "Laptop Support Program for Students",
    description: "Providing laptops and digital literacy training to underprivileged students across Abia State.",
    date: "2026-05-20",
    time: "9:00 AM",
    location: "Abia State University, Uturu",
    category: "Laptop Support",
    image: "/images/events/laptop-support.jpg",
  },
  {
    id: "3",
    title: "Scholarship Awards Ceremony",
    description: "Annual scholarship awards for outstanding students demonstrating academic excellence and community service.",
    date: "2026-03-10",
    time: "2:00 PM",
    location: "National Museum, Umuahia",
    category: "Scholarships",
    image: "/images/events/laptop-distribution.jpg",
  },
  {
    id: "4",
    title: "Press Conference on Youth Development",
    description: "Addressing the media on Progressive Abia Youths' roadmap for youth empowerment in 2026.",
    date: "2025-12-01",
    time: "11:00 AM",
    location: "Press Center, Aba",
    category: "Press Conference",
    image: "/images/events/press-conference.jpeg",
  },
  {
    id: "5",
    title: "Inter-LGA Quiz Competition",
    description: "A knowledge-based competition fostering healthy rivalry and intellectual growth among youths across all 17 LGAs.",
    date: "2026-06-15",
    time: "10:00 AM",
    location: "Abia State Civic Center",
    category: "Quiz Competition",
    image: "/images/events/press-briefing.jpeg",
  },
];

// ========== BLOG POSTS ==========
export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  image: string;
  readTime: string;
};

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Why Youth Participation in Governance Matters",
    excerpt: "Exploring the critical role young people play in shaping democratic governance in Abia State.",
    content: "Full blog content here...",
    author: "Ekejiuba Daberechi Kingsley",
    date: "2026-03-01",
    category: "Governance",
    tags: ["youth", "governance", "democracy"],
    image: "/images/events/press-conference-2.jpg",
    readTime: "5 min read",
  },
  {
    id: "2",
    title: "The Impact of Digital Literacy on Rural Communities",
    excerpt: "How our laptop support program is transforming education in underserved areas of Abia State.",
    content: "Full blog content here...",
    author: "Team PAY",
    date: "2026-02-15",
    category: "Education",
    tags: ["education", "technology", "rural"],
    image: "/images/events/laptop-support.jpg",
    readTime: "4 min read",
  },
  {
    id: "3",
    title: "Building a Progressive Abia: Our Vision for 2026",
    excerpt: "A comprehensive look at our strategic goals and initiatives for the coming year.",
    content: "Full blog content here...",
    author: "Ekejiuba Daberechi Kingsley",
    date: "2026-01-20",
    category: "Vision",
    tags: ["vision", "strategy", "abia"],
    image: "/images/events/press-conference-3.jpg",
    readTime: "7 min read",
  },
  {
    id: "4",
    title: "Scholarship Program: Changing Lives One Student at a Time",
    excerpt: "Stories of scholarship recipients and their journeys towards academic excellence.",
    content: "Full blog content here...",
    author: "Team PAY",
    date: "2025-12-10",
    category: "Education",
    tags: ["scholarship", "education", "success"],
    image: "/images/events/laptop-distribution.jpg",
    readTime: "6 min read",
  },
];

// ========== PORTFOLIO ==========
export type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
};

export const portfolioItems: PortfolioItem[] = [
  { id: "1", title: "Voter Sensitization Rally 2025", description: "Mass voter education campaign across Umuahia", category: "Campaigns", image: "/images/portfolio/portfolio-3.jpg" },
  { id: "2", title: "Laptop Distribution Program", description: "50 laptops distributed to students in rural areas", category: "Education", image: "/images/portfolio/portfolio-5.jpg" },
  { id: "3", title: "Youth Leadership Summit", description: "Annual gathering of young leaders from all 17 LGAs", category: "Events", image: "/images/portfolio/portfolio-1.jpg" },
  { id: "4", title: "Community Engagement Drive", description: "Community outreach and youth engagement in Aba", category: "Community", image: "/images/portfolio/portfolio-2.jpg" },
  { id: "5", title: "Scholarship Award Ceremony", description: "Honoring academic excellence among Abia youths", category: "Education", image: "/images/portfolio/portfolio-6.jpg" },
  { id: "6", title: "Press Conference - Youth Agenda", description: "Presenting youth policy recommendations", category: "Campaigns", image: "/images/portfolio/portfolio-4.jpg" },
  { id: "7", title: "Capacity Building Workshop", description: "Press briefing and capacity building sessions", category: "Events", image: "/images/portfolio/portfolio-7.jpeg" },
  { id: "8", title: "Walk to Good Governance", description: "Campaign for good governance and civic participation", category: "Campaigns", image: "/images/portfolio/portfolio-8.jpeg" },
];

// ========== PARTNERS ==========
export const partners = [
  { name: "NVDC", logo: "/images/partners/nvdc.png" },
  { name: "The Compatriots", logo: "/images/partners/the-compatriots.png" },
  { name: "OFIAR", logo: "/images/partners/ofiar.png" },
  { name: "NPAG", logo: "/images/partners/npag.png" },
  { name: "NYSC", logo: "/images/partners/nysc.png" },
  { name: "Exalt Nigeria", logo: "/images/partners/exalt-nigeria.png" },
  { name: "PRAWA", logo: "/images/partners/prawa.png" },
  { name: "Living by Design", logo: "/images/partners/living-by-design.png" },
  { name: "Ready to Lead Africa", logo: "/images/partners/ready-to-lead.png" },
  { name: "APHCF", logo: "/images/partners/aphcf.png" },
  { name: "Shift Nigeria", logo: "/images/partners/shift-nigeria.png" },
  { name: "Imo Advocacy Group", logo: "/images/partners/imo-advocacy.jpg" },
];

// ========== CONTACT INFO ==========
export const contactInfo = {
  address: "No. 80 Aba road, Umuahia, Abia State, Nigeria",
  phone: "+234 706 6022 292",
  email: "progressiveabiayouths@gmail.com",
  socialLinks: {
    facebook: "https://facebook.com/progressiveabiayouths",
    twitter: "https://twitter.com/progressiveabia",
    instagram: "https://instagram.com/progressiveabiayouths",
    youtube: "https://youtube.com/@progressiveabiayouths",
  },
};

// ========== REGISTER ==========
export const registerFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfuNuF_50cZOvA8Z-Dfi-XFAH-8etk-ueQeQyWAZkk9ooe3KQ/viewform?usp=send_form";
