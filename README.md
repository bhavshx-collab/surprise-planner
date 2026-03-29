# AI Surprise Planner 🎁

<div align="center">

**Plan deeply personal surprises in seconds — powered by AI.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-black?style=for-the-badge)](https://surprise-planner-bhavesh-kumats-projects.vercel.app)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)

</div>

---

## The Problem

Planning a meaningful surprise is stressful. You don't know where to start, what fits the budget, or how to make it feel genuinely personal. Most people either give up or default to something generic.

## The Solution

AI Surprise Planner takes everything you know about the person — their interests, your relationship, the occasion, the city, and your budget — and generates a fully personalised surprise plan in seconds. Not a template. An actual plan built around them.

---

## Live Demo

Try it here → **https://surprise-planner-nu.vercel.app**

No account needed. Fill in the details and get a complete plan instantly.

---

## Key Features

### For users planning surprises
- **AI plan generation** — Personalised surprise idea, emotional message, and full before/during/after timeline
- **Smart budget breakdown** — Visual allocation across venue, food, decor, gifts, and buffer
- **Contextual AI chatbot** — Floating assistant that knows your specific plan and answers real-time questions like "how do I book this in Mumbai?"
- **Shareable plan links** — Every plan gets a unique URL anyone can open
- **Inspiration gallery** — Browse real anonymised plans filtered by occasion and vibe
- **Save and revisit** — All past plans saved to your account

### For local businesses
- **Vendor marketplace** — Cafes, florists, hotels, photographers can list themselves
- **Self-signup flow** — 3-step registration with category, pricing, and contact details
- **Vendor dashboard** — Manage listing, check approval status, see inquiries
- **Admin approval system** — All listings reviewed before going live

### Product quality
- **Luxury landing page** — Animated dark theme with gold accents and mouse-following glow
- **Multi-step form wizard** — 3-step flow with progress bar
- **Post-surprise ratings** — Users rate how it went; powers social proof on landing page
- **Magic link auth** — Passwordless email login, zero friction

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Styling | Custom CSS |
| Backend | Python Flask |
| AI | Groq API (Llama 3.1-8b) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (magic link) |
| Deployment | Vercel + Render |

---

## Architecture

```
User → React Frontend (Vercel)
           ↓
     Flask Backend (Render)
           ↓
     Groq AI (Llama 3.1)
           ↓
     Supabase (PostgreSQL)
```

**Request flow:**
1. User fills in occasion, relationship, interests, budget, tone
2. React sends POST to Flask `/api/surprise/plan`
3. Flask builds a personalised prompt and calls Groq API
4. Groq returns structured JSON — idea, message, timeline, budget breakdown
5. Flask saves to Supabase and returns plan with unique ID
6. React displays result and updates URL to shareable link

---

## Project Structure

```
surprise-planner/
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 # Main app + view routing
│   │   ├── LandingPage.jsx         # Dark luxury landing page
│   │   ├── AuthPage.jsx            # Magic link login
│   │   ├── ChatWidget.jsx          # Floating contextual chatbot
│   │   ├── MyPlans.jsx             # Saved plans dashboard
│   │   ├── VendorSignup.jsx        # 3-step vendor registration
│   │   ├── VendorDashboard.jsx     # Vendor management panel
│   │   ├── VendorDirectory.jsx     # Public vendor directory
│   │   ├── AdminDashboard.jsx      # Admin approval interface
│   │   ├── InspirationGallery.jsx  # Public plan gallery
│   │   ├── FeedbackModal.jsx       # Post-surprise star ratings
│   │   ├── RatingsWidget.jsx       # Social proof display
│   │   ├── App.css                 # All styles
│   │   └── supabase.js             # Supabase client config
│   ├── vercel.json
│   └── package.json
├── backend/
│   ├── app.py                      # Flask API + all routes
│   ├── groq_service.py             # AI prompt engineering
│   ├── requirements.txt
│   └── render.yaml
└── README.md
```

---

## Running Locally

### Prerequisites
- Node.js 18+
- Python 3.10+
- Supabase project (free)
- Groq API key (free)

### Backend

```bash
cd backend
pip install -r requirements.txt
```

Create `backend/.env`:
```
SUPABASE_URL=supabase_project_url
SUPABASE_KEY=supabase_anon_key
GROQ_API_KEY=groq_api_key

```

```bash
python app.py
```

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

```bash
npm run dev
```

---

## Database Setup

Run in Supabase SQL Editor:

```sql
create table plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid,
  occasion text,
  relationship text,
  tone text,
  budget text,
  city text,
  interests text[],
  description text,
  plan_data jsonb not null,
  created_at timestamp with time zone default now()
);

create table vendors (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null,
  description text,
  city text not null,
  address text,
  phone text,
  whatsapp text,
  email text,
  website text,
  instagram text,
  price_range text,
  min_budget integer,
  max_budget integer,
  status text default 'pending',
  is_featured boolean default false,
  created_at timestamp with time zone default now(),
  approved_at timestamp with time zone
);

create table ratings (
  id uuid default gen_random_uuid() primary key,
  plan_id uuid references plans(id),
  rating integer not null check (rating >= 1 and rating <= 5),
  review text,
  occasion text,
  created_at timestamp with time zone default now()
);
```

---

## How the AI Works

The core intelligence is in the prompt engineering layer, not the model itself.

The prompt includes:
- **Persona priming** — Sets the AI as a world-class surprise planner
- **Anti-cliche rules** — Bans generic suggestions explicitly
- **Tone calibration** — 6 tones with specific output constraints
- **Budget enforcement** — Breakdown must sum exactly to the user's budget
- **Structured output** — Strict JSON schema with fallback parsing

**Fallback architecture:**
- Malformed JSON → strips markdown, retries parsing
- Missing budget breakdown → auto-calculates 30/25/20/15/10 split
- API failure → returns safe fallback plan instead of crashing

---

## Deployment

**Frontend — Vercel**
- Root directory: `frontend`
- Add all `VITE_*` environment variables

**Backend — Render**
- Root directory: `backend`
- Build: `pip install -r requirements.txt`
- Start: `gunicorn app:app`
- Add all environment variables

---

## Roadmap

- [ ] PDF export of surprise plans
- [ ] Surprise countdown timer page
- [ ] Animated surprise reveal page for recipients
- [ ] Email and WhatsApp reminders before surprise date
- [ ] Stripe subscriptions — Pro tier
- [ ] Multi-language support (Hindi, Tamil, Telugu)
- [ ] Conversational AI planning mode
- [ ] Mobile app

---

## Built By

**Bhavesh Kumar** — building AI-powered products.

- - LinkedIn: [linkedin.com/in/bhavesh-kumar-52b46a301](https://linkedin.com/in/bhavesh-kumar-52b46a301)
- GitHub: [@bhavshx-collab](https://github.com/bhavshx-collab)
- - Live: [surprise-planner-bhavesh-kumats-projects.vercel.app](https://surprise-planner-bhavesh-kumats-projects.vercel.app)
  
**Rekharam** - all rounder.

---

## License

MIT
