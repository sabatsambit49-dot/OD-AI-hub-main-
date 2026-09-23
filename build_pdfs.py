import os
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable, Preformatted
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#475569"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "EduTrack System Architecture & Mapping Documentation")
            self.drawRightString(612 - 54, 750, "Technical Reference Guide")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 742, 612 - 54, 742)
        
        # Footer (all pages)
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(612 - 54, 30, page_text)
        self.drawString(54, 30, "EduTrack Project — End-to-End System & Database Architecture")
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 42, 612 - 54, 42)
        
        self.restoreState()

def create_styles():
    styles = getSampleStyleSheet()
    
    # Base modifications
    styles['Normal'].textColor = colors.HexColor("#1E293B")
    styles['Normal'].fontSize = 9.5
    styles['Normal'].leading = 13.5
    
    # Custom styles
    doc_title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=6
    )
    
    doc_subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#0369A1"),
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=colors.HexColor("#0F172A"),
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor("#0369A1"),
        spaceBefore=10,
        spaceAfter=6,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor("#334155"),
        spaceAfter=8
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#1E3A8A")
    )
    
    code_box_style = ParagraphStyle(
        'CodeBoxText',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#0F172A")
    )
    
    table_cell_style = ParagraphStyle(
        'TableCellText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#1E293B")
    )
    
    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#0F172A")
    )
    
    table_header_style = ParagraphStyle(
        'TableHeaderText',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.white
    )

    return {
        'DocTitle': doc_title_style,
        'DocSubtitle': doc_subtitle_style,
        'H1': h1_style,
        'H2': h2_style,
        'Body': body_style,
        'Bullet': bullet_style,
        'Callout': callout_style,
        'CodeBox': code_box_style,
        'TableCell': table_cell_style,
        'TableCellBold': table_cell_bold,
        'TableHeader': table_header_style
    }

def make_callout(text, styles):
    p = Paragraph(f"<b>Key Architectural Concept:</b> {text}", styles['Callout'])
    t = Table([[p]], colWidths=[504])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EFF6FF")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#3B82F6")),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    return t

def make_code_block(code_text, styles):
    p = Preformatted(code_text, styles['CodeBox'])
    t = Table([[p]], colWidths=[504])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#E2E8F0")),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    return t

