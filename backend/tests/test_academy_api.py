import pytest
import httpx
from app.main import app

@pytest.mark.anyio
async def test_public_categories():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
        res = await client.get("/api/v1/academy/categories")
        assert res.status_code == 200
        data = res.json()
        assert isinstance(data, list)
        assert len(data) >= 6
        slugs = [c["slug"] for c in data]
        assert "school" in slugs
        assert "college" in slugs
        # Check cache header
        assert "public, max-age=30" in res.headers.get("cache-control", "")

@pytest.mark.anyio
async def test_public_category_courses():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
        res = await client.get("/api/v1/academy/categories/school/courses")
        assert res.status_code == 200
        courses = res.json()
        assert isinstance(courses, list)
        assert len(courses) > 0
        first = courses[0]
        assert "title" in first
        assert "price_display" in first
        assert "target_audience" in first
        assert first["status"] == "published"

@pytest.mark.anyio
async def test_public_course_detail_and_no_drafts():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
        # Valid published course
        res = await client.get("/api/v1/academy/courses/ai-explorers")
        assert res.status_code == 200
        course = res.json()
        assert course["slug"] == "ai-explorers"
        assert course["price_display"].startswith("₹") or course["price_display"] == "Free"
        assert isinstance(course["highlights"], list)

        # Non-existent or draft course returns 404
        bad_res = await client.get("/api/v1/academy/courses/non-existent-course-slug-12345")
        assert bad_res.status_code == 404

@pytest.mark.anyio
async def test_public_stats_testimonials_faqs():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
        # Stats
        s_res = await client.get("/api/v1/stats")
        assert s_res.status_code == 200
        assert len(s_res.json()) >= 4

        # Testimonials
        t_res = await client.get("/api/v1/testimonials")
        assert t_res.status_code == 200
        assert len(t_res.json()) >= 3

        # FAQs
        f_res = await client.get("/api/v1/faqs")
        assert f_res.status_code == 200
        assert len(f_res.json()) >= 5

@pytest.mark.anyio
async def test_enquiry_submission_and_honeypot():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
        # Valid enquiry
        valid_payload = {
            "name": "Priyanka Sahoo",
            "phone": "9876543210",
            "email": "priyanka@example.com",
            "class_or_degree": "B.Tech CSE",
            "message": "Interested in Applied AI course"
        }
        res = await client.post("/api/v1/enquiries", json=valid_payload)
        assert res.status_code == 201
        data = res.json()
        assert data["name"] == "Priyanka Sahoo"
        assert data["status"] == "new"

        # Spam / Honeypot rejection
        spam_payload = {
            "name": "Bot Spammer",
            "phone": "1234567890",
            "honeypot": "I am a spam bot filling hidden fields"
        }
        spam_res = await client.post("/api/v1/enquiries", json=spam_payload)
        assert spam_res.status_code == 400

@pytest.mark.anyio
async def test_admin_routes_auth_protection():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
        # Attempt to access admin endpoint without token -> 401 Unauthorized
        res = await client.get("/api/admin/academy/courses")
        assert res.status_code in (401, 403)

@pytest.mark.anyio
async def test_website_pages_delivery():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
        # Home page
        home_res = await client.get("/")
        assert home_res.status_code == 200
        assert "OD AI HUB" in home_res.text

        # Academy page
        academy_res = await client.get("/academy")
        assert academy_res.status_code == 200
        assert "OD AI ACADEMY" in academy_res.text

        # Pillar page
        soon_res = await client.get("/technologies")
        assert soon_res.status_code == 200
        assert "Coming Soon" in soon_res.text

