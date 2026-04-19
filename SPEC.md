# ExecutionOS — AI Execution Diagnosis System

<!-- redeploy trigger -->

## 1. Project Overview

**Project Name:** ExecutionOS  
**Type:** Full-stack Web Application (MVP)  
**Core Functionality:** An AI-powered funnel that diagnoses why users fail to execute tasks, generates personalized execution reports, recommends plans based on budget, and captures waitlist entries for validation.  
**Target Users:** Professionals, entrepreneurs, and productivity seekers who struggle with task execution and consistency.

---

## 2. UI/UX Specification

### 2.1 Design Philosophy
- **Aesthetic:** Clinical precision meets human empathy — Think "medical diagnosis for productivity" with dark sophisticated undertones
- **Typography:** 
  - Headings: "Outfit" (700 weight) — Modern, bold, confident
  - Body: "DM Sans" (400/500 weight) — Clean, readable
  - Monospace accents: "JetBrains Mono" for scores/data
- **Color Palette:**
  - Background Primary: `#0A0A0F` (deep black)
  - Background Secondary: `#12121A` (card surfaces)
  - Accent Primary: `#00E5A0` (mint green — execution/confidence)
  - Accent Secondary: `#FF6B6B` (coral red — problems/issues)
  - Accent Tertiary: `#6C5CE7` (purple — AI/tech)
  - Text Primary: `#FFFFFF`
  - Text Secondary: `#8A8A9A`
  - Border: `#2A2A35`
- **Visual Effects:**
  - Subtle glow effects on interactive elements
  - Glassmorphism cards with `backdrop-filter: blur(12px)`
  - Smooth micro-animations on state changes
  - Progress indicators with gradient fills

### 2.2 Page Specifications

#### **Landing Page**
- **Hero Section:**
  - Large headline: "Why You Can't Execute — And How to Fix It"
  - Subheadline: "AI-powered diagnosis reveals the hidden barriers stopping you from completing what you start"
  - Primary CTA button: "Start Free Diagnosis" (mint green, glowing)
  - Secondary: "See how it works" link
- **Features Section (3 cards):**
  1. "AI Execution Analysis" — Deep behavioral diagnosis
  2. "Personalized System" — Your custom execution blueprint
  3. "Budget-Aligned Plans" — Options that match your reality
- **Trust Indicators:**
  - "Free diagnosis • No payment required • No account needed"

#### **Interview Page**
- **Layout:** Multi-step form with progress bar
- **Progress Bar:** Gradient fill from left, percentage indicator
- **Step 1 — Basic Info:**
  - Full Name (text input)
  - Email (email input)
  - Phone Number (tel input)
- **Step 2 — Budget Selection:**
  - Question: "What's your monthly budget for productivity solutions?"
  - Options (radio cards with icons):
    - Low ($0–$50) — "Just getting started"
    - Medium ($50–$150) — "Ready to invest in myself"
    - High ($150+) — "Full commitment to transformation"
- **Step 3 — Goals & Struggles:**
  - Occupation / Role (text)
  - Main Goals (textarea)
  - Biggest Productivity Struggle (textarea)
  - Daily Routine Description (textarea)
- **Step 4 — Behavior:**
  - Reason for inconsistency (textarea)
  - Time available per day (select: <1hr, 1-2hr, 2-4hr, 4+hr)
  - Tools currently used (multi-select chips: Notion, Calendar, Todoist, Obsidian, Custom)
- **Navigation:** Back / Next buttons, Submit on final step
- **Validation:** Inline error messages, disabled submit until valid

#### **Report Page**
- **Layout:** Scrollable report with sections
- **Header:**
  - "Your Execution Leak Report™"
  - Large score display: "XX/100" with circular progress ring
  - Risk level badge (Low/Medium/High with color coding)
- **Section 1 — Primary Bottleneck:**
  - Card with icon, title, detailed explanation
- **Section 2 — Secondary Bottlenecks:**
  - List of up to 2 issues with brief descriptions
- **Section 3 — Behavioral Pattern:**
  - Analysis of user's consistency pattern
- **Section 4 — Psychological Root Cause:**
  - Deep dive into why procrastination happens
- **Section 5 — 3-Step Fix Plan:**
  - Numbered steps with actionable items
- **Footer:** "Based on your analysis, we recommend:" with plan badge

#### **Plan Selection Page**
- **Header:** "Choose Your Execution System"
- **Layout:** Two large plan cards side-by-side (stacked on mobile)
- **Card A — Blueprint Plan ($47):**
  - Price prominently displayed
  - Features list (5-6 items)
  - "Best for:" description
  - AI Recommendation badge (if recommended)
  - "Join Waitlist" button
  - "Switch recommendation" link
- **Card B — Premium ExecutionOS:**
  - Price displayed (subscription or high-ticket)
  - Features list (8-10 items)
  - "Best for:" description
  - AI Recommendation badge (if recommended)
  - "Join Waitlist" button
  - "Switch recommendation" link
- **Recommendation Logic:**
  - Badge shows "AI Recommended" with checkmark on recommended plan
  - Both cards visible, user can choose either

#### **Waitlist Page**
- **Form Fields:**
  - Full Name
  - Email
  - Phone Number
- **Hidden Data (from context):**
  - user_id
  - selected_plan
  - ai_recommended_plan
  - budget_tier
  - execution_score
- **Submit Button:** "Join Waitlist"
- **Success State:**
  - Checkmark animation
  - "You're on the list!"
  - "We'll be in touch soon at [email]"
  - "Share with friends" optional

