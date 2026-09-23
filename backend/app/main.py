import os
import asyncio
import logging
from datetime import datetime
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, FileResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database.base import Base
from app.database.session import engine
from app.routers import (
    states,
    districts,
    institution_types,
    institutions,
    courses,
    branches,
    academic_years,
    syllabus,
    events,
    information,
    auth,
    graph_data,
    bulk,
    links,
    course_matrix,
    coaching,
    problem_statements,
    admin_users,
    admin_academy,
    admin_website,
    public_academy,
    public_website
)
import app.models

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("edutrack.keepalive")

# Initialize database tables
Base.metadata.create_all(bind=engine)

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving for syllabus uploads and static assets
app.mount("/static/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

STATIC_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "static")
if os.path.exists(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
WEBSITE_DIR = os.path.join(ROOT_DIR, "website")
if os.path.exists(WEBSITE_DIR):
    app.mount("/website", StaticFiles(directory=WEBSITE_DIR), name="website")

    @app.get("/", include_in_schema=False)
    def serve_home():
        return FileResponse(os.path.join(WEBSITE_DIR, "index.html"))

    @app.get("/programs", include_in_schema=False)
    @app.get("/programs.html", include_in_schema=False)
    def serve_programs():
        return FileResponse(os.path.join(WEBSITE_DIR, "programs.html"))

    @app.get("/academy", include_in_schema=False)
    @app.get("/academy/{slug}", include_in_schema=False)
    @app.get("/technologies", include_in_schema=False)
    @app.get("/innovation-lab", include_in_schema=False)
    @app.get("/startups", include_in_schema=False)
    @app.get("/for-business", include_in_schema=False)
    @app.get("/for-institutions", include_in_schema=False)
    @app.get("/events", include_in_schema=False)
    @app.get("/success-stories", include_in_schema=False)
    @app.get("/about", include_in_schema=False)
    def serve_website_sections(request: Request):
        path = request.url.path.strip("/")
        return RedirectResponse(url=f"/#/{path}")

# Custom Exception Handler for uniform error responses
@app.exception_handler(Exception)
async def custom_global_exception_handler(request: Request, exc: Exception):
    status_code = getattr(exc, "status_code", 500)
    detail = getattr(exc, "detail", str(exc))
    code = getattr(exc, "code", "INTERNAL_SERVER_ERROR" if status_code == 500 else "BAD_REQUEST")
    
    return JSONResponse(
        status_code=status_code,
        content={
            "detail": detail,
            "code": code,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "path": request.url.path
        }
    )

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(states.router, prefix=settings.API_V1_STR)
app.include_router(districts.router, prefix=settings.API_V1_STR)
app.include_router(institution_types.router, prefix=settings.API_V1_STR)
app.include_router(institutions.router, prefix=settings.API_V1_STR)
app.include_router(courses.router, prefix=settings.API_V1_STR)
app.include_router(branches.router, prefix=settings.API_V1_STR)
app.include_router(academic_years.router, prefix=settings.API_V1_STR)
app.include_router(syllabus.router, prefix=settings.API_V1_STR)
app.include_router(events.router, prefix=settings.API_V1_STR)
app.include_router(information.router, prefix=settings.API_V1_STR)
app.include_router(graph_data.router, prefix=settings.API_V1_STR)
app.include_router(bulk.router, prefix=settings.API_V1_STR)
app.include_router(links.router, prefix=settings.API_V1_STR)
app.include_router(course_matrix.router, prefix=settings.API_V1_STR)
app.include_router(coaching.router, prefix=settings.API_V1_STR)
app.include_router(problem_statements.router, prefix=settings.API_V1_STR)
app.include_router(admin_users.router, prefix=settings.API_V1_STR)
app.include_router(admin_academy.router, prefix=settings.API_V1_STR)
app.include_router(admin_website.router, prefix=settings.API_V1_STR)
app.include_router(public_academy.router, prefix=settings.API_V1_STR)
app.include_router(public_website.router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["Health & Keepalive"])
@app.get(f"{settings.API_V1_STR}/ping", tags=["Health & Keepalive"])
def health_check():
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

# Background Keep-Alive Self-Ping Loop (Optional via environment variables)
async def self_keep_alive_loop():
    public_url = os.getenv("APP_PUBLIC_URL")
    if not public_url:
        return

    import urllib.request
    ping_target = f"{public_url.rstrip('/')}/health"
    logger.info(f"⚡ Keep-Alive self-pinger initialized targeting {ping_target}")

    while True:
        await asyncio.sleep(600) # Ping every 10 minutes (600 seconds)
        try:
            req = urllib.request.Request(ping_target, headers={'User-Agent': 'EduTrack-SelfPinger/1.0'})
            with urllib.request.urlopen(req, timeout=10) as response:
                if response.status == 200:
                    logger.info("⚡ Keep-alive self-ping successful.")
        except Exception as e:
            logger.warning(f"⚡ Keep-alive self-ping failed: {e}")

@app.on_event("startup")
async def start_keep_alive():
    if os.getenv("ENABLE_KEEP_ALIVE", "false").lower() in ("true", "1", "yes"):
        asyncio.create_task(self_keep_alive_loop())

