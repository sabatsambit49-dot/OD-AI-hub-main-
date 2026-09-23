from app.database.session import SessionLocal
from app.models import (
    Pillar, PillarSection, Offering, InstitutionAudience,
    PublicEvent, EventRegistration, SuccessStory, BlogPost,
    Certificate, StaticPage, TeamMember, JobListing, FooterLink, NavbarItem
)
from datetime import datetime, timedelta


def seed_data():
    db = SessionLocal()

    try:
        # Check if data already exists
        existing_pillars = db.query(Pillar).count()
        if existing_pillars > 0:
            print("Seed data already exists, skipping...")
            return

        # ==================== PILLARS ====================
        pillars_data = [
            {
                "slug": "technologies",
                "name": "Technologies",
                "tagline": "Cutting-edge AI solutions and emerging technologies",
                "description": "Explore our comprehensive technology programs covering AI, ML, cloud computing, and software development.",
                "accent_color": "#00c060",
                "icon": "AI",
                "hero_image_url": "/images/technologies-hero.jpg",
                "display_order": 1,
                "status": "published"
            },
            {
                "slug": "innovation-lab",
                "name": "Innovation Lab",
                "tagline": "Where ideas become reality",
                "description": "Our innovation lab focuses on cutting-edge research in robotics, IoT, smart cities, and healthcare technology.",
                "accent_color": "#ff6a00",
                "icon": "LAB",
                "hero_image_url": "/images/innovation-lab-hero.jpg",
                "display_order": 2,
                "status": "published"
            },
            {
                "slug": "startups",
                "name": "Startups",
                "tagline": "Fueling the next generation of entrepreneurs",
                "description": "Incubation programs, mentorship, funding connections, and hackathons for aspiring founders.",
                "accent_color": "#8a2be2",
                "icon": "STARTUP",
                "hero_image_url": "/images/startups-hero.jpg",
                "display_order": 3,
                "status": "published"
            },
            {
                "slug": "for-business",
                "name": "For Business",
                "tagline": "Enterprise AI solutions and digital transformation",
                "description": "Custom AI solutions, consulting, and digital transformation services for enterprises.",
                "accent_color": "#e60026",
                "icon": "BIZ",
                "hero_image_url": "/images/for-business-hero.jpg",
                "display_order": 4,
                "status": "published"
            },
            {
                "slug": "for-institutions",
                "name": "For Institutions",
                "tagline": "Empowering educational institutions",
                "description": "Training programs, internships, and faculty development for colleges and schools.",
                "accent_color": "#0f766e",
                "icon": "EDU",
                "hero_image_url": "/images/for-institutions-hero.jpg",
                "display_order": 5,
                "status": "published"
            },
            {
                "slug": "events",
                "name": "Events",
                "tagline": "Workshops, hackathons, and community gatherings",
                "description": "Join our community events, workshops, hackathons, and seminars.",
                "accent_color": "#d97706",
                "icon": "EVT",
                "hero_image_url": "/images/events-hero.jpg",
                "display_order": 6,
                "status": "published"
            },
            {
                "slug": "success-stories",
                "name": "Success Stories",
                "tagline": "Real impact, real people",
                "description": "Discover how OD AI HUB has transformed careers and organizations.",
                "accent_color": "#3b5bdb",
                "icon": "STAR",
                "hero_image_url": "/images/success-stories-hero.jpg",
                "display_order": 7,
                "status": "published"
            }
        ]

        pillars = []
        for p_data in pillars_data:
            pillar = Pillar(**p_data)
            db.add(pillar)
            pillars.append(pillar)
        db.flush()
        print(f"Created {len(pillars)} pillars")

        # ==================== INSTITUTION AUDIENCES ====================
        audiences_data = [
            {
                "slug": "colleges",
                "title": "Colleges & Universities",
                "description": "Programs designed for higher education institutions",
                "image_url": "/images/colleges-audience.jpg",
                "display_order": 1,
                "is_active": True
            },
            {
                "slug": "schools",
                "title": "Schools",
                "description": "Programs designed for K-12 educational institutions",
                "image_url": "/images/schools-audience.jpg",
                "display_order": 2,
                "is_active": True
            }
        ]

        audiences = []
        for a_data in audiences_data:
            audience = InstitutionAudience(**a_data)
            db.add(audience)
            audiences.append(audience)
        db.flush()
        print(f"Created {len(audiences)} institution audiences")

        # Map pillars by slug for easy reference
        pillar_map = {p.slug: p for p in pillars}
        audience_map = {a.slug: a for a in audiences}

        # ==================== PILLAR SECTIONS ====================
        sections_data = [
            # Technologies sections
            {"pillar_id": pillar_map["technologies"].id, "slug": "ai-solutions", "title": "AI Solutions", "description": "Custom AI model development and deployment", "accent_color": "#00c060", "icon": "BRAIN", "display_order": 1, "status": "published"},
            {"pillar_id": pillar_map["technologies"].id, "slug": "software-development", "title": "Software Development", "description": "Full-stack development and DevOps practices", "accent_color": "#00c060", "icon": "CODE", "display_order": 2, "status": "published"},
            {"pillar_id": pillar_map["technologies"].id, "slug": "cloud-devops", "title": "Cloud & DevOps", "description": "Cloud architecture and DevOps automation", "accent_color": "#00c060", "icon": "CLOUD", "display_order": 3, "status": "published"},
            {"pillar_id": pillar_map["technologies"].id, "slug": "business-automation", "title": "Business Automation", "description": "RPA and workflow automation solutions", "accent_color": "#00c060", "icon": "GEAR", "display_order": 4, "status": "published"},
            {"pillar_id": pillar_map["technologies"].id, "slug": "enterprise-solutions", "title": "Enterprise Solutions", "description": "Scalable enterprise software solutions", "accent_color": "#00c060", "icon": "BUILDING", "display_order": 5, "status": "published"},
            {"pillar_id": pillar_map["technologies"].id, "slug": "case-studies", "title": "Case Studies", "description": "Real-world technology implementations", "accent_color": "#00c060", "icon": "CHART", "display_order": 6, "status": "published"},

            # Innovation Lab sections
            {"pillar_id": pillar_map["innovation-lab"].id, "slug": "artificial-intelligence", "title": "Artificial Intelligence", "description": "Advanced AI research and applications", "accent_color": "#ff6a00", "icon": "ROBOT", "display_order": 1, "status": "published"},
            {"pillar_id": pillar_map["innovation-lab"].id, "slug": "robotics-iot", "title": "Robotics & IoT", "description": "Robotics and Internet of Things innovations", "accent_color": "#ff6a00", "icon": "ROBOT", "display_order": 2, "status": "published"},
            {"pillar_id": pillar_map["innovation-lab"].id, "slug": "smart-campus", "title": "Smart Campus", "description": "Intelligent campus solutions", "accent_color": "#ff6a00", "icon": "SCHOOL", "display_order": 3, "status": "published"},
            {"pillar_id": pillar_map["innovation-lab"].id, "slug": "agritech", "title": "Agritech", "description": "Technology solutions for agriculture", "accent_color": "#ff6a00", "icon": "SEEDLING", "display_order": 4, "status": "published"},
            {"pillar_id": pillar_map["innovation-lab"].id, "slug": "healthcare", "title": "Healthcare", "description": "Medical technology innovations", "accent_color": "#ff6a00", "icon": "HOSPITAL", "display_order": 5, "status": "published"},
            {"pillar_id": pillar_map["innovation-lab"].id, "slug": "smart-city", "title": "Smart City", "description": "Urban technology solutions", "accent_color": "#ff6a00", "icon": "CITY", "display_order": 6, "status": "published"},
            {"pillar_id": pillar_map["innovation-lab"].id, "slug": "industry-4-0", "title": "Industry 4.0", "description": "Fourth industrial revolution technologies", "accent_color": "#ff6a00", "icon": "FACTORY", "display_order": 7, "status": "published"},

            # Startups sections
            {"pillar_id": pillar_map["startups"].id, "slug": "startup-programs", "title": "Startup Programs", "description": "Acceleration and incubation programs", "accent_color": "#8a2be2", "icon": "ROCKET", "display_order": 1, "status": "published"},
            {"pillar_id": pillar_map["startups"].id, "slug": "hackathons", "title": "Hackathons", "description": "Coding competitions and innovation challenges", "accent_color": "#8a2be2", "icon": "TROPHY", "display_order": 2, "status": "published"},
            {"pillar_id": pillar_map["startups"].id, "slug": "mentorship", "title": "Mentorship", "description": "Expert guidance for founders", "accent_color": "#8a2be2", "icon": "TEACHER", "display_order": 3, "status": "published"},
            {"pillar_id": pillar_map["startups"].id, "slug": "incubation-partners", "title": "Incubation Partners", "description": "Partner incubators and accelerators", "accent_color": "#8a2be2", "icon": "HANDSHAKE", "display_order": 4, "status": "published"},
            {"pillar_id": pillar_map["startups"].id, "slug": "investor-connect", "title": "Investor Connect", "description": "Connect with venture capitalists", "accent_color": "#8a2be2", "icon": "MONEY", "display_order": 5, "status": "published"},

            # For Business sections
            {"pillar_id": pillar_map["for-business"].id, "slug": "ai-automation", "title": "AI Automation", "description": "Intelligent process automation", "accent_color": "#e60026", "icon": "ROBOT", "display_order": 1, "status": "published"},
            {"pillar_id": pillar_map["for-business"].id, "slug": "software-solutions", "title": "Software Solutions", "description": "Custom enterprise software", "accent_color": "#e60026", "icon": "CODE", "display_order": 2, "status": "published"},
            {"pillar_id": pillar_map["for-business"].id, "slug": "digital-transformation", "title": "Digital Transformation", "description": "Enterprise digital transformation", "accent_color": "#e60026", "icon": "REFRESH", "display_order": 3, "status": "published"},
            {"pillar_id": pillar_map["for-business"].id, "slug": "biz-cloud-devops", "title": "Cloud & DevOps", "description": "Cloud infrastructure and DevOps", "accent_color": "#e60026", "icon": "CLOUD", "display_order": 4, "status": "published"},
            {"pillar_id": pillar_map["for-business"].id, "slug": "technology-consulting", "title": "Technology Consulting", "description": "Strategic technology advisory", "accent_color": "#e60026", "icon": "TARGET", "display_order": 5, "status": "published"},

            # For Institutions sections (linked to audiences)
            {"pillar_id": pillar_map["for-institutions"].id, "audience_id": None, "slug": "college-student-training", "title": "Student Training", "description": "Technical training programs for students", "accent_color": "#0f766e", "icon": "GRADUATION", "display_order": 1, "status": "published"},
            {"pillar_id": pillar_map["for-institutions"].id, "audience_id": None, "slug": "college-internship-programs", "title": "Internship Programs", "description": "Industry internship opportunities", "accent_color": "#0f766e", "icon": "BRIEFCASE", "display_order": 2, "status": "published"},
            {"pillar_id": pillar_map["for-institutions"].id, "slug": "college-final-year-projects", "title": "Final Year Projects", "description": "Guided capstone projects", "accent_color": "#0f766e", "icon": "FILE", "display_order": 3, "status": "published"},
            {"pillar_id": pillar_map["for-institutions"].id, "slug": "college-faculty-development", "title": "Faculty Development", "description": "Upskilling programs for educators", "accent_color": "#0f766e", "icon": "TEACHER", "display_order": 3, "status": "published"},
            {"pillar_id": pillar_map["for-institutions"].id, "slug": "college-hackathons", "title": "Hackathons", "description": "Inter-college hackathons", "accent_color": "#0f766e", "icon": "TROPHY", "display_order": 4, "status": "published"},
            {"pillar_id": pillar_map["for-institutions"].id, "audience_id": None, "slug": "school-ai-programs", "title": "AI Programs", "description": "AI curriculum for schools", "accent_color": "#0f766e", "icon": "ROBOT", "display_order": 1, "status": "published"},
            {"pillar_id": pillar_map["for-institutions"].id, "slug": "school-coding-programs", "title": "Coding Programs", "description": "Programming courses for students", "accent_color": "#0f766e", "icon": "CODE", "display_order": 2, "status": "published"},
            {"pillar_id": pillar_map["for-institutions"].id, "slug": "school-robotics-programs", "title": "Robotics Programs", "description": "Hands-on robotics education", "accent_color": "#0f766e", "icon": "ROBOT", "display_order": 3, "status": "published"},
            {"pillar_id": pillar_map["for-institutions"].id, "slug": "school-innovation-labs", "title": "Innovation Labs", "description": "School innovation lab setup", "accent_color": "#0f766e", "icon": "FLASK", "display_order": 3, "status": "published"},

            # Events sections
            {"pillar_id": pillar_map["events"].id, "slug": "event-workshops", "title": "Workshops", "description": "Hands-on technical workshops", "accent_color": "#d97706", "icon": "WRENCH", "display_order": 1, "status": "published"},
            {"pillar_id": pillar_map["events"].id, "slug": "event-hackathons", "title": "Hackathons", "description": "Coding competitions", "accent_color": "#d97706", "icon": "TROPHY", "display_order": 2, "status": "published"},
            {"pillar_id": pillar_map["events"].id, "slug": "demo-classes", "title": "Demo Classes", "description": "Free demo sessions", "accent_color": "#d97706", "icon": "GRADUATION", "display_order": 3, "status": "published"},
            {"pillar_id": pillar_map["events"].id, "slug": "seminars", "title": "Seminars", "description": "Expert talks and seminars", "accent_color": "#d97706", "icon": "MEGAPHONE", "display_order": 4, "status": "published"},

            # Success Stories sections
            {"pillar_id": pillar_map["success-stories"].id, "slug": "students", "title": "Student Success", "description": "Student success stories", "accent_color": "#3b5bdb", "icon": "GRADUATION", "display_order": 1, "status": "published"},
            {"pillar_id": pillar_map["success-stories"].id, "slug": "startups", "title": "Startup Success", "description": "Startup founder stories", "accent_color": "#3b5bdb", "icon": "ROCKET", "display_order": 2, "status": "published"},
            {"pillar_id": pillar_map["success-stories"].id, "slug": "business", "title": "Business Impact", "description": "Enterprise transformation stories", "accent_color": "#3b5bdb", "icon": "BUILDING", "display_order": 3, "status": "published"},
            {"pillar_id": pillar_map["success-stories"].id, "slug": "institutions", "title": "Institution Success", "description": "Institutional transformation", "accent_color": "#3b5bdb", "icon": "SCHOOL", "display_order": 3, "status": "published"},
        ]

        sections = []
        for s_data in sections_data:
            section = PillarSection(**s_data)
            db.add(section)
            sections.append(section)
        db.flush()
        print(f"Created {len(sections)} pillar sections")

        # Map sections by slug
        section_map = {s.slug: s for s in sections}

        # ==================== OFFERINGS ====================
        offerings_data = [
            # AI Solutions offerings
            {"pillar_section_id": None, "title": "Custom AI Model Development", "short_description": "End-to-end custom AI model development", "full_description": "We build custom AI models tailored to your specific business needs.", "highlights": ["Custom model architecture", "Training & optimization", "Deployment & monitoring", "Ongoing support"], "image_url": "/images/offerings/custom-ai.jpg", "is_featured": True, "display_order": 1, "status": "published"},
            {"pillar_section_id": None, "title": "AI Consulting", "short_description": "Strategic AI consulting services", "full_description": "Expert guidance on AI strategy and implementation.", "highlights": ["Strategy assessment", "Roadmap development", "Team training", "Implementation support"], "image_url": "/images/offerings/ai-consulting.jpg", "is_featured": False, "display_order": 2, "status": "published"},

            # Software Development offerings
            {"pillar_section_id": None, "title": "Full-Stack Development", "short_description": "End-to-end software development", "full_description": "Complete software development lifecycle.", "highlights": ["Frontend & backend", "API development", "Testing & QA", "CI/CD setup"], "image_url": "/images/offerings/fullstack.jpg", "is_featured": True, "display_order": 1, "status": "published"},

            # Cloud & DevOps offerings (For Business)
            {"pillar_section_id": None, "title": "Cloud Migration", "short_description": "Seamless cloud migration for enterprises", "full_description": "Enterprise cloud migration with zero downtime.", "highlights": ["Assessment & planning", "Migration execution", "Optimization", "Cost management"], "image_url": "/images/offerings/biz-cloud-migration.jpg", "is_featured": True, "display_order": 1, "status": "published"},

            # Business Automation offerings
            {"pillar_section_id": None, "title": "RPA Implementation", "short_description": "Robotic Process Automation", "full_description": "Automate repetitive business processes with RPA.", "highlights": ["Process analysis", "Bot development", "Deployment", "Monitoring"], "image_url": "/images/offerings/rpa.jpg", "is_featured": True, "display_order": 1, "status": "published"},

            # Enterprise Solutions offerings
            {"pillar_section_id": None, "title": "ERP Solutions", "short_description": "Enterprise Resource Planning", "full_description": "Comprehensive ERP implementation and customization.", "highlights": ["Requirements analysis", "Customization", "Integration", "Training"], "image_url": "/images/offerings/erp.jpg", "is_featured": True, "display_order": 1, "status": "published"},

            # Case Studies offerings
            {"pillar_section_id": None, "title": "Client Success Stories", "short_description": "Real-world implementations", "full_description": "Detailed case studies of our successful projects.", "highlights": ["Before & after metrics", "Technical details", "Client testimonials", "ROI analysis"], "image_url": "/images/offerings/case-studies.jpg", "is_featured": False, "display_order": 1, "status": "published"},

            # Innovation Lab offerings (sample)
            {"pillar_section_id": None, "title": "AI Research Partnership", "short_description": "Collaborative AI research", "full_description": "Partner with our AI research team.", "highlights": ["Joint research", "Paper publication", "IP sharing", "Grant funding"], "image_url": "/images/offerings/ai-research.jpg", "is_featured": True, "display_order": 1, "status": "published"},

            # Startup offerings
            {"pillar_section_id": None, "title": "Incubation Program", "short_description": "3-month incubation program", "full_description": "Comprehensive startup incubation with funding.", "highlights": ["Seed funding", "Mentorship", "Office space", "Demo day"], "image_url": "/images/offerings/incubation.jpg", "is_featured": True, "display_order": 1, "status": "published"},

            # Events offerings
            {"pillar_section_id": None, "title": "AI Workshop Series", "short_description": "Hands-on AI workshops", "full_description": "Learn AI fundamentals and advanced topics.", "highlights": ["Hands-on coding", "Expert instructors", "Certificate", "Community access"], "image_url": "/images/offerings/ai-workshop.jpg", "is_featured": True, "display_order": 1, "status": "published"},

            # Success Stories offerings
            {"pillar_section_id": None, "title": "Student Placement Program", "short_description": "Career placement support", "full_description": "Help students land their dream jobs.", "highlights": ["Resume building", "Interview prep", "Job matching", "Alumni network"], "image_url": "/images/offerings/placement.jpg", "is_featured": True, "display_order": 1, "status": "published"},
        ]

        for o_data in offerings_data:
            offering = Offering(**o_data)
            db.add(offering)
        db.flush()
        print(f"Created {len(offerings_data)} offerings")

        # ==================== EVENTS ====================
        events_data = [
            {
                "slug": "ai-workshop-march-2024",
                "title": "AI Fundamentals Workshop",
                "type": "workshop",
                "description": "Learn the fundamentals of AI and machine learning in this hands-on workshop.",
                "event_date": datetime.now() + timedelta(days=30),
                "mode": "hybrid",
                "location": "Bhubaneswar, Odisha / Online",
                "registration_open": True,
                "image_url": "/images/events/ai-workshop.jpg",
                "status": "published",
                "display_order": 1
            },
            {
                "slug": "hackathon-2024",
                "title": "OD AI HUB Hackathon 2024",
                "type": "hackathon",
                "description": "48-hour coding challenge with prizes worth 10 lakhs.",
                "event_date": datetime.now() + timedelta(days=60),
                "mode": "hybrid",
                "location": "Bhubaneswar, Odisha / Online",
                "registration_open": True,
                "image_url": "/images/events/hackathon-2024.jpg",
                "status": "published",
                "display_order": 2
            },
            {
                "slug": "demo-class-ai",
                "title": "Free AI Demo Class",
                "type": "demo_class",
                "description": "Free introductory class on AI fundamentals.",
                "event_date": datetime.now() + timedelta(days=15),
                "mode": "online",
                "location": "Online",
                "registration_open": True,
                "image_url": "/images/events/demo-class.jpg",
                "status": "published",
                "display_order": 3
            },
            {
                "slug": "tech-seminar-2024",
                "title": "Future of AI Seminar",
                "type": "seminar",
                "description": "Expert talks on the future of artificial intelligence.",
                "event_date": datetime.now() + timedelta(days=45),
                "mode": "hybrid",
                "location": "Bhubaneswar, Odisha / Online",
                "registration_open": True,
                "image_url": "/images/events/seminar.jpg",
                "status": "published",
                "display_order": 4
            }
        ]

        events = []
        for e_data in events_data:
            event = PublicEvent(**e_data)
            db.add(event)
            events.append(event)
        db.flush()
        print(f"Created {len(events)} events")

        # ==================== EVENT REGISTRATIONS ====================
        registrations_data = [
            {"event_id": events[0].id, "name": "Rahul Sharma", "phone": "+91 98765 43210", "email": "rahul@example.com", "organization": "TechCorp", "status": "registered"},
            {"event_id": events[0].id, "name": "Priya Patel", "phone": "+91 87654 32109", "email": "priya@example.com", "organization": "Student", "status": "registered"},
            {"event_id": events[1].id, "name": "Amit Kumar", "phone": "+91 76543 21098", "email": "amit@example.com", "organization": "StartupXYZ", "status": "registered"},
        ]

        for r_data in registrations_data:
            reg = EventRegistration(**r_data)
            db.add(reg)
        db.flush()
        print(f"Created {len(registrations_data)} event registrations")

        # ==================== SUCCESS STORIES ====================
        stories_data = [
            {
                "category": "student",
                "name": "Priya Sharma",
                "role_or_organization": "B.Tech Student, IIIT Bhubaneswar",
                "photo_url": "/images/stories/priya.jpg",
                "quote": "The AI workshop at OD AI HUB transformed my understanding of machine learning. I landed an internship at a top tech company!",
                "outcome": "Secured internship at Google",
                "is_published": True,
                "display_order": 1
            },
            {
                "category": "startup",
                "name": "Rajesh Kumar",
                "role_or_organization": "Founder, AgriTech Solutions",
                "photo_url": "/images/stories/rajesh.jpg",
                "quote": "The incubation program gave us the mentorship and funding we needed to scale our agritech startup.",
                "outcome": "Raised 50L seed funding",
                "is_published": True,
                "display_order": 1
            },
            {
                "category": "business",
                "name": "TechCorp Industries",
                "role_or_organization": "Enterprise Client",
                "photo_url": "/images/stories/techcorp.jpg",
                "quote": "OD AI HUB's AI automation solution reduced our operational costs by 40% and improved efficiency.",
                "outcome": "40% cost reduction, 3x efficiency",
                "is_published": True,
                "display_order": 1
            },
            {
                "category": "institution",
                "name": "IIIT Bhubaneswar",
                "role_or_organization": "Academic Partner",
                "photo_url": "/images/stories/iiit.jpg",
                "quote": "The faculty development program helped our professors stay current with AI advancements.",
                "outcome": "50+ faculty trained, new AI curriculum launched",
                "is_published": True,
                "display_order": 1
            }
        ]

        for s_data in stories_data:
            story = SuccessStory(**s_data)
            db.add(story)
        db.flush()
        print(f"Created {len(stories_data)} success stories")

        # ==================== BLOG POSTS ====================
        blog_data = [
            {
                "slug": "future-of-ai-education",
                "title": "The Future of AI Education in India",
                "excerpt": "Exploring how AI is transforming the educational landscape across Indian institutions.",
                "body": "<p>Artificial Intelligence is rapidly transforming every sector...</p><h2>The Current Landscape</h2><p>India's education system is at a crossroads...</p><h2>OD AI HUB's Role</h2><p>We are at the forefront of this transformation...</p>",
                "cover_image_url": "/images/blog/future-ai-education.jpg",
                "published_at": datetime.now() - timedelta(days=10),
                "status": "published",
                "display_order": 1
            },
            {
                "slug": "ai-startup-success-stories",
                "title": "5 Indian AI Startups That Made It Big",
                "excerpt": "Inspiring stories of Indian AI startups that achieved global recognition.",
                "body": "<p>India's AI startup ecosystem is booming...</p><h2>1. AgriTech Solutions</h2><p>Founded by IIT graduates...</p><h2>2. HealthAI</h2><p>Revolutionizing healthcare...</p>",
                "cover_image_url": "/images/blog/ai-startups.jpg",
                "published_at": datetime.now() - timedelta(days=5),
                "status": "published",
                "display_order": 2
            },
            {
                "slug": "ai-in-education-case-study",
                "title": "Case Study: AI in Rural Education",
                "excerpt": "How AI is bridging the educational divide in rural India.",
                "body": "<p>Rural India faces unique educational challenges...</p><h2>The Challenge</h2><p>Lack of qualified teachers...</p><h2>The AI Solution</h2><p>Personalized learning platforms...</p>",
                "cover_image_url": "/images/blog/rural-education.jpg",
                "published_at": datetime.now() - timedelta(days=2),
                "status": "published",
                "display_order": 3
            }
        ]

        for b_data in blog_data:
            blog = BlogPost(**b_data)
            db.add(blog)
        db.flush()
        print(f"Created {len(blog_data)} blog posts")

        # ==================== CERTIFICATES ====================
        certs_data = [
            {"certificate_id": "ODAI-2024-001", "holder_name": "Priya Sharma", "program": "AI Fundamentals Workshop", "issued_on": datetime.now() - timedelta(days=5)},
            {"certificate_id": "ODAI-2024-002", "holder_name": "Rahul Kumar", "program": "AI Fundamentals Workshop", "issued_on": datetime.now() - timedelta(days=5)},
            {"certificate_id": "ODAI-2024-003", "holder_name": "Amit Patel", "program": "Full-Stack Development Course", "issued_on": datetime.now() - timedelta(days=30)},
        ]

        for c_data in certs_data:
            cert = Certificate(**c_data)
            db.add(cert)
        db.flush()
        print(f"Created {len(certs_data)} certificates")

        # ==================== STATIC PAGES ====================
        static_pages_data = [
            {
                "slug": "about",
                "title": "About OD AI HUB",
                "body_blocks": [
                    {"type": "heading", "content": "About OD AI HUB"},
                    {"type": "paragraph", "content": "OD AI HUB is a premier technology hub dedicated to advancing artificial intelligence education, research, and innovation in India. Founded with the vision of democratizing AI education, we bridge the gap between academic learning and industry requirements."},
                    {"type": "heading", "content": "Our Mission"},
                    {"type": "paragraph", "content": "To democratize access to world-class AI education and empower the next generation of innovators, entrepreneurs, and technology leaders."},
                    {"type": "heading", "content": "Our Vision"},
                    {"type": "paragraph", "content": "A world where everyone has access to cutting-edge AI education and the tools to build transformative technology solutions."},
                    {"type": "heading", "content": "Our Values"},
                    {"type": "list", "content": "Innovation First\nAccessibility\nExcellence\nCollaboration\nIntegrity"},
                ]
            },
            {
                "slug": "contact",
                "title": "Contact Us",
                "body_blocks": [
                    {"type": "heading", "content": "Get in Touch"},
                    {"type": "paragraph", "content": "We'd love to hear from you. Whether you have a question about our programs, want to partner with us, or just want to say hello."},
                    {"type": "heading", "content": "Contact Information"},
                    {"type": "list", "content": "Email: hello@odaihub.in\nPhone: +91 98765 43210\nAddress: Bhubaneswar, Odisha, India\nHours: Mon-Fri 9 AM - 6 PM IST"},
                ]
            },
            {
                "slug": "privacy-policy",
                "title": "Privacy Policy",
                "body_blocks": [
                    {"type": "heading", "content": "Privacy Policy"},
                    {"type": "paragraph", "content": "This Privacy Policy governs your use of OD AI HUB's website, services, and programs. By accessing or using our services, you agree to be bound by this Privacy Policy."},
                    {"type": "heading", "content": "Information We Collect"},
                    {"type": "paragraph", "content": "We collect information you provide directly to us, such as when you register for courses, submit enquiries, register for events, or contact us."},
                    {"type": "heading", "content": "How We Use Your Information"},
                    {"type": "paragraph", "content": "We use your information to provide and improve our courses and services, communicate with you about your enrollments and enquiries, send updates about new courses, events, and offerings, process payments, and comply with legal obligations."},
                    {"type": "heading", "content": "Data Security"},
                    {"type": "paragraph", "content": "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction."},
                    {"type": "heading", "content": "Contact Us"},
                    {"type": "paragraph", "content": "If you have any questions about this Privacy Policy, please contact us at privacy@odaihub.in or +91 98765 43210."},
                ]
            },
            {
                "slug": "refund-policy",
                "title": "Refund Policy",
                "body_blocks": [
                    {"type": "heading", "content": "Refund Policy"},
                    {"type": "paragraph", "content": "Our refund policy applies to all courses, workshops, and events purchased through OD AI HUB."},
                    {"type": "heading", "content": "Eligibility"},
                    {"type": "paragraph", "content": "Refunds are available if requested within 7 days of purchase and before accessing more than 20% of the course content."},
                    {"type": "heading", "content": "Process"},
                    {"type": "paragraph", "content": "To request a refund, contact support@odaihub.in with your order details. Refunds are processed within 7-10 business days."},
                    {"type": "heading", "content": "Exceptions"},
                    {"type": "paragraph", "content": "No refunds for completed courses, downloaded materials, or events that have already occurred."},
                ]
            },
            {
                "slug": "terms",
                "title": "Terms of Service",
                "body_blocks": [
                    {"type": "heading", "content": "Terms of Service"},
                    {"type": "paragraph", "content": "These Terms of Service govern your use of OD AI HUB's website, services, and programs. By accessing or using our services, you agree to be bound by these Terms."},
                    {"type": "heading", "content": "User Responsibilities"},
                    {"type": "paragraph", "content": "You agree to provide accurate information, not share accounts, and use services for lawful purposes only."},
                    {"type": "heading", "content": "Intellectual Property"},
                    {"type": "paragraph", "content": "All content, materials, and intellectual property on our platform are owned by OD AI HUB or our licensors."},
                    {"type": "heading", "content": "Limitation of Liability"},
                    {"type": "paragraph", "content": "OD AI HUB is not liable for indirect, incidental, or consequential damages arising from use of our services."},
                    {"type": "heading", "content": "Contact Us"},
                    {"type": "paragraph", "content": "Questions about these Terms? Contact us at legal@odaihub.in."},
                ]
            }
        ]

        for p_data in static_pages_data:
            page = StaticPage(**p_data)
            db.add(page)
        db.flush()
        print(f"Created {len(static_pages_data)} static pages")

        # ==================== TEAM MEMBERS ====================
        team_data = [
            {"name": "Dr. Anil Kumar", "role": "Founder & CEO", "photo_url": "/images/team/anil.jpg", "bio": "AI researcher and entrepreneur with 20+ years of experience in AI and education.", "display_order": 1, "status": "published"},
            {"name": "Priya Nair", "role": "CTO", "photo_url": "/images/team/priya.jpg", "bio": "Technology leader with expertise in AI/ML systems and cloud architecture.", "display_order": 2, "status": "published"},
            {"name": "Rajesh Mohanty", "role": "Head of Education", "photo_url": "/images/team/rajesh.jpg", "bio": "Education specialist with 15+ years in curriculum design and EdTech.", "display_order": 3, "status": "published"},
        ]

        for t_data in team_data:
            member = TeamMember(**t_data)
            db.add(member)
        db.flush()
        print(f"Created {len(team_data)} team members")

        # ==================== JOB LISTINGS ====================
        jobs_data = [
            {"title": "Senior AI Engineer", "department": "Engineering", "location": "Bhubaneswar / Remote", "type": "full-time", "description": "Build scalable AI/ML systems. Requires 5+ years experience in ML engineering.", "is_open": True, "display_order": 1},
            {"title": "Curriculum Designer", "department": "Education", "location": "Bhubaneswar", "type": "full-time", "description": "Design AI/ML curriculum for students and professionals. EdTech experience preferred.", "is_open": True, "display_order": 2},
            {"title": "Marketing Intern", "department": "Marketing", "location": "Bhubaneswar / Remote", "type": "internship", "description": "Support digital marketing campaigns. Stipend provided.", "is_open": True, "display_order": 3},
        ]

        for j_data in jobs_data:
            job = JobListing(**j_data)
            db.add(job)
        db.flush()
        print(f"Created {len(jobs_data)} job listings")

        # ==================== FOOTER LINKS ====================
        footer_links_data = [
            {"group_label": "Quick Links", "label": "Home", "url": "/", "display_order": 1, "is_active": True},
            {"group_label": "Quick Links", "label": "About Us", "url": "/about", "display_order": 2, "is_active": True},
            {"group_label": "Quick Links", "label": "Courses", "url": "/course-matrix", "display_order": 3, "is_active": True},
            {"group_label": "Quick Links", "label": "Events", "url": "/events", "display_order": 4, "is_active": True},
            {"group_label": "Quick Links", "label": "Blog", "url": "/blog", "display_order": 5, "is_active": True},
            {"group_label": "Quick Links", "label": "Careers", "url": "/careers", "display_order": 6, "is_active": True},
            {"group_label": "Quick Links", "label": "Contact", "url": "/contact", "display_order": 7, "is_active": True},
            {"group_label": "Programs", "label": "Technologies", "url": "/technologies", "display_order": 1, "is_active": True},
            {"group_label": "Programs", "label": "Innovation Lab", "url": "/innovation-lab", "display_order": 2, "is_active": True},
            {"group_label": "Programs", "label": "Startups", "url": "/startups", "display_order": 3, "is_active": True},
            {"group_label": "Programs", "label": "For Business", "url": "/for-business", "display_order": 4, "is_active": True},
            {"group_label": "Programs", "label": "For Institutions", "url": "/for-institutions", "display_order": 5, "is_active": True},
            {"group_label": "Support", "label": "Contact Us", "url": "/contact", "display_order": 1, "is_active": True},
            {"group_label": "Support", "label": "FAQs", "url": "/faq", "display_order": 2, "is_active": True},
            {"group_label": "Support", "label": "Help Center", "url": "/help", "display_order": 3, "is_active": True},
            {"group_label": "Legal", "label": "Privacy Policy", "url": "/privacy-policy", "display_order": 1, "is_active": True},
            {"group_label": "Legal", "label": "Refund Policy", "url": "/refund-policy", "display_order": 2, "is_active": True},
            {"group_label": "Legal", "label": "Terms of Service", "url": "/terms", "display_order": 3, "is_active": True},
            {"group_label": "Connect", "label": "LinkedIn", "url": "https://linkedin.com/company/odaihub", "display_order": 1, "is_active": True},
            {"group_label": "Connect", "label": "Twitter", "url": "https://twitter.com/odaihub", "display_order": 2, "is_active": True},
            {"group_label": "Connect", "label": "GitHub", "url": "https://github.com/odaihub", "display_order": 3, "is_active": True},
        ]

        for f_data in footer_links_data:
            link = FooterLink(**f_data)
            db.add(link)
        db.flush()
        print(f"Created {len(footer_links_data)} footer links")

        db.commit()
        print("\nAll seed data created successfully!")

    except Exception as e:
        db.rollback()
        print(f"\nError: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_data()