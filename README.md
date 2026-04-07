# 🚀 Node.js + Express CRUD App

REST API with Express, AWS RDS PostgreSQL, GitHub Actions CI/CD, and Render deployment.

---

## 📁 Project Structure

```
crud-app/
├── src/
│   ├── config/
│   │   └── db.js              # PostgreSQL pool config
│   ├── controllers/
│   │   └── userController.js  # CRUD logic
│   ├── middleware/
│   │   └── validate.js        # Input validation
│   ├── models/
│   │   └── userModel.js       # DB queries + table init
│   ├── routes/
│   │   └── userRoutes.js      # Express routes
│   ├── app.js                 # Express app setup
│   └── index.js               # Server entry point
├── tests/
│   └── users.test.js          # Jest + Supertest tests
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions pipeline
├── .env.example
├── render.yaml                # Render deployment config
└── package.json
```

---

## ⚙️ Local Setup

```bash
# 1. Clone & install
git clone https://github.com/YOUR_USERNAME/crud-app.git
cd crud-app
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your AWS RDS credentials

# 3. Run in dev mode
npm run dev
```

---

## 🗄️ AWS RDS PostgreSQL Setup (Free Tier)

1. Go to **AWS Console → RDS → Create Database**
2. Choose:
   - Engine: **PostgreSQL**
   - Template: **Free tier**
   - DB instance: `db.t3.micro`
3. Set credentials (username + password)
4. **Connectivity**: Make it publicly accessible (or use VPC)
5. Add **inbound rule** in Security Group: `PostgreSQL / TCP / 5432 / 0.0.0.0/0`
6. Copy the **Endpoint** → paste into `.env` as `DB_HOST`

> ⚠️ The table is auto-created on first server start.

---

## 📡 API Endpoints

| Method | Endpoint         | Description       |
|--------|-----------------|-------------------|
| GET    | /health         | Health check      |
| GET    | /api/users      | Get all users     |
| GET    | /api/users/:id  | Get user by ID    |
| POST   | /api/users      | Create user       |
| PUT    | /api/users/:id  | Update user       |
| DELETE | /api/users/:id  | Delete user       |

### Example Requests

```bash
# Create
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","age":28}'

# Get all
curl http://localhost:3000/api/users

# Update
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Smith"}'

# Delete
curl -X DELETE http://localhost:3000/api/users/1
```

---

## 🧪 Run Tests

```bash
npm test
```

Tests use mocked DB — no real database needed.

---

## 🔄 CI/CD Pipeline (GitHub Actions)

```
Push to main
    │
    ▼
┌─────────┐     fail → ❌ stop
│  TEST   │──────────────────
└─────────┘
    │ pass
    ▼
┌──────────┐
│  DEPLOY  │──► Render (free)
└──────────┘
```

### Setup Steps

#### 1. Push to GitHub
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/crud-app.git
git push -u origin main
```

#### 2. Deploy on Render (free)
1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect your GitHub repo
3. Add environment variables (DB_HOST, DB_USER, etc.)
4. Go to **Settings → Deploy Hook** → copy the URL

#### 3. Add GitHub Secret
1. GitHub repo → **Settings → Secrets → Actions**
2. Add: `RENDER_DEPLOY_HOOK_URL` = (paste Render hook URL)

#### ✅ Done!
Now every `git push` to `main`:
- Runs tests automatically
- Deploys to Render only if tests pass

---

## 🆓 Free Tier Summary

| Service        | Free Plan                              |
|---------------|----------------------------------------|
| GitHub Actions | 2,000 min/month                       |
| Render         | 750 hrs/month (spins down after 15min) |
| AWS RDS        | 750 hrs/month db.t3.micro (1 year)    |
