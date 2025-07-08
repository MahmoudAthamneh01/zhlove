🕹️ ZH-Love Gaming Platform — AI Implementation Prompt for Development Agent
🧠 Role Definition
You are an AI-Powered Full-Stack Development Architect and UX/UI Expert. Your task is to fully build a gaming-centric web platform based on the detailed documentation for “ZH-Love.com”, a community-focused site for Command & Conquer: Generals Zero Hour. Your work will include frontend and backend development, database design, API integrations, and AI-enhanced tools. You will also handle UI/UX using the visual identity below.
🎨 Visual Identity
Use the following dark-themed color palette:
#000000 (background base)
#1D1834 (primary dark layer)
#1F152D (secondary containers)
#505360 (text, borders, shadows)
#281B39 (buttons, highlights, active states)
Typography:
Arabic: Bahij TheSansArabic
English: Avenir
Direction:
RTL for Arabic, LTR for English
Responsive for mobile and desktop
🎯 Platform Goals
Create the largest online Arabic & global community for Generals Zero Hour, enabling forums, rankings, tournaments, support, content sharing, and clan battles — all within an intuitive and visually clean interface.

🧱 Core Components to Build
1. 🌍 Home Page (Public)
Header with language toggle, notifications, search, social icons, login/profile dropdown
Dynamic banner carousel with CTA overlays
Realtime stats widgets: players online, forum activity, tournaments, etc.
Feature blocks:
oCreate your clan
oTrack your global ranking
oPost on forums
oHost custom tournaments
Donation block with CTA
FAQ / Policy / About snippets
Sidebar menu (like YouTube)
2. 📚 Game Information Page
Timeline of game evolution (2003–2023)
Famous players and tournament champions
Gameplay modes explained
Tactical guide (pro + beginner)
Rich Text CMS Editor for admins to manage content
3. 🛠️ Support Page
Support request form
Download official game version
Common troubleshooting FAQs
All content editable via admin CMS
4. 💬 Forum & Community News
Facebook-like feed for posts (text, images, short video <10MB)
Interactions: Like, Comment, Nested Comments, Share, Report
Advanced editor for posts (Text, Uploads, Editor)
Filter posts (Most Liked / Most Recent / Most Commented)
Pin important posts by admins
User profile preview popover on username hover
5. 🏆 Tournaments & Challenges
Sections: Tournaments / Challenges
Filters: Active / Ended / Archived / Search
Card preview of each event (title, host, prize, type, streamer)
Detail view includes:
oRegistration button
oParticipants list
oComments block (forum-style)
oEmbedded Challonge bracket
oMap file download (if any)
oStatus (Join, Close Registration)
Admin/Host Tournament Creation Form:
Name, Image, Type (1v1–FFA), Starting Cash, Ruleset, Prize Info
Streamer selection (YouTube channel dropdown)
Schedule (Start/End GMT)
Rich Text description
File upload (maps ZIP/RAR <10MB)
Challenge Creation Form:
Player invites (dropdown), Type, Ruleset, Prize, Time
Streamer, Notes, Notification System for invites
Admin approval workflow before publish
6. 📺 Streamers Page
Grid of all streamers
Auto-fetch latest YouTube videos via API
Preview videos inside modal popup
Sort by popularity (likes or subscribers)
7. 🎮 Replays Page
Replay uploads by users (title + short desc)
Admin-curated replays section
Replay categories: Player Highlights / Tournaments
Like & Download buttons
8. 📊 Rankings & Clans
Rankings (Integrated with zhstats or Gentool)
Auto-fetch match data via cron from external source
Filter by map type [RANK]
Ranking system logic similar to Elo
Clan Wars System:
Clans of max 4 players
Match results reported by losing team only
Points system logic provided by admin
Clan profile: Logo, Win/Loss, Members, Trophies
Match report form: Select opponent clan, auto-calculate points
Leader can: Kick, Invite, Transfer ownership
Clan badges and trophies
9. 🔐 Profiles, Messages, Settings
User profile with: avatar, username, clan, badges, XP, posts, rank points
Private message system
User settings: password, email, privacy
Admin translation system (content in AR/EN)
10. 🏅 Badges & Rewards
Automatic and admin-assigned badges
Badge types:
oForum Engagement (likes/posts)
oTournament Champion / Sponsor / Admin
oRank milestones (Expert 10K etc)
🔒 Other Pages:
Privacy Policy, Terms
Feedback, Contact
About Us

