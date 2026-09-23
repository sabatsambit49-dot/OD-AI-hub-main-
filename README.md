# 🎓 OD AI HUB & EduTrack — Platform & Academy

OD AI HUB is an AI talent-to-innovation platform empowering students, professionals, institutions, and businesses in Odisha to learn, build, innovate, and scale. This repository hosts both:
1. **The Public Read-Only OD AI HUB & Academy Website** (high-performance viewer with 3D ring, course directory, drawer details, and visitor enquiries).
2. **The Admin Management Console** (educational hierarchy, course catalog, categories, learner enquiries, batch CSV imports, and user roles).

---

## 🚀 Quick Links (Localhost Access)

Once the application servers are running:

* 🌐 **Public OD AI HUB Website:** [http://localhost:8000/](http://localhost:8000/)
* 🎓 **Public OD AI Academy Page:** [http://localhost:8000/academy](http://localhost:8000/academy)
* 🖥️ **Admin Console (React + Vite):** [http://localhost:3000/management](http://localhost:3000/management)
* 📖 **Public & Admin Swagger API Docs:** [http://localhost:8000/api/docs](http://localhost:8000/api/docs)
* 📚 **Interactive ReDoc API Docs:** [http://localhost:8000/api/redoc](http://localhost:8000/api/redoc)
* ⚙️ **Backend Health Check:** [http://localhost:8000/health](http://localhost:8000/health)

---

## 🛠️ How to Run the Website & Admin Together

### 1. Start the Backend API & Public Website Server (FastAPI)
The FastAPI server serves both the **Public Website** (at `/` and `/academy`) and the **REST APIs** (under `/api/v1` and `/api`):

```bash
# In terminal 1: Navigate to backend
cd backend

# Install dependencies (if not already installed)
pip install -r requirements.txt

# Start the FastAPI server on port 8000
python -m uvicorn app.main:app --reload --port 8000
```
> The server automatically connects to `backend/edutrack.db` (SQLite in development with WAL mode and foreign keys enabled).

### 2. Start the Admin Console Frontend (React + Vite)
The admin console connects to the backend on port 8000 for all CRUD and authentication requests:

```bash
# In terminal 2: Navigate to frontend
cd frontend

# Install dependencies (if not already installed)
npm install

# Start Vite dev server on port 3000
npm run dev
```

Visit **[http://localhost:3000/management](http://localhost:3000/management)** to access the Admin Management Console:
* **Admin Login**: Username: `testadmin` or `admin123`
* **Tabs available**:
  * **OD AI Academy Courses**: Search, filter by category/mode/status, add/edit course, duplicate as draft, publish/unpublish/archive, and reorder.
  * **Academy Pillars**: Customize tagline, accent colors, icon letter, description, and display order for all 6 program pillars.
  * **Learner Enquiries**: View incoming enquiries, filter by status (New, Contacted, Closed), update status, and export to CSV.

---

## 🔄 Instant Sync Between Admin and Public Website
Both the Admin Console and the Public Website use the **exact same database**. When you create or update a course in the Admin:
1. It is saved in the `courses` table immediately.
2. The Public API caches results for a maximum of **30 seconds** (`Cache-Control: public, max-age=30`).
3. Visiting [http://localhost:8000/academy](http://localhost:8000/academy) reflects the published course instantly.

---

## 🐘 Switch to PostgreSQL (Production Ready)

All database models use **portable SQLAlchemy column types** (`Numeric(10,2)` for money, `Integer`, `String`, `Text`, `Boolean`, `DateTime`, `JSON`). The database connection comes strictly from the `DATABASE_URL` environment variable.

### Step 1: Start PostgreSQL via Docker Compose
A ready-to-run Docker Compose configuration is included in the project root:

```bash
# Start PostgreSQL service on localhost:5432
docker compose up -d
```
Default credentials:
* **Host**: `localhost`
* **Port**: `5432`
* **User**: `postgres`
* **Password**: `postgrespassword`
* **Database**: `edutrack`

### Step 2: Set the DATABASE_URL Environment Variable
Set `DATABASE_URL` in your shell or inside `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:postgrespassword@localhost:5432/edutrack
```

### Step 3: Run Database Migrations (Alembic)
Apply all migrations to PostgreSQL:

```bash
cd backend
alembic upgrade head
```

### Step 4: Transfer Existing SQLite Data to PostgreSQL
A data migration script is provided in `backend/scripts/migrate_sqlite_to_postgres.py`:

```bash
# Transfer all tables and update sequence IDs
python backend/scripts/migrate_sqlite_to_postgres.py --sqlite-path backend/edutrack.db --postgres-url postgresql://postgres:postgrespassword@localhost:5432/edutrack
```

### Step 5: Start the App
Start FastAPI with the PostgreSQL connection:
```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

---

## 🧪 Automated Testing

Run the automated test suite with pytest:

```bash
cd backend
python -m pytest tests/test_academy_api.py -v
```
All 14 tests verify:
* Active category retrieval with cache headers
* Category-filtered published courses with price and duration formatting
* Detail views and prevention of draft/archived exposure
* Anti-spam honeypot rejection and IP rate limiting on enquiry submissions
* Role-based admin route security
* Delivery of public website HTML pages (`/`, `/academy`, `/technologies`)
>>>>>>> 29772c4 (feat: separate external OD AI HUB website with 3D ring and dedicated program details pages, management console sync, and implementation plans)