def generate_pdf_1(filepath):
    doc = SimpleDocTemplate(
        filepath,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    styles = create_styles()
    story = []

    # Document Header
    story.append(Paragraph("EduTrack System Documentation — Part 1", styles['DocTitle']))
    story.append(Paragraph("Backend to Database Connection, Schema Mapping & Mechanics Guide", styles['DocSubtitle']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0284C7"), spaceAfter=12))

    # Section 1
    story.append(Paragraph("1. Executive Overview & Database Architecture", styles['H1']))
    story.append(Paragraph(
        "The EduTrack backend is constructed using Python 3 and the <b>FastAPI</b> framework. "
        "All data persistence, entity mapping, and relational integrity are managed via <b>SQLAlchemy 2.0</b>, "
        "a powerful Object-Relational Mapper (ORM). The underlying database engine defaults to <b>SQLite</b> "
        "(stored locally at <code>backend/edutrack.db</code>), while maintaining seamless compatibility with production "
        "relational engines such as PostgreSQL.",
        styles['Body']
    ))
    story.append(make_callout(
        "SQLAlchemy acts as an abstraction bridge between Python objects in memory and raw database tables. "
        "Instead of writing manual SQL queries, the application executes structured Python function calls which SQLAlchemy "
        "translates into optimized SQL statements.",
        styles
    ))

    # Section 2
    story.append(Spacer(1, 10))
    story.append(Paragraph("2. Engine Configuration & Session Lifecycle", styles['H1']))
    story.append(Paragraph(
        "Database connections are managed inside <code>backend/app/database/session.py</code>. "
        "The connection lifecycle follows a strict factory pattern to prevent memory leaks and thread safety issues:",
        styles['Body']
    ))
    
    code_session = (
        "# backend/app/database/session.py\n"
        "from sqlalchemy import create_engine\n"
        "from sqlalchemy.orm import sessionmaker\n"
        "from app.config import settings\n\n"
        "# 1. Create Engine with thread safety rules for SQLite\n"
        "connect_args = {}\n"
        "if settings.DATABASE_URL.startswith('sqlite'):\n"
        "    connect_args['check_same_thread'] = False\n\n"
        "engine = create_engine(settings.DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)\n\n"
        "# 2. Session Factory\n"
        "SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)\n\n"
        "# 3. Dependency Injection Generator Function\n"
        "def get_db():\n"
        "    db = SessionLocal()\n"
        "    try:\n"
        "        yield db\n"
        "    finally:\n"
        "        db.close()"
    )
    story.append(make_code_block(code_session, styles))
    
    story.append(Spacer(1, 8))
    story.append(Paragraph("Session Lifecycle Mechanics:", styles['H2']))
    story.append(Paragraph("• <b>Engine Creation:</b> Initializes database connection pooling. <code>pool_pre_ping=True</code> checks connection health before issuing queries.", styles['Bullet']))
    story.append(Paragraph("• <b>SessionLocal Factory:</b> Produces fresh <code>Session</code> instances for incoming HTTP requests. <code>autocommit=False</code> guarantees transaction safety.", styles['Bullet']))
    story.append(Paragraph("• <b>get_db() Generator:</b> FastAPI injects <code>db: Session = Depends(get_db)</code> into router endpoints. The <code>yield</code> hands the active DB session to the handler, and the <code>finally</code> block ensures <code>db.close()</code> is invoked even if an exception occurs.", styles['Bullet']))

    # Section 3
    story.append(Spacer(1, 10))
    story.append(Paragraph("3. Declarative Base & Complete Entity Relationship Schema", styles['H1']))
    story.append(Paragraph(
        "All ORM models inherit from a common <code>Base</code> class defined in <code>backend/app/database/base.py</code>. "
        "Upon server boot (in <code>main.py</code>), <code>Base.metadata.create_all(bind=engine)</code> inspects all registered models "
        "and creates the database tables automatically if they do not exist.",
        styles['Body']
    ))

    # Entity Table
    story.append(Paragraph("Complete Database Models Mapping Matrix:", styles['H2']))
    
    headers = [
        Paragraph("Entity Model", styles['TableHeader']),
        Paragraph("Table Name", styles['TableHeader']),
        Paragraph("Primary / Foreign Keys", styles['TableHeader']),
        Paragraph("Core Attributes", styles['TableHeader']),
        Paragraph("Cascade / Relationships", styles['TableHeader'])
    ]
    
    table_data = [headers]
    
    models_info = [
        ("State", "states", "id (PK)", "name (Unique)", "institutions (1:N via District)"),
        ("District", "districts", "id (PK), state_id (FK->states.id)", "name", "state (N:1), institutions (1:N, Cascade Delete)"),
        ("InstitutionType", "institution_types", "id (PK)", "name, category", "institutions (1:N, Cascade Delete)"),
        ("Institution", "institutions", "id (PK), district_id (FK), type_id (FK)", "name, address, created_at", "district, institution_type, courses (1:N), events (1:N)"),
        ("Course", "courses", "id (PK), institution_id (FK)", "name, code, duration_years", "institution (N:1), branches (1:N, Cascade Delete)"),
        ("Branch", "branches", "id (PK), course_id (FK)", "name", "course (N:1), academic_years (1:N, Cascade Delete)"),
        ("AcademicYear", "academic_years", "id (PK), branch_id (FK)", "year_label, total_seats, student_strength", "branch (N:1), syllabus_entries (1:N, Cascade Delete)"),
        ("SyllabusEntry", "syllabus_entries", "id (PK), academic_year_id (FK)", "title, content_text, file_url", "academic_year (N:1)"),
        ("Event", "events", "id (PK), institution_id (FK)", "title, event_date, description", "institution (N:1)"),
        ("InformationPost", "information_posts", "id (PK), institution_id (FK)", "title, body, category", "institution (N:1)"),
        ("User", "users", "id (PK)", "username (Unique), email (Unique), hashed_password, role", "System Auth User (Viewer, Editor, Admin)")
    ]

    for m_name, t_name, keys, attrs, rels in models_info:
        row = [
            Paragraph(f"<b>{m_name}</b>", styles['TableCellBold']),
            Paragraph(f"<code>{t_name}</code>", styles['TableCell']),
            Paragraph(keys, styles['TableCell']),
            Paragraph(attrs, styles['TableCell']),
            Paragraph(rels, styles['TableCell'])
        ]
        table_data.append(row)

    t_models = Table(table_data, colWidths=[80, 75, 115, 115, 119])
    t_models.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0F172A")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('PADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_models)

    # Section 4
    story.append(Spacer(1, 14))
    story.append(Paragraph("4. Data Access Layer (CRUD Operations)", styles['H1']))
    story.append(Paragraph(
        "Database interactions are encapsulated inside specialized files in <code>backend/app/crud/</code>. "
        "This decouples HTTP router logic from raw database query construction.",
        styles['Body']
    ))
    
    story.append(Paragraph("Standard CRUD Query Patterns:", styles['H2']))
    crud_code = (
        "# Example pattern from backend/app/crud/institution_crud.py\n"
        "from sqlalchemy.orm import Session\n"
        "from app.models.institution import Institution\n"
        "from app.schemas.institution import InstitutionCreate\n\n"
        "# Read Operation with Filtering and Pagination\n"
        "def get_institutions(db: Session, skip: int = 0, limit: int = 100, district_id: int = None):\n"
        "    query = db.query(Institution)\n"
        "    if district_id:\n"
        "        query = query.filter(Institution.district_id == district_id)\n"
        "    return query.offset(skip).limit(limit).all()\n\n"
        "# Create Operation with Atomic Commit\n"
        "def create_institution(db: Session, obj_in: InstitutionCreate):\n"
        "    db_obj = Institution(**obj_in.model_dump())\n"
        "    db.add(db_obj)       # 1. Stage in session memory\n"
        "    db.commit()        # 2. Flush SQL INSERT transaction to database\n"
        "    db.refresh(db_obj)   # 3. Reload generated Auto-PK (id) and timestamps\n"
        "    return db_obj"
    )
    story.append(make_code_block(crud_code, styles))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Data Conversion & Query Lifecycle:", styles['H2']))
    story.append(Paragraph("1. Router receives client parameters and passes active <code>db</code> session to CRUD function.", styles['Bullet']))
    story.append(Paragraph("2. SQLAlchemy generates SQL statement: <code>SELECT * FROM institutions WHERE district_id = ? LIMIT ? OFFSET ?</code>.", styles['Bullet']))
    story.append(Paragraph("3. SQLite engine executes query and returns raw binary/tabular row tuples.", styles['Bullet']))
    story.append(Paragraph("4. SQLAlchemy instantiates <code>Institution</code> Python class instances, populating fields automatically.", styles['Bullet']))
    story.append(Paragraph("5. CRUD function returns Python ORM objects back to the FastAPI router.", styles['Bullet']))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated: {filepath}")

def generate_pdf_2(filepath):
    doc = SimpleDocTemplate(
        filepath,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    styles = create_styles()
    story = []

    # Document Header
    story.append(Paragraph("EduTrack System Documentation — Part 2", styles['DocTitle']))
    story.append(Paragraph("Backend to Frontend API, Validation & Communication Guide", styles['DocSubtitle']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0284C7"), spaceAfter=12))

    # Section 1
    story.append(Paragraph("1. Executive API Interface Overview", styles['H1']))
    story.append(Paragraph(
        "The interface between the Python FastAPI backend and the React Vite frontend operates entirely over "
        "asynchronous **RESTful HTTP/HTTPS APIs**. Data is exchanged strictly in standard **JSON** (JavaScript Object Notation) format. "
        "FastAPI handles route dispatching, CORS headers, and input/output payload validation through **Pydantic Schemas**.",
        styles['Body']
    ))
    story.append(make_callout(
        "FastAPI automatically validates incoming JSON request bodies against Pydantic schemas. If a client sends invalid data "
        "(e.g., missing required field or wrong datatype), FastAPI intercepts the call before it reaches business logic and returns "
        "a standardized HTTP 422 Unprocessable Entity response.",
        styles
    ))

    # Section 2
    story.append(Spacer(1, 10))
    story.append(Paragraph("2. FastAPI Routers & Unified Exception Handling", styles['H1']))
    story.append(Paragraph(
        "API endpoints are grouped into dedicated router files located in <code>backend/app/routers/</code>. "
        "All routers are mounted in <code>main.py</code> under the <code>/api</code> prefix:",
        styles['Body']
    ))

    router_table_headers = [
        Paragraph("Router File", styles['TableHeader']),
        Paragraph("Prefix Path", styles['TableHeader']),
        Paragraph("HTTP Methods", styles['TableHeader']),
        Paragraph("Description & Responsibility", styles['TableHeader'])
    ]
    
    r_data = [router_table_headers]
    routers_list = [
        ("routers/auth.py", "/api/auth", "POST", "User Registration, Login, and JWT Token issuance"),
        ("routers/states.py", "/api/states", "GET, POST, PUT, DELETE", "CRUD management for geographic States"),
        ("routers/districts.py", "/api/districts", "GET, POST, PUT, DELETE", "Districts management filtered by state_id"),
        ("routers/institutions.py", "/api/institutions", "GET, POST, PUT, DELETE", "Educational Institutions CRUD and type filter"),
        ("routers/courses.py", "/api/courses", "GET, POST, PUT, DELETE", "Academic Courses management per Institution"),
        ("routers/branches.py", "/api/branches", "GET, POST, PUT, DELETE", "Departmental Branches under Courses"),
        ("routers/academic_years.py", "/api/academic-years", "GET, POST, PUT, DELETE", "Academic Years & Strength tracking"),
        ("routers/syllabus.py", "/api/syllabus", "GET, POST, DELETE", "Syllabus entry text & PDF file upload handling"),
        ("routers/graph_data.py", "/api/graph-data", "GET", "Aggregated hierarchy graph (nodes & edges) for UI visualizer"),
        ("routers/bulk.py", "/api/bulk", "POST", "Bulk data import pipeline for institutions & hierarchy")
    ]

    for r_file, p_path, h_meth, desc in routers_list:
        row = [
            Paragraph(f"<code>{r_file}</code>", styles['TableCellBold']),
            Paragraph(f"<code>{p_path}</code>", styles['TableCell']),
            Paragraph(f"<b>{h_meth}</b>", styles['TableCell']),
            Paragraph(desc, styles['TableCell'])
        ]
        r_data.append(row)

    t_routers = Table(r_data, colWidths=[100, 95, 95, 214])
    t_routers.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0F172A")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('PADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_routers)

    # Section 3
    story.append(Spacer(1, 12))
    story.append(Paragraph("3. Request & Response Validation via Pydantic Schemas", styles['H1']))
    story.append(Paragraph(
        "Pydantic schemas (in <code>backend/app/schemas/</code>) define contract models for input validation and output serialization. "
        "By setting <code>from_attributes = True</code> (formerly <code>orm_mode</code>), Pydantic seamlessly reads values directly from "
        "SQLAlchemy ORM models.",
        styles['Body']
    ))
    
    schema_code = (
        "# Example schema hierarchy from backend/app/schemas/institution.py\n"
        "from pydantic import BaseModel\n"
        "from datetime import datetime\n\n"
        "# 1. Base Schema (Shared attributes)\n"
        "class InstitutionBase(BaseModel):\n"
        "    name: str\n"
        "    address: str | None = None\n"
        "    district_id: int\n"
        "    institution_type_id: int\n\n"
        "# 2. Request Schema for Client Creation Payload\n"
        "class InstitutionCreate(InstitutionBase):\n"
        "    pass\n\n"
        "# 3. Response Schema sent back to Frontend\n"
        "class InstitutionResponse(InstitutionBase):\n"
        "    id: int\n"
        "    created_at: datetime\n"
        "    class Config:\n"
        "        from_attributes = True  # Converts SQLAlchemy ORM object -> JSON dictionary"
    )
    story.append(make_code_block(schema_code, styles))

    # Section 4
    story.append(Spacer(1, 10))
    story.append(Paragraph("4. Security & JWT Authentication Pipeline", styles['H1']))
    story.append(Paragraph(
        "EduTrack enforces secure role-based authentication using **JSON Web Tokens (JWT)**:",
        styles['Body']
    ))
    story.append(Paragraph("1. <b>Login Request:</b> User submits credentials to <code>POST /api/auth/token</code>.", styles['Bullet']))
    story.append(Paragraph("2. <b>Verification:</b> <code>crud/user_crud.py</code> fetches user and verifies password hash using <code>passlib (bcrypt)</code>.", styles['Bullet']))
    story.append(Paragraph("3. <b>JWT Issuance:</b> Server generates signed token containing <code>user_id</code> and expiration time.", styles['Bullet']))
    story.append(Paragraph("4. <b>Header Injection:</b> Frontend stores token in <code>localStorage</code> and attaches <code>Authorization: Bearer &lt;token&gt;</code> to every Axios request.", styles['Bullet']))
    story.append(Paragraph("5. <b>Endpoint Protection:</b> Protected routers require <code>current_user: User = Depends(get_current_user)</code>.", styles['Bullet']))

    # Section 5
    story.append(Spacer(1, 10))
    story.append(Paragraph("5. Frontend Axios Client & Service Bindings", styles['H1']))
    story.append(Paragraph(
        "The React client configures a centralized Axios HTTP instance in <code>frontend/src/api/client.js</code>. "
        "Request interceptors automatically attach authentication headers, and domain-specific API wrappers organize remote procedure calls:",
        styles['Body']
    ))
    
    axios_code = (
        "// frontend/src/api/client.js\n"
        "import axios from 'axios';\n\n"
        "const api = axios.create({ baseURL: '/api', headers: { 'Content-Type': 'application/json' } });\n\n"
        "// Request Interceptor for Bearer Token\n"
        "api.interceptors.request.use((config) => {\n"
        "  const token = localStorage.getItem('edutrack_token');\n"
        "  if (token) config.headers.Authorization = `Bearer ${token}`;\n"
        "  return config;\n"
        "});\n"
        "export default api;"
    )
    story.append(make_code_block(axios_code, styles))

    # Section 6
    story.append(Spacer(1, 8))
    story.append(Paragraph("6. React UI Page Component Binding Matrix", styles['H1']))
    story.append(Paragraph("Mapping between React Pages/Components and Backend API Endpoints:", styles['Body']))
    
    react_headers = [
        Paragraph("React Page / Component", styles['TableHeader']),
        Paragraph("Frontend API Module", styles['TableHeader']),
        Paragraph("Backend Router Endpoint", styles['TableHeader']),
        Paragraph("UI Functionality", styles['TableHeader'])
    ]
    
    rc_data = [react_headers]
    react_mappings = [
        ("HomePage.jsx", "hierarchyApi.getStates()", "GET /api/states", "State dropdown selector & high-level stats"),
        ("HomePage.jsx", "institutionApi.getInstitutions()", "GET /api/institutions", "Hierarchical tree drilldown of institutions"),
        ("AnalyticsPage.jsx", "graphApi.getGraphData()", "GET /api/graph-data", "Interactive network graph of hierarchy nodes/edges"),
        ("SearchResultsPage.jsx", "syllabusApi.searchSyllabus()", "GET /api/syllabus/search", "Search syllabus content & view PDF downloads"),
        ("AdminConsolePage.jsx", "hierarchyApi.createState()", "POST /api/states", "Admin management dashboard for full hierarchy CRUD"),
        ("AuthModal.jsx", "authApi.login()", "POST /api/auth/token", "User login dialog & JWT token store in localStorage")
    ]

    for rc_page, f_api, b_end, ui_func in react_mappings:
        row = [
            Paragraph(f"<b>{rc_page}</b>", styles['TableCellBold']),
            Paragraph(f"<code>{f_api}</code>", styles['TableCell']),
            Paragraph(f"<code>{b_end}</code>", styles['TableCell']),
            Paragraph(ui_func, styles['TableCell'])
        ]
        rc_data.append(row)

    t_react = Table(rc_data, colWidths=[110, 130, 120, 144])
    t_react.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0F172A")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('PADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_react)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated: {filepath}")

def generate_pdf_3(filepath):
    doc = SimpleDocTemplate(
        filepath,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    styles = create_styles()
    story = []

    # Document Header
    story.append(Paragraph("EduTrack System Documentation — Part 3", styles['DocTitle']))
    story.append(Paragraph("End-to-End System Architecture & Complete Flow Integration Map", styles['DocSubtitle']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0284C7"), spaceAfter=12))

    # Section 1
    story.append(Paragraph("1. The 6-Layer Architecture Blueprint", styles['H1']))
    story.append(Paragraph(
        "The EduTrack application follows a clean, modular 6-layer architecture. "
        "Every user interaction flows sequentially across all six layers from the frontend user interface down to physical database storage, "
        "ensuring clean separation of concerns, strict type validation, and high maintainability.",
        styles['Body']
    ))
    
    stack_code = (
        "+-----------------------------------------------------------------------------------------+\n"
        "|  Layer 6: REACT UI COMPONENTS     (e.g., AnalyticsPage.jsx, HomePage.jsx, StateSelect)  |\n"
        "+-----------------------------------------------------------------------------------------+\n"
        "                                           |  async HTTP API calls\n"
        "                                           v\n"
        "+-----------------------------------------------------------------------------------------+\n"
        "|  Layer 5: AXIOS HTTP CLIENT       (client.js interceptors, hierarchyApi.js wrappers)    |\n"
        "+-----------------------------------------------------------------------------------------+\n"
        "                                           |  JSON payload over network /api/v1\n"
        "                                           v\n"
        "+-----------------------------------------------------------------------------------------+\n"
        "|  Layer 4: FASTAPI ROUTER & PYDANTIC (routers/institutions.py, schemas/institution.py)   |\n"
        "+-----------------------------------------------------------------------------------------+\n"
        "                                           |  Validated Python Dict / Session\n"
        "                                           v\n"
        "+-----------------------------------------------------------------------------------------+\n"
        "|  Layer 3: CRUD DATA ACCESS LAYER  (crud/institution_crud.py SQLAlchemy queries)      |\n"
        "+-----------------------------------------------------------------------------------------+\n"
        "                                           |  SQL Query Translation\n"
        "                                           v\n"
        "+-----------------------------------------------------------------------------------------+\n"
        "|  Layer 2: SQLALCHEMY ORM MODELS   (models/institution.py declarative classes)          |\n"
        "+-----------------------------------------------------------------------------------------+\n"
        "                                           |  DBAPI Execution\n"
        "                                           v\n"
        "+-----------------------------------------------------------------------------------------+\n"
        "|  Layer 1: SQLITE DATABASE ENGINE  (backend/edutrack.db binary storage & tables)         |\n"
        "+-----------------------------------------------------------------------------------------+"
    )
    story.append(make_code_block(stack_code, styles))

    # Section 2
    story.append(Spacer(1, 10))
    story.append(Paragraph("2. Master System Entity Integration Matrix", styles['H1']))
    story.append(Paragraph(
        "The following master matrix details how every entity connects across all six architectural layers in the codebase:",
        styles['Body']
    ))

    master_headers = [
        Paragraph("Entity", styles['TableHeader']),
        Paragraph("DB Table", styles['TableHeader']),
        Paragraph("ORM Model", styles['TableHeader']),
        Paragraph("CRUD File", styles['TableHeader']),
        Paragraph("Router Path", styles['TableHeader']),
        Paragraph("Pydantic Schema", styles['TableHeader']),
        Paragraph("Frontend API", styles['TableHeader'])
    ]
    
    m_data = [master_headers]
    master_entities = [
        ("State", "states", "models/state.py", "crud/state_crud.py", "/api/states", "StateResponse", "hierarchyApi.getStates"),
        ("District", "districts", "models/district.py", "crud/district_crud.py", "/api/districts", "DistrictResponse", "hierarchyApi.getDistricts"),
        ("InstType", "institution_types", "models/institution_type.py", "crud/institution_type_crud.py", "/api/institution-types", "InstitutionTypeResponse", "hierarchyApi.getInstitutionTypes"),
        ("Institution", "institutions", "models/institution.py", "crud/institution_crud.py", "/api/institutions", "InstitutionResponse", "institutionApi.getInstitutions"),
        ("Course", "courses", "models/course.py", "crud/course_crud.py", "/api/courses", "CourseResponse", "hierarchyApi.getCourses"),
        ("Branch", "branches", "models/branch.py", "crud/branch_crud.py", "/api/branches", "BranchResponse", "hierarchyApi.getBranches"),
        ("AcadYear", "academic_years", "models/academic_year.py", "crud/academic_year_crud.py", "/api/academic-years", "AcademicYearResponse", "hierarchyApi.getAcademicYears"),
        ("Syllabus", "syllabus_entries", "models/syllabus_entry.py", "crud/syllabus_crud.py", "/api/syllabus", "SyllabusResponse", "syllabusApi.searchSyllabus"),
        ("Event", "events", "models/event.py", "crud/event_crud.py", "/api/events", "EventResponse", "institutionApi.getEvents"),
        ("InfoPost", "information_posts", "models/information_post.py", "crud/information_crud.py", "/api/information", "InformationPostResponse", "institutionApi.getPosts"),
        ("User", "users", "models/user.py", "crud/user_crud.py", "/api/auth", "UserResponse", "authApi.login")
    ]

    for ent, tbl, mdl, crd, rtr, sch, fapi in master_entities:
        row = [
            Paragraph(f"<b>{ent}</b>", styles['TableCellBold']),
            Paragraph(f"<code>{tbl}</code>", styles['TableCell']),
            Paragraph(f"<code>{mdl}</code>", styles['TableCell']),
            Paragraph(f"<code>{crd}</code>", styles['TableCell']),
            Paragraph(f"<code>{rtr}</code>", styles['TableCell']),
            Paragraph(f"<code>{sch}</code>", styles['TableCell']),
            Paragraph(f"<code>{fapi}</code>", styles['TableCell'])
        ]
        m_data.append(row)

    t_master = Table(m_data, colWidths=[54, 70, 75, 75, 70, 80, 80])
    t_master.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0F172A")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('PADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_master)

    # Section 3
    story.append(Spacer(1, 12))
    story.append(Paragraph("3. End-to-End Sequence Workflows", styles['H1']))
    
    story.append(Paragraph("Workflow A: User Authentication & JWT Session Flow", styles['H2']))
    flow_a_text = (
        "1. User enters username and password in AuthModal.jsx and submits form.\n"
        "2. authApi.login({username, password}) executes Axios POST request to /api/auth/token.\n"
        "3. FastAPI routers/auth.py receives request payload and invokes crud/user_crud.py authenticate_user().\n"
        "4. user_crud queries User ORM model in edutrack.db and verifies bcrypt password hash.\n"
        "5. Upon successful match, auth.py encodes JWT Bearer Token containing user_id & expiration time.\n"
        "6. Frontend Axios receives HTTP 200 JSON response: { access_token: '...', token_type: 'bearer' }.\n"
        "7. React client stores access_token in localStorage.getItem('edutrack_token').\n"
        "8. Subsequent API requests automatically include Authorization header via Axios request interceptor."
    )
    story.append(Paragraph(flow_a_text.replace('\n', '<br/>'), styles['Body']))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Workflow B: Analytics Graph Data Visualizer Pipeline", styles['H2']))
    flow_b_text = (
        "1. AnalyticsPage.jsx mounts in browser and invokes graphApi.getGraphData() inside useEffect().\n"
        "2. Axios issues GET request to /api/graph-data.\n"
        "3. FastAPI routers/graph_data.py handles request and requests db session from get_db().\n"
        "4. Router queries all States, Districts, Institutions, Courses, and Branches using join queries.\n"
        "5. Router constructs GraphResponse Pydantic schema consisting of nodes: [{id, label, category}] and edges: [{source, target}].\n"
        "6. FastAPI serializes graph schema to JSON and returns HTTP 200 to frontend.\n"
        "7. AnalyticsPage receives node/edge data structure and renders interactive network graph canvas."
    )
    story.append(Paragraph(flow_b_text.replace('\n', '<br/>'), styles['Body']))

    # Section 4
    story.append(Spacer(1, 10))
    story.append(Paragraph("4. System Resilience & Exception Propagation Architecture", styles['H1']))
    story.append(Paragraph(
        "EduTrack implements robust error handling across all six architectural layers to prevent app crashes and provide clear user feedback:",
        styles['Body']
    ))
    
    story.append(Paragraph("• <b>Layer 1 & 2 (Database/ORM):</b> Database constraint violations (e.g., duplicate unique email or foreign key violation) raise SQLAlchemy <code>IntegrityError</code>.", styles['Bullet']))
    story.append(Paragraph("• <b>Layer 3 & 4 (CRUD/Router):</b> Routers catch database errors or missing entities and raise FastAPI <code>HTTPException(status_code=404/400, detail='...')</code>.", styles['Bullet']))
    story.append(Paragraph("• <b>Global Handler (main.py):</b> <code>custom_global_exception_handler</code> intercepts uncaught exceptions and formats a uniform JSON response with status code, message, error code, timestamp, and request path.", styles['Bullet']))
    story.append(Paragraph("• <b>Layer 5 & 6 (Axios/React):</b> Axios response interceptors catch non-2xx status codes. React components catch promises and display clean error notification banners to the user.", styles['Bullet']))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated: {filepath}")

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    pdf1 = os.path.join(base_dir, "EduTrack_Part1_Backend_to_Database_Mapping_Guide.pdf")
    pdf2 = os.path.join(base_dir, "EduTrack_Part2_Backend_to_Frontend_API_Guide.pdf")
    pdf3 = os.path.join(base_dir, "EduTrack_Part3_End_to_End_System_Architecture_Guide.pdf")

    generate_pdf_1(pdf1)
    generate_pdf_2(pdf2)
    generate_pdf_3(pdf3)
    print("All 3 PDF documentation files built successfully!")
