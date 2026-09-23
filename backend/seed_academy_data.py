import sys
import os
from decimal import Decimal

sys.path.insert(0, os.path.dirname(__file__))

from app.database.session import SessionLocal
from app.models.academy_category import AcademyCategory
from app.models.course import Course
from app.models.stat import Stat
from app.models.testimonial import Testimonial
from app.models.faq import Faq
from app.crud.academy_crud import generate_slug

db = SessionLocal()

try:
    # 1. Seed Categories if none exist
    categories_data = [
        {
            "id": 1,
            "slug": "school",
            "name": "School Programs",
            "tagline": "Spark curiosity early.",
            "description": "AI, coding, robotics and future skills for Class 5 to 12, taught through play and projects.",
            "accent_color": "#0082ff",
            "icon_letter": "S",
            "image_url": "/static/categories/school.jpg",
            "display_order": 1,
            "is_active": True
        },
        {
            "id": 2,
            "slug": "diploma",
            "name": "Diploma Programs",
            "tagline": "Skills employers want.",
            "description": "Job-oriented technology diplomas for learners who want to start working sooner.",
            "accent_color": "#14b8a6",
            "icon_letter": "D",
            "image_url": "/static/categories/diploma.jpg",
            "display_order": 2,
            "is_active": True
        },
        {
            "id": 3,
            "slug": "college",
            "name": "College Programs",
            "tagline": "Go beyond the syllabus.",
            "description": "Industry tracks that sit alongside your degree, with real tools and real projects.",
            "accent_color": "#00a352",
            "icon_letter": "C",
            "image_url": "/static/categories/college.jpg",
            "display_order": 3,
            "is_active": True
        },
        {
            "id": 4,
            "slug": "non-tech",
            "name": "Non-Tech Programs",
            "tagline": "AI for every field.",
            "description": "No coding background needed. Learn how to use AI in your own field and career.",
            "accent_color": "#ff6a00",
            "icon_letter": "N",
            "image_url": "/static/categories/non-tech.jpg",
            "display_order": 4,
            "is_active": True
        },
        {
            "id": 5,
            "slug": "internships",
            "name": "Internships and Industry Projects",
            "tagline": "Real work, real experience.",
            "description": "Work on live projects with industry partners and build a portfolio employers notice.",
            "accent_color": "#8a2be2",
            "icon_letter": "I",
            "image_url": "/static/categories/internships.jpg",
            "display_order": 5,
            "is_active": True
        },
        {
            "id": 6,
            "slug": "career",
            "name": "Career and Placement Support",
            "tagline": "Get ready. Get hired.",
            "description": "Interview preparation, mock tests, resume building and career guidance to turn skills into a job.",
            "accent_color": "#e60026",
            "icon_letter": "P",
            "image_url": "/static/categories/career.jpg",
            "display_order": 6,
            "is_active": True
        }
    ]

    cat_map = {}
    for cdata in categories_data:
        cat = db.query(AcademyCategory).filter(AcademyCategory.slug == cdata["slug"]).first()
        if not cat:
            cat = AcademyCategory(**cdata)
            db.add(cat)
            db.commit()
            db.refresh(cat)
            print(f"Seeded Academy Category: {cat.name}")
        cat_map[cat.slug] = cat.id

    # 2. Seed Prototype Courses (check if academy courses exist)
    academy_course_count = db.query(Course).filter(Course.category_id.isnot(None)).count()
    print(f"Current academy courses in database: {academy_course_count}")

    if academy_course_count == 0:
        courses_data = [
            # School
            ("school", "Class 5–7", "AI Explorers", "Class 5–7", 8, "weeks", "offline", Decimal("4999"), Decimal("3999"), False, 25, "Play-based intro to AI, logic puzzles and block coding.", ["Visual block coding", "Logic puzzles & algorithms", "Interactive AI mini-games"]),
            ("school", "Class 5–7", "Junior Robotics", "Class 5–7", 10, "weeks", "offline", Decimal("5999"), Decimal("4999"), False, 20, "Build and program simple robots with sensors.", ["Hardware sensor integration", "Obstacle avoidance robots", "Hands-on tinkering lab"]),
            ("school", "Class 8–10", "Python for Beginners", "Class 8–10", 12, "weeks", "hybrid", Decimal("6999"), Decimal("5499"), False, 30, "Learn Python step by step by making small games.", ["Core Python syntax", "Game dev with Pygame", "Algorithms and problem solving"]),
            ("school", "Class 8–10", "AI and Machine Learning Basics", "Class 8–10", 12, "weeks", "online", Decimal("6999"), Decimal("5499"), False, 30, "Train your first image and text models.", ["Image classification", "Teachable machines", "Prompt engineering essentials"]),
            ("school", "Class 11–12", "Applied AI and Data Science", "Class 11–12", 16, "weeks", "hybrid", Decimal("8999"), Decimal("6999"), False, 25, "Data, statistics and ML projects alongside your boards.", ["Numpy & Pandas data wrangling", "Supervised ML algorithms", "Real-world dataset projects"]),
            ("school", "Class 11–12", "Web and App Development", "Class 11–12", 16, "weeks", "online", Decimal("7999"), Decimal("5999"), False, 30, "Build and publish a real website and mobile app.", ["HTML5, CSS3, Modern JavaScript", "React UI foundations", "Live app deployment"]),

            # Diploma
            ("diploma", "Diploma", "Diploma in AI and Automation", "After Class 12", 6, "months", "hybrid", Decimal("24999"), Decimal("19999"), False, 25, "AI tools, scripting and automation for real workflows.", ["Python automation & Web Scraping", "GenAI APIs & workflow integration", "Enterprise bot development"]),
            ("diploma", "Diploma", "Diploma in Full-Stack Development", "After Class 10 or 12", 6, "months", "offline", Decimal("24999"), Decimal("19999"), False, 25, "Front-end, back-end and databases with live projects.", ["React.js frontend masterclass", "Node.js & FastAPI backend architecture", "Database design & PostgreSQL"]),
            ("diploma", "Diploma", "Diploma in Cloud and DevOps", "After Class 12", 5, "months", "hybrid", Decimal("22999"), Decimal("17999"), False, 20, "AWS, Docker and CI/CD from the ground up.", ["Linux administration", "Docker containerization", "AWS architecture & CI/CD pipelines"]),
            ("diploma", "Diploma", "Diploma in Data Analytics", "After Class 12", 5, "months", "online", Decimal("19999"), Decimal("15999"), False, 30, "Excel, SQL, Python and dashboards for analysts.", ["Advanced Business Excel & PowerBI", "SQL query optimization", "Automated executive dashboards"]),

            # College
            ("college", "B.Tech", "AI for B.Tech Engineers", "B.Tech", 3, "months", "hybrid", Decimal("11999"), Decimal("8999"), False, 35, "Machine learning and deep learning with industry projects.", ["Deep neural networks with PyTorch", "Computer Vision & NLP systems", "Industry-grade capstone deployment"]),
            ("college", "B.Tech", "Cloud and DevOps for B.Tech", "B.Tech", 3, "months", "online", Decimal("9999"), Decimal("7499"), False, 40, "Deploy and scale applications on the cloud.", ["Microservices architecture", "Kubernetes cluster management", "Infrastructure as Code with Terraform"]),
            ("college", "BCA", "Full-Stack Development for BCA", "BCA", 4, "months", "hybrid", Decimal("11999"), Decimal("8999"), False, 30, "Build complete web applications end to end.", ["Modern React & State Management", "REST API development with FastAPI", "Authentication, caching & cloud hosting"]),
            ("college", "B.Sc", "Data Science for B.Sc", "B.Sc", 4, "months", "online", Decimal("9999"), Decimal("7499"), False, 35, "Statistics, Python and visualisation with real datasets.", ["Statistical inference & hypothesis testing", "Data storytelling with Seaborn", "Scikit-Learn predictive modeling"]),
            ("college", "MCA", "Advanced AI and Cloud for MCA", "MCA", 4, "months", "hybrid", Decimal("13999"), Decimal("10499"), False, 30, "Applied AI systems and cloud architecture.", ["LLM fine-tuning & RAG architectures", "Cloud-native microservices", "Scalable AI serving"]),
            ("college", "M.Sc", "Machine Learning for M.Sc", "M.Sc", 4, "months", "online", Decimal("11999"), Decimal("8999"), False, 25, "Modern ML methods and research-style projects.", ["Mathematical foundations of ML", "Transformers & generative models", "Research paper implementation"]),

            # Non-Tech
            ("non-tech", "BA", "AI for Arts Students (BA)", "BA", 6, "weeks", "online", Decimal("4999"), Decimal("3499"), False, 40, "Use AI for research, writing and creative work.", ["Creative content generation", "Research summarization techniques", "Digital ethics & AI tools"]),
            ("non-tech", "BCom", "AI in Finance and Accounting (BCom)", "BCom", 6, "weeks", "hybrid", Decimal("5999"), Decimal("4499"), False, 35, "Automate reports, analysis and forecasting.", ["Financial modeling automation", "AI auditing & anomaly detection", "Automated Excel financial reports"]),
            ("non-tech", "MBA", "AI for Managers (MBA)", "MBA", 8, "weeks", "hybrid", Decimal("8999"), Decimal("6999"), False, 30, "Lead AI projects and make data-driven decisions.", ["Strategic AI adoption roadmap", "ROI evaluation of AI initiatives", "Managing cross-functional tech teams"]),
            ("non-tech", "General", "AI Literacy for Everyone", "Any background", 4, "weeks", "online", Decimal("0.00"), None, True, 100, "Understand what AI can and cannot do.", ["Foundations of artificial intelligence", "Everyday AI tools & productivity", "Dispelling AI myths"]),

            # Internships
            ("internships", "Internship", "AI Internship Program", "College students", 3, "months", "hybrid", Decimal("9999"), Decimal("7499"), False, 20, "Work with mentors on an applied AI problem.", ["Direct 1-on-1 industry mentorship", "Production-grade codebase contributions", "Verified internship experience certificate"]),
            ("internships", "Project", "Live Industry Project", "College students", 2, "months", "offline", Decimal("7999"), Decimal("5999"), False, 20, "Solve a real challenge from an industry partner.", ["Real client problem statements", "Agile sprint methodology", "Final stakeholder demonstration"]),
            ("internships", "Internship", "Web and Cloud Internship", "College students", 3, "months", "online", Decimal("8999"), Decimal("6999"), False, 25, "Ship features on a real product.", ["Feature design & pull requests", "Continuous integration workflow", "Live cloud deployment verification"]),
            ("internships", "Project", "IoT and Robotics Project", "School and college", 2, "months", "offline", Decimal("7999"), Decimal("5999"), False, 15, "Build a working prototype in the Innovation Lab.", ["Microcontroller programming", "Sensor telemetry & actuators", "Working hardware prototype build"])
        ]

        for cat_slug, group, title, target, dur_val, dur_unit, mode, price, disc, is_free, seats, short_desc, highlights in courses_data:
            cat_id = cat_map.get(cat_slug)
            slug = generate_slug(title)
            course = Course(
                title=title,
                name=title,
                slug=slug,
                category_id=cat_id,
                group_label=group,
                target_audience=target,
                duration_value=dur_val,
                duration_unit=dur_unit,
                mode=mode,
                price=price,
                discount_price=disc,
                currency="INR",
                is_free=is_free,
                batch_size=seats,
                short_description=short_desc,
                description=short_desc,
                full_description=f"Comprehensive course on {title} designed specifically for {target}. Learn through hands-on labs, guided mentors, and industry projects.",
                highlights=highlights,
                prerequisites="Basic computer literacy and eager enthusiasm to learn.",
                certificate_included=True,
                status="published",
                display_order=0
            )
            db.add(course)
        db.commit()
        print("Seeded 24 prototype courses with published status.")

    # 3. Seed Stats
    if db.query(Stat).count() == 0:
        stats_data = [
            ("Students trained", 1000, "+", 1),
            ("Real-world projects", 100, "+", 2),
            ("Institutional partners", 20, "+", 3),
            ("In internships or jobs", 80, "%", 4)
        ]
        for label, val, suff, order in stats_data:
            db.add(Stat(label=label, value=val, suffix=suff, display_order=order, is_active=True))
        db.commit()
        print("Seeded animated stats counters.")

    # 4. Seed Testimonials
    if db.query(Testimonial).count() == 0:
        testimonials_data = [
            ("Rohan Patra", "B.Tech CSE, 3rd year", "“OD AI HUB gave me the right skills and confidence. The projects helped me get my first internship.”", 5, 1),
            ("Ananya Das", "BCA, final year", "“The training was practical and relevant. I could apply what I learned directly in my college projects.”", 5, 2),
            ("Siddharth Mishra", "MCA, 2nd year", "“Great mentors and industry exposure. The sessions helped me crack interviews and build my career path.”", 5, 3)
        ]
        for name, role, quote, rating, order in testimonials_data:
            db.add(Testimonial(name=name, role_or_degree=role, quote=quote, rating=rating, display_order=order, is_active=True))
        db.commit()
        print("Seeded student testimonials.")

    # 5. Seed FAQs
    if db.query(Faq).count() == 0:
        faqs_data = [
            ("Who can join?", "Students from Class 5 onwards, college learners, and working professionals. Each program lists its audience.", "general", 1),
            ("Are classes online or offline?", "Both. Each course card shows whether it runs online, offline or hybrid.", "general", 2),
            ("What are the fees and batch timings?", "Fees and timings differ by program. Send an enquiry and a counsellor will share the current details.", "general", 3),
            ("Will I get a certificate?", "Yes. Completed programs come with a recognized certificate that employers can verify.", "general", 4),
            ("Do you help with internships and jobs?", "Yes. See Internships and Industry Projects and Career and Placement Support above.", "general", 5)
        ]
        for q, a, cat, order in faqs_data:
            db.add(Faq(question=q, answer=a, category=cat, display_order=order, is_active=True))
        db.commit()
        print("Seeded FAQs.")

finally:
    db.close()
