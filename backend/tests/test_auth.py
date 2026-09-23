import pytest
import httpx
from app.main import app

@pytest.mark.anyio
async def test_register_and_login_user():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
        # Register test admin user
        reg_response = await client.post("/api/auth/register", json={
            "username": "testadmin",
            "email": "admin@example.com",
            "password": "secretpassword123",
            "role": "admin"
        })
        assert reg_response.status_code in [201, 400] # 400 if already exists
        
        # Login test
        login_response = await client.post("/api/auth/login", json={
            "username": "testadmin",
            "password": "secretpassword123"
        })
        assert login_response.status_code == 200
        data = login_response.json()
        assert "access_token" in data
        assert data["user"]["username"] == "testadmin"
        assert data["user"]["role"] == "admin"

@pytest.mark.anyio
async def test_forgot_and_reset_password():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
        # Register user
        await client.post("/api/auth/register", json={
            "username": "resetuser",
            "email": "resetuser@example.com",
            "password": "oldpassword123",
            "role": "editor"
        })

        # Request forgot password
        forgot_res = await client.post("/api/auth/forgot-password", json={"email": "resetuser@example.com"})
        assert forgot_res.status_code == 200
        reset_token = forgot_res.json()["reset_token"]
        assert reset_token is not None

        # Reset password
        reset_res = await client.post("/api/auth/reset-password", json={
            "reset_token": reset_token,
            "new_password": "newpassword123"
        })
        assert reset_res.status_code == 200

        # Try logging in with new password
        login_res = await client.post("/api/auth/login", json={
            "username": "resetuser",
            "password": "newpassword123"
        })
        assert login_res.status_code == 200
