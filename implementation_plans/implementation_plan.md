# Implementation Plan: Separate External Website & Fix Management Website

Unmerge the external website from the EduTrack management portal, fix duplicate navigation links in the management website, rebuild the full external OD AI HUB website using the provided skeleton and Image 2 URL structure (with 3D rings, interactive course catalog, and all pillars), and ensure live synchronization with the Management Console.

## User Review Required

> [!IMPORTANT]
> - **Management Website (Port 3000)**: We will clean up `Navbar.jsx` to remove the duplicated "Coaching" and "Problem Statements" links and the merged "Programs v" dropdown. The management website will remain dedicated to College/EduTrack management, while keeping the Management Console's tabs for managing external website data (Academy courses, pillars, enquiries, etc.).
> - **External Website (Port 8000 / `website/`)**: We will implement the full standalone external website based on the user's provided skeleton, incorporating:
>   1. **Home**: Hero, 5-Pillar 3D Ring (Academy, Technologies, Innovation Lab, Startups, For Business), Stats, Map & About, Success Stories, CTA.
>   2. **Academy**: Hero, 6-Category 3D Ring (School, Diploma, College, Non-Tech, Internships, Career).
>   3. **Course Catalog on Explore**: When clicking "Explore" on any 3D ring card, it displays that specific program's courses (with College degree chips B.Tech/BCA/B.Sc/MCA/M.Sc, search, mode filter, and Enquire modal).
>   4. **Other Pillars (from Image 2)**: Technologies, Innovation Lab, Startups, For Business, For Institutions (Colleges & Schools), Events, Success Stories, and Other Pages.
>   5. **Database & Console Connection**: Dynamic connection to the backend API (`/api/v1/...`) and SQLite database (`edutrack.db`) so changes made in the Management Console appear on the external website immediately, and enquiries submitted from the website appear in the Management Console.

---

## Proposed Changes

### Management Website (Frontend React App)

#### [MODIFY] [Navbar.jsx](file:///d:/New%20folder%20(2)/frontend/src/components/common/Navbar.jsx)
- Remove duplicate `Coaching` and `Problem Statements` navigation links.
- Remove the `Programs v` external website pillar dropdown from the management navigation bar.
- Clean up the navigation bar to strictly display:
  `Home` | `Institutions` | `Course Matrix` | `Analytics Hub` | `Coaching` | `Problem Statements` | `Management Console` | `Users` (if admin) | Sign In / Sign Out.

#### [MODIFY] [App.jsx](file:///d:/New%20folder%20(2)/frontend/src/App.jsx)
- Clean up external website routes that were accidentally merged into the management app so the management portal remains focused and lightweight.

---

### External Website (`website/` & Backend Integration)

#### [MODIFY] [index.html](file:///d:/New%20folder%20(2)/website/index.html)
- Implement the complete standalone external website based on the provided skeleton and Image 2 specifications:
  - **Dynamic View Routing**: Clean navigation supporting `#top` (Home), `#/academy`, `#/technologies`, `#/innovation-lab`, `#/startups`, `#/for-business`, `#/for-institutions`, `#/events`, `#/success-stories`, `#/about`.
  - **Home Section**:
    - Hero with tagline and badges
    - 3D Interactive Ring Carousel of the 5 Businesses (OD AI Academy, OD AI Technologies, OD AI Innovation Lab, OD AI Startup Ecosystem, For Business) with drag-to-spin and click-to-bring-forward
    - Animated stats counters
    - About section with Berhampur map and "Why OD AI HUB"
    - Student success stories & CTA
  - **Separate Academy Section (`#/academy`)**:
    - Academy hero with stats strip
    - 6-Category 3D Interactive Ring (School Programs, Diploma Programs, College Programs, Non-Tech Programs, Internships & Industry Projects, Career & Placement Support)
    - **Interactive Program Catalog**:
      - Triggered seamlessly when clicking "Explore" on any 3D ring card
      - Displays the courses for that selected program
      - College Programs include degree filter chips (`All`, `B.Tech`, `BCA`, `B.Sc`, `MCA`, `M.Sc`)
      - Search filter & mode filter (`All`, `Online`, `Offline`, `Hybrid`)
      - Back button to return to the 3D ring
      - Course cards with badges, metadata, description, and "Enquire" action
  - **Other Sections from Image 2**:
    - `#/technologies`: AI Solutions, Software Development, Cloud & DevOps, Business Automation, Enterprise Solutions, Case Studies
    - `#/innovation-lab`: Artificial Intelligence, Robotics & IoT, Smart Campus, Agritech, Healthcare, Smart City, Industry 4.0
    - `#/startups`: Startup Programs, Hackathons, Mentorship, Incubation Partners, Investor Connect
    - `#/for-business`: AI Automation, Software Solutions, Digital Transformation, Cloud & DevOps, Technology Consulting
    - `#/for-institutions`: Colleges (Student Training, Internship Programs, Final Year Projects, Faculty Development, Hackathons) & Schools (AI Programs, Coding Programs, Robotics Programs, Innovation Labs)
    - `#/events`: Workshops, Hackathons, Demo Classes, Seminars
    - `#/success-stories`: Students, Startups, Business, Institutions
    - `#/about` & Other Pages: Team, Careers, Contact, Verification, Policies
  - **Enquiry Modal**:
    - Sends data to `POST /api/v1/enquiries`
    - Stored in `edutrack.db` and immediately visible in Management Console under "Learner Enquiries"
  - **API & Live Backend Sync**:
    - Connects to `/api/v1/academy/categories`, `/api/v1/academy/categories/{slug}/courses`, `/api/v1/stats`, `/api/v1/testimonials`, `/api/v1/website/pillars`, etc.
    - Robust offline/fallback data bundled so the website displays instantly and smoothly even if offline or reloading.

#### [MODIFY] [academy.html](file:///d:/New%20folder%20(2)/website/academy.html)
- Ensure direct access to `/academy` renders the dedicated Academy view with the 3D ring and course catalog.

#### [MODIFY] [backend/app/main.py](file:///d:/New%20folder%20(2)/backend/app/main.py)
- Ensure routes (`/`, `/academy`, `/technologies`, `/innovation-lab`, `/startups`, `/for-business`, `/for-institutions`, `/events`, `/success-stories`, `/about`) are properly served by FastAPI to the external website.

---

## Verification Plan

### Automated & API Verification
- Run Python verification script to test:
  - `GET /api/v1/academy/categories` returns 6 categories
  - `GET /api/v1/academy/categories/college/courses` returns college courses
  - `GET /api/v1/website/pillars` returns 7 pillars with their sections
  - `POST /api/v1/enquiries` accepts and stores a new enquiry in database

### Browser Verification
- Open Management Website (`http://localhost:3000`):
  - Verify navbar has NO duplicate "Coaching" or "Problem Statements"
  - Verify "Programs v" is removed from the management navbar
  - Verify Management Console (`/management`) still has all tabs for managing institutions, college courses, AND external website academy courses/pillars
- Open External Website (`http://localhost:8000/`):
  - Verify Home page with 5-pillar 3D ring
  - Navigate to Academy (`#/academy`), verify 6-category 3D ring
  - Click "Explore" on "School Programs" -> verify it displays only School courses
  - Click "Explore" on "College Programs" -> verify College courses with degree chips
  - Click "Back to all programs" -> smoothly returns to 3D ring
  - Navigate to Technologies, Innovation Lab, Startups, For Business, For Institutions, Events, Success Stories -> verify all sections from Image 2
  - Submit an enquiry -> check Management Console (`http://localhost:3000/management?tab=enquiries`) to verify the enquiry appears
