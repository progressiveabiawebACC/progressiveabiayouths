# Progressive Abia Youths — Website Rebuild

## Overview

Rebuild the Progressive Abia Youths website with all 7 public-facing pages, using the organization's brand colors (extracted from the logo — blue and white tones), professional typography, and a clean, credible aesthetic appropriate for a Nigerian youth advocacy organization.

## Pages to Build

### 1. Homepage

- **Hero Slider** — 3 rotating slides: "Raising Unconventional Youths", "Empowering Youth Voices", "Inspiring the next generation to steer the course" with "Learn More" and "Join Us" CTAs
- **About Summary** — Organization overview with core values (Inclusion, Fairness, Equal representation, Character, Transparency, Creativity, Patriotism, Unity, Love)
- **Founder Profile** — Ekejiuba Daberechi Kingsley section with photo placeholder and bio
- **Stats Section** — Animated counters for Ambassadors, Reach, States, Projects (placeholder 0s for now)
- **Partners Section** — Logo display area
- **Events Highlights** — Featured events cards
- **Blog Highlights** — Latest articles preview
- **Gallery/Projects Teaser** — Recent projects showcase
- **Final CTA** — "Take Responsibility" section with "Be an agent of progressive change, join us"

### 2. About Page

- Organization history and overview
- Mission & Vision statements
- Core values display
- Leadership team — "The Frontiers" profiles
- LGA Coordinators for all 17 LGAs
- Key event highlights

### 3. Events Page

- Categorized event listings (auto-sorted as Upcoming/Past by date)
- Event cards with title, description, date, time, location, and image
- Categories: Voter sensitization, Laptop support, Scholarships, Press conferences, Quiz competitions

### 4. Portfolio Page

- Image gallery organized by categories/sections
- Each item with title and description
- Lightbox/modal for viewing full images

### 5. Register Page

- Embedded Google Form (https://docs.google.com/forms/d/e/1FAIpQLSfuNuF_50cZOvA8Z-Dfi-XFAH-8etk-ueQeQyWAZkk9ooe3KQ/viewform?usp=send_form)

### 6. Contact Us Page

- Contact details: Address (No. 80 Aba road, Umuahia), Phone (+234 706 6022 292), Email ([progressiveabiayouths@gmail.com](mailto:progressiveabiayouths@gmail.com))
- Functional contact form
- Social media links

### 7. Blog Page

- Blog post listings with search
- Categories/tags filtering
- Recent posts sidebar widget

## Design

- **Colors**: Extracted from the Progressive Abia Youths logo — primary blue, white, with warm accent tones
- **Typography**: Professional, readable fonts (e.g., Inter/Poppins for headings, system sans-serif for body)
- **Logo**: The uploaded Progressive Abia Youths logo will be used in the navbar and footer
- **Style**: Clean, professional, credible — not generic or sci-fi. Inspired by Nigerian organizational websites
- **Fully responsive** with mobile-first approach

## Navigation

- Sticky top navbar with logo, page links, and prominent "Join Us" CTA button
- Mobile hamburger menu
- Footer with quick links, contact info, and social media

## Data Approach

- All content will use static data for now, structured in a way that's easy to connect to Lovable Cloud (Supabase) later for the Admin Panel phase
- Blog posts, events, portfolio items, and partners will use TypeScript data files

## Phase 2 (After this plan)

- Admin Panel with Lovable Cloud for managing Events, Blog, Portfolio, team leadership and LGA coordinators for about page Partners, and Hero content
- Authentication for admin users
- SEO optimization and analytics integration