---

## 3. Functionality Specification

### 3.1 Core Features

#### **Interview System**
- Multi-step form with state persistence
- Client-side validation before each step
- Final submission sends all data to backend
- Backend stores interview in database

#### **AI Report Generation**
- Triggered immediately after interview submission
- Calls OpenAI API with interview data
- Parses AI response into structured JSON
- Stores report in database
- Displays report to user

#### **Budget-Based Recommendation**
- Server-side logic evaluates budget + behavior
- Maps budget to recommended plan:
  - Low → Blueprint Plan ($47)
  - Medium → Premium Lite / Blueprint
  - High → Premium ExecutionOS
- Stores recommendation in database

#### **User Override System**
- "Switch recommendation" updates stored
- Re-runs AI evaluation with budget context
- Shows new reasoning in UI

#### **Waitlist Capture**
- All plan selections lead to waitlist
- Stores: user info, selected plan, recommended plan, budget tier, score, timestamp
- No payment processing

### 3.2 Data Flow

```
User → Interview Form → Submit → API → Store in 'interviews' → Trigger AI Report
AI Report → Store in 'reports' → Generate Recommendation → Store in 'users' → Show Report Page
User → Select Plan → Waitlist Form → Submit → API → Store in 'waitlist' → Show Confirmation
```

### 3.3 Database Schema (Supabase)

**users**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| full_name | text | User's full name |
| email | text | User's email |
| phone | text | User's phone |
| budget_tier | text | 'low'/'medium'/'high' |
| ai_recommendation | text | 'blueprint'/'premium' |
| execution_score | int | Score from report |
| created_at | timestamp | Creation timestamp |

**interviews**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK to users |
| budget | text | Budget selection |
| occupation | text | User's role |
| goals | text | Main goals |
| struggles | text | Productivity struggles |
| routine | text | Daily routine |
| inconsistency_reason | text | Reason for inconsistency |
| time_available | text | Available time |
| tools_used | text[] | Tools user currently uses |
| created_at | timestamp | Submission timestamp |

**reports**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK to users |
| execution_score | int | 0-100 score |
| primary_bottleneck | text | Main issue |
| secondary_bottlenecks | text[] | Up to 2 issues |
| behavioral_pattern | text | Pattern analysis |
| psychological_root | text | Root cause |
| risk_level | text | 'low'/'medium'/'high' |
| fix_plan | text[] | 3-step plan |
| created_at | timestamp | Generation timestamp |

**waitlist**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK to users |
| selected_plan | text | User's choice |
| recommended_plan | text | AI recommended |
| budget_tier | text | Budget level |
| execution_score | int | From report |
| final_ai_reasoning | text | Why this plan |
| created_at | timestamp | Submission timestamp |

---

## 4. Technical Architecture

### 4.1 Tech Stack
- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** CSS Modules + CSS Variables
- **Backend:** Next.js API Routes (serverless functions)
- **Database:** Supabase (PostgreSQL)
- **AI:** OpenAI GPT-4 API
- **Deployment:** Vercel

### 4.2 API Routes

| Route | Method | Function |
|-------|--------|----------|
| `/api/submit-interview` | POST | Store interview, trigger AI |
| `/api/generate-report` | POST | Call OpenAI, generate report |
| `/api/get-report` | GET | Retrieve user report |
| `/api/submit-waitlist` | POST | Store waitlist entry |
| `/api/switch-recommendation` | POST | Re-evaluate and update |
| `/api/get-recommendation` | GET | Get current recommendation |

### 4.3 Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
```

---

## 5. Acceptance Criteria

### 5.1 Success Conditions
- [ ] Landing page loads with hero, features, CTA
- [ ] Interview form captures all 12+ fields across 4 steps
- [ ] Progress bar updates correctly on navigation
- [ ] Interview data stores in database on submit
- [ ] AI report generates with all 7 required sections
- [ ] Report displays with score, bottlenecks, fix plan
- [ ] Budget-based recommendation shows correct plan
- [ ] Both plan options visible with recommendation badges
- [ ] "Switch recommendation" updates stored preference
- [ ] Waitlist form captures all required fields
- [ ] Waitlist stores all contextual data
- [ ] Success confirmation displays after submission
- [ ] All data flows correctly through the system

### 5.2 Visual Checkpoints
- Dark theme with mint/coral accents applied
- Glassmorphism cards with proper blur
- Smooth animations on interactions
- Responsive layout works on mobile
- Progress bar shows gradient fill
- Score display has circular ring animation

---

## 6. File Structure

```
execution-os/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx              # Root layout
│   ├── interview/
│   │   └── page.tsx            # Multi-step interview
│   ├── report/
│   │   └── page.tsx            # Report display
│   ├── plans/
│   │   └── page.tsx            # Plan selection
│   ├── waitlist/
│   │   └── page.tsx            # Waitlist form
│   └── api/
│       ├── submit-interview/
│       │   └── route.ts
│       ├── generate-report/
│       │   └── route.ts
│       ├── get-report/
│       │   └── route.ts
│       ├── submit-waitlist/
│       │   └── route.ts
│       └── switch-recommendation/
│           └── route.ts
├── components/
│   ├── ProgressBar.tsx
│   ├── PlanCard.tsx
│   ├── ScoreRing.tsx
│   └── ...
├── lib/
│   ├── supabase.ts             # Supabase client
│   ├── openai.ts               # OpenAI helper
│   └── ...
├── styles/
│   ├── globals.css
│   └── variables.css
├── package.json
├── tsconfig.json
└── next.config.js
```
