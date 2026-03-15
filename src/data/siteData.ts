// ========== HERO SLIDES ==========
export const heroSlides = [
  {
    id: 1,
    title: "Raising Unconventional Youths",
    subtitle: "Building leaders who challenge the status quo and create positive change in Abia State.",
    cta1: { label: "Learn More", link: "/about" },
    cta2: { label: "Join Us", link: "/register" },
    image: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Empowering Youth Voices",
    subtitle: "Creating platforms for young Abians to participate in governance and civic engagement.",
    cta1: { label: "Our Events", link: "/events" },
    cta2: { label: "Join Us", link: "/register" },
    image: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Inspiring the Next Generation",
    subtitle: "To steer the course of progressive development in Abia State through youth empowerment.",
    cta1: { label: "View Portfolio", link: "/portfolio" },
    cta2: { label: "Join Us", link: "/register" },
    image: "/placeholder.svg",
  },
];

// ========== CORE VALUES ==========
export const coreValues = [
  { icon: "🤝", name: "Inclusion", description: "Embracing diversity and ensuring every voice is heard." },
  { icon: "⚖️", name: "Fairness", description: "Just and equitable treatment for all." },
  { icon: "🗳️", name: "Equal Representation", description: "Ensuring balanced participation across all demographics." },
  { icon: "💎", name: "Character", description: "Upholding strong moral values and integrity." },
  { icon: "🔍", name: "Transparency", description: "Open and honest in all our engagements." },
  { icon: "💡", name: "Creativity", description: "Innovative approaches to problem-solving." },
  { icon: "🇳🇬", name: "Patriotism", description: "Love for our state and nation." },
  { icon: "🤲", name: "Unity", description: "Strength through collective action." },
  { icon: "❤️", name: "Love", description: "Compassion and care for our communities." },
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
  image: "/placeholder.svg",
};

// ========== TEAM - THE FRONTIERS ==========
export const teamMembers = [
  { name: "Ekejiuba Daberechi Kingsley", role: "Convener", image: "/placeholder.svg" },
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
    image: "/placeholder.svg",
  },
  {
    id: "2",
    title: "Laptop Support Program for Students",
    description: "Providing laptops and digital literacy training to underprivileged students across Abia State.",
    date: "2026-05-20",
    time: "9:00 AM",
    location: "Abia State University, Uturu",
    category: "Laptop Support",
    image: "/placeholder.svg",
  },
  {
    id: "3",
    title: "Scholarship Awards Ceremony",
    description: "Annual scholarship awards for outstanding students demonstrating academic excellence and community service.",
    date: "2026-03-10",
    time: "2:00 PM",
    location: "National Museum, Umuahia",
    category: "Scholarships",
    image: "/placeholder.svg",
  },
  {
    id: "4",
    title: "Press Conference on Youth Development",
    description: "Addressing the media on Progressive Abia Youths' roadmap for youth empowerment in 2026.",
    date: "2025-12-01",
    time: "11:00 AM",
    location: "Press Center, Aba",
    category: "Press Conference",
    image: "/placeholder.svg",
  },
  {
    id: "5",
    title: "Inter-LGA Quiz Competition",
    description: "A knowledge-based competition fostering healthy rivalry and intellectual growth among youths across all 17 LGAs.",
    date: "2026-06-15",
    time: "10:00 AM",
    location: "Abia State Civic Center",
    category: "Quiz Competition",
    image: "/placeholder.svg",
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
    image: "/placeholder.svg",
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
    image: "/placeholder.svg",
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
    image: "/placeholder.svg",
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
    image: "/placeholder.svg",
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
  { id: "1", title: "Voter Sensitization Rally 2025", description: "Mass voter education campaign across Umuahia", category: "Campaigns", image: "/placeholder.svg" },
  { id: "2", title: "Laptop Distribution Program", description: "50 laptops distributed to students in rural areas", category: "Education", image: "/placeholder.svg" },
  { id: "3", title: "Youth Leadership Summit", description: "Annual gathering of young leaders from all 17 LGAs", category: "Events", image: "/placeholder.svg" },
  { id: "4", title: "Community Clean-Up Drive", description: "Environmental awareness campaign in Aba", category: "Community", image: "/placeholder.svg" },
  { id: "5", title: "Scholarship Award Ceremony", description: "Honoring academic excellence among Abia youths", category: "Education", image: "/placeholder.svg" },
  { id: "6", title: "Press Conference - Youth Agenda", description: "Presenting youth policy recommendations", category: "Campaigns", image: "/placeholder.svg" },
  { id: "7", title: "Inter-LGA Sports Festival", description: "Promoting unity through sports across local government areas", category: "Events", image: "/placeholder.svg" },
  { id: "8", title: "Digital Skills Workshop", description: "Training youths in web development and design", category: "Education", image: "/placeholder.svg" },
];

// ========== PARTNERS ==========
export const partners = [
  { name: "Partner 1", logo: "/placeholder.svg" },
  { name: "Partner 2", logo: "/placeholder.svg" },
  { name: "Partner 3", logo: "/placeholder.svg" },
  { name: "Partner 4", logo: "/placeholder.svg" },
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