⚙️ Admin Panel
Manage Users, Clans, Badges
Manage Tournaments / Challenges approval
Content Management: Game Info, Support, FAQs
Approve streamers and link channels
View reports, flags, support tickets

🔗 APIs to Prepare
YouTube Data API (streamers)
Challonge API (brackets)
Gentool / zhstats integration (ranking data)
Google Translate API (optional)

📋 Development Plan (Phases)
Phase 1 — Home + Game Info + Support
Base layout, multilingual engine, CMS
Phase 2 — Forum, Profile, Messages
Build full community engine + interaction
Phase 3 — Tournaments, Challenges, Replays
Advanced form logic, user moderation flows
Phase 4 — Rankings & Clan Engine
External API sync + gamification logic
Phase 5 — Streamers + Final Polish
Video grid, sorting, badges system, testing

🎯 Success Metrics
Daily active users
Forum post frequency
Number of tournaments created
Challenge participation rate
Clan creation and match reports



⚙️ التكنولوجيا المستخدمة في مشروع ZH-Love
🧠 إطار العمل العام
نظام ZH-Love سيُبنى على بنية متكاملة تعتمد على تقنيات حديثة تشمل:
🖥️ الواجهة الأمامية (Frontend)

Framework: Next.js 14 + App Router  
Language: TypeScript  
Styling: Tailwind CSS + CSS Modules  
State Management: Zustand  
UI Library: shadcn/ui + Radix UI  
Animations: Framer Motion  
Form Handling: React Hook Form  
Multilingual Support: next-intl

🧠 الذكاء الاصطناعي (AI & Machine Learning)

Framework: PyTorch  
NLP Engine: OpenAI GPT-4 Turbo  
Text Embedding: OpenAI text-embedding-3-large  
Vector DB: Weaviate or Pinecone  
Ranking Intelligence: Elo Rating Algorithm (customizable)  
ML Logic: Python + scikit-learn + Transformers

🗃️ الخلفية (Backend)

Runtime: Node.js (Express.js)  
Language: TypeScript  
Database: PostgreSQL  
ORM: Prisma  
Cache: Redis  
Queue Management: BullMQ  
Authentication: NextAuth.js + JWT  
File Upload: AWS S3 or Cloudinary

🔁 التكاملات (APIs & External Services)

- YouTube Data API: ربط تلقائي مع قنوات الستريمرز  
- Challonge API: جداول البطولات والتحديات  
- zhstats / Gentool API: مزامنة نتائج المباريات  
- Google Translate API: ترجمة تلقائية للمحتوى (اختياري)  
- Email Service: SendGrid  
- Realtime Notifications: Pusher أو Socket.IO

⚙️ نظام الإدارة والتشغيل

Admin Panel: Built with Next.js + Tailwind  
CMS: Headless via custom admin CMS  
Monitoring: LogRocket + Sentry  
CI/CD: GitHub Actions  
Hosting Frontend: Vercel  
Hosting Backend: DigitalOcean App Platform or AWS EC2  
DevOps: Docker + Docker Compose

🔐 الأمان والامتثال

- حماية XSS, CSRF, SQL Injection  
- SSL Certificates  
- Google reCAPTCHA v3  
- RBAC (Role-Based Access Control)  
- تشفير كلمات المرور باستخدام bcrypt  
- سياسة النسخ الاحتياطي اليومية
