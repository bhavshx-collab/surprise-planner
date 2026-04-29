# AI Surprise Planner 🎁

<div align="center">

**Plan deeply personal surprises in seconds — powered by AI.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-black?style=for-the-badge)](https://surprise-planner-nu.vercel.app)
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
- **AI Concierge mode** — Plan through natural conversation instead of forms
- **Smart budget breakdown** — Visual allocation across venue, food, decor, gifts, and buffer
- **Contextual AI chatbot** — Floating assistant that knows your specific plan and answers real-time questions
- **PDF export** — Download beautiful PDF versions of your plans (Pro)
- **Event reminders** — Email/WhatsApp reminders before the big day
- **Interactive reveal link** — Animated surprise reveal page to share with the recipient
- **Memory scrapbook** — After the event, save notes to relive the magic
- **Shareable plan links** — Every plan gets a unique URL anyone can open
- **Inspiration gallery** — Browse real anonymised plans filtered by occasion and vibe
- **Calendar export** — Download .ics file for your calendar app
- **AI plan tweaking** — Modify generated plans with natural language instructions

### For local businesses
- **Vendor marketplace** — Cafes, florists, hotels, photographers can list themselves
- **Self-signup flow** — 3-step registration with category, pricing, and contact details
- **Vendor owner dashboard** — Analytics, inquiry management, profile editor
- **Quote requests** — Users can request quotes from matched vendors
- **Admin approval system** — All listings reviewed before going live

### Platform
- **Dual dashboards** — Separate premium dashboards for users and vendor owners
- **Pro subscription** — Razorpay-powered Pro tier with PDF export, unlimited saves
- **Luxury landing page** — Animated dark theme with gold accents and mouse-following glow
- **Mobile responsive** — Hamburger nav, optimised layouts for all screen sizes
- **Legal pages** — Privacy Policy, Terms of Service, About & Contact
- **Toast notifications** — No browser alert() popups
- **Magic link auth** — Passwordless email login via Supabase

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + Vite |
| Styling | Custom CSS (dark luxury theme) |
| Backend | Python Flask |
| AI | Groq API (Llama 3.1-8b) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (magic link) |
| Payments | Razorpay |
| PDF | jsPDF + html2canvas |
| Deployment | Vercel (frontend) + Render (backend) |

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
1. User fills in occasion, relationship, interests, budget, tone (or uses AI Concierge)
2. React sends POST to Flask `/api/surprise/plan`
3. Flask builds a personalised prompt and calls Groq API
4. Groq returns structured JSON — idea, message, timeline, budget breakdown
5. Flask saves to Supabase, matches local vendors, returns plan with unique ID
6. React displays result with timeline, budget, vendors, and action buttons

---

## Project Structure

```
surprise-planner/
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 # Main app + view routing
│   │   ├── App.css                 # All styles + dark theme
│   │   ├── LandingPage.jsx         # Dark luxury landing page
│   │   ├── AuthPage.jsx            # Magic link login
│   │   ├── ChatWidget.jsx          # Floating contextual chatbot
│   │   ├── ConciergeMode.jsx       # AI conversational planning
│   │   ├── UserDashboard.jsx       # User plans + stats + account
│   │   ├── VendorDashboard.jsx     # Vendor analytics + inquiries + profile
│   │   ├── VendorSignup.jsx        # 3-step vendor registration
│   │   ├── VendorDirectory.jsx     # Public vendor directory
│   │   ├── AdminDashboard.jsx      # Admin approval interface
│   │   ├── InspirationGallery.jsx  # Public plan gallery
│   │   ├── ReminderSetup.jsx       # Email/WhatsApp reminders
│   │   ├── RevealPage.jsx          # Animated surprise reveal
│   │   ├── Scrapbook.jsx           # Memory scrapbook
│   │   ├── PrintablePlan.jsx       # PDF-ready plan view
│   │   ├── PricingPage.jsx         # Pro tier pricing
│   │   ├── PaymentModal.jsx        # Razorpay checkout
│   │   ├── RequestQuoteModal.jsx   # Vendor quote requests
│   │   ├── Toast.jsx               # Toast notification system
│   │   ├── PrivacyPolicy.jsx       # Privacy policy page
│   │   ├── TermsOfService.jsx      # Terms of service page
│   │   ├── AboutContact.jsx        # About + contact page
│   │   ├── NotFound.jsx            # 404 page
│   │   ├── usePDFExport.js         # PDF generation hook
│   │   ├── useProStatus.js         # Pro subscription hook
│   │   ├── calendarUtils.js        # ICS calendar export
│   │   ├── supabase.js             # Supabase client config
│   │   └── index.css               # Minimal reset
│   ├── index.html                  # SEO meta + OG tags
│   ├── vercel.json
│   └── package.json
├── backend/
│   ├── app.py                      # Flask API + all routes
│   ├── groq_service.py             # AI prompt engineering
│   ├── social_service.py           # Social features service
│   ├── moodboard.py                # Moodboard generation
│   ├── migrations/                 # SQL migrations
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
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
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
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
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

create table pro_users (
  id uuid default gen_random_uuid() primary key,
  user_id uuid unique,
  email text,
  razorpay_payment_id text,
  expires_at timestamp with time zone default (now() + interval '30 days'),
  created_at timestamp with time zone default now()
);

create table reminders (
  id uuid default gen_random_uuid() primary key,
  plan_id uuid references plans(id),
  user_id uuid,
  user_email text not null,
  whatsapp_number text,
  event_date date not null,
  occasion text,
  plan_idea text,
  status text default 'scheduled',
  created_at timestamp with time zone default now()
);

create table quote_requests (
  id uuid default gen_random_uuid() primary key,
  plan_id uuid,
  vendor_name text,
  vendor_email text,
  user_name text,
  user_email text,
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

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/surprise/plan` | POST | Generate AI surprise plan |
| `/api/surprise/plan/:id` | GET | Retrieve saved plan |
| `/api/surprise/tweak` | POST | AI-modify existing plan |
| `/api/chat` | POST | Contextual plan chatbot |
| `/api/concierge` | POST | Conversational planning mode |
| `/api/moodboard` | POST | Generate moodboard images |
| `/api/quote/request` | POST | Send vendor quote requests |
| `/api/payment/verify` | POST | Verify Razorpay payment |
| `/api/payment/status` | GET | Check Pro subscription |
| `/api/reminder/schedule` | POST | Schedule event reminder |
| `/api/reminder/send-due` | POST | Cron: send due reminders |
| `/api/scrapbook/story` | POST | Generate memory story |
| `/api/social/*` | Various | Social event features |

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

- [x] AI plan generation with timeline + budget
- [x] Vendor marketplace with approval flow
- [x] Interactive reveal links
- [x] PDF export of surprise plans
- [x] AI Concierge conversational planning
- [x] Email/WhatsApp reminders
- [x] Memory scrapbook
- [x] Razorpay Pro subscription
- [x] Dual dashboards (user + vendor)
- [x] Mobile responsive navigation
- [x] Legal pages (Privacy, Terms, About)
- [ ] Custom domain setup
- [ ] Multi-language support (Hindi, Tamil, Telugu)
- [ ] Mobile app (React Native)
- [ ] Surprise countdown timer page
- [ ] Vendor review system

---

## Built By

**Bhavesh Kumar** — building AI-powered products.

- LinkedIn: [linkedin.com/in/bhavesh-kumar-52b46a301](https://linkedin.com/in/bhavesh-kumar-52b46a301)
- GitHub: [@bhavshx-collab](https://github.com/bhavshx-collab)
- Live: [surprise-planner-nu.vercel.app](https://surprise-planner-nu.vercel.app)
  
**Rekharam** — co-founder.

---

## License

MIT
