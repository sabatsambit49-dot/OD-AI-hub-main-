import pytest
import httpx
from app.main import app

@pytest.mark.anyio
async def test_graph_export():
    payload = {
        "years": ["1st Year", "2nd Year"],
        "datasets": [
            {"label": "Total Seats", "data": [60, 60]},
            {"label": "Students Enrolled", "data": [45, 52]}
        ]
    }
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
        response = await client.post("/api/graph-data/export", json=payload)
        assert response.status_code == 200
        assert "Year,Total Seats,Students Enrolled" in response.text
