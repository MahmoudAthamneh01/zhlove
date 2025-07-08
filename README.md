# ZH-Love Gaming Platform

![ZH-Love Banner](https://ui-avatars.com/api/?name=ZH+Love&background=1D1834&color=F2C94C&size=120&rounded=true&bold=true)

A comprehensive gaming community platform for Command & Conquer: Generals Zero Hour with full Arabic and English language support. This platform includes user authentication, clan management, tournaments, forums, rankings, and much more.

## 🌟 Features

### 🎯 Core Features
- **Multi-language Support**: Complete Arabic (RTL) and English (LTR) localization
- **User Authentication**: Secure registration, login with NextAuth.js
- **Real-time Statistics**: Live platform stats updated every 30 seconds
- **Responsive Design**: Beautiful UI that works on all devices

### 👥 Community Features
- **User Profiles**: Comprehensive user profiles with stats, badges, and clan membership
- **Clan System**: Create and manage clans with member roles and clan wars
- **Forum System**: Community discussions with categories and moderation
- **Messaging**: Private messaging system between users
- **Rankings**: Global leaderboards for points, wins, level, and win rate

### 🏆 Gaming Features
- **Tournaments**: Create and participate in tournaments with bracket management
- **Challenges**: Issue and accept challenges between players
- **Replays**: Upload and share game replays
- **Badges**: Achievement system with various badge categories
- **Match Reporting**: Track and verify game results

### 📊 Management Features
- **Admin Panel**: Complete administrative interface
- **Support System**: Ticket-based customer support
- **Notifications**: In-app notification system
- **Statistics**: Comprehensive platform analytics

### 🎥 Content Features
- **Streamers**: Integrated YouTube streamer showcase
- **War Room**: Special gaming interface with audio controls
- **Game Information**: Comprehensive game guides and information

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- SQLite (included)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zh-love
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

## 🏗️ Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom gaming theme
- **UI Components**: Radix UI primitives
- **Animations**: Framer Motion
- **Internationalization**: next-intl

### Backend
- **API**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **Password Hashing**: bcryptjs

### Development
- **Package Manager**: npm
- **Type Checking**: TypeScript
- **Linting**: ESLint
- **Code Formatting**: Prettier

## 🗄️ Database Schema

The platform uses a comprehensive database schema with the following main entities:

- **Users**: User accounts with authentication and profile data
- **Clans**: Gaming clans with member management
- **Tournaments**: Tournament system with participants
- **Forum**: Posts, comments, and likes
- **Messages**: Private messaging system
- **Badges**: Achievement system
- **Replays**: Game replay uploads
- **Notifications**: In-app notifications

## 🔐 Authentication

The platform uses NextAuth.js with a custom credentials provider:

### Test Accounts
After seeding, you can use these test accounts:

**Admin Account**:
- Email: `admin@zh-love.com`
- Password: `admin123`

**Regular Users**:
- Email: `player1@zh-love.com`, Password: `password123`
- Email: `player2@zh-love.com`, Password: `password123`
- ...up to `player8@zh-love.com`

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication

### Users
- `GET /api/users` - Get users list with filtering
- `GET /api/users/[userId]` - Get user profile
- `PUT /api/users/[userId]` - Update user profile

### Clans
- `GET /api/clans` - Get all clans
- `POST /api/clans` - Create new clan
- `GET /api/clans/[clanId]` - Get clan details with members and wars

### Tournaments
- `GET /api/tournaments` - Get tournaments list
- `POST /api/tournaments` - Create tournament
- `GET /api/tournaments/[tournamentId]` - Get tournament details
- `POST /api/tournaments/[tournamentId]` - Join/leave tournament

### Forum
- `GET /api/forum/posts` - Get forum posts with filtering
- `POST /api/forum/posts` - Create new post

### Other APIs
- `GET /api/rankings` - Get user rankings
- `GET /api/stats` - Get platform statistics
- `GET /api/messages` - Get messages and conversations
- `GET /api/notifications` - Get user notifications
- `GET /api/badges` - Get badges system

## 🎨 UI Components

The platform includes a comprehensive set of custom UI components:

### Gaming-Themed Components
- `AnimatedBackground` - Dynamic background with animations
- `XPProgressBar` - Gaming-style progress bars
- `WarRoomClient` - Special gaming interface
- `Badge` - Achievement badges
- `Button` with gaming variants

### Layout Components
- `MainLayout` - Main application layout
- `Header` - Navigation header with language switcher
- `Sidebar` - Collapsible sidebar navigation

### Form Components
- All Radix UI components styled with gaming theme
- Custom form validation and error handling

## 🌍 Internationalization

Complete bilingual support:

- **Languages**: Arabic (AR) and English (EN)
- **Text Direction**: Automatic RTL/LTR switching
- **Translations**: Complete UI translations
- **URL Structure**: `/en/...` and `/ar/...` routes

### Adding Translations

1. Add keys to `messages/en.json` and `messages/ar.json`
2. Use in components: `const t = useTranslations(); t('key')`

## 🎮 Gaming Features

### Clan System
- Clan creation and management
- Member roles (owner, leader, member)
- Clan wars tracking
- Clan rankings and statistics

### Tournament System
- Tournament creation with various formats
- Registration and participation management
- Prize pools and entry fees
- Tournament brackets and results

### Rankings
- Multiple ranking categories
- Real-time leaderboards
- Filtering and search capabilities
- Clan and individual rankings

## 📱 Responsive Design

The platform is fully responsive with:

- **Mobile-first approach**
- **Touch-friendly interface**
- **Collapsible navigation**
- **Optimized layouts for all screen sizes**

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.com"
```

### Recommended Hosting
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **DigitalOcean App Platform**

## 🛠️ Development

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Database Management
- `npx prisma studio` - Open Prisma Studio
- `npx prisma db push` - Push schema changes
- `npx prisma generate` - Generate Prisma client
- `npx tsx prisma/seed.ts` - Seed database

### Project Structure
```
zh-love/
├── src/
│   ├── app/                 # App Router pages
│   ├── components/          # Reusable components
│   ├── lib/                 # Utilities and configurations
│   ├── styles/              # Global styles
│   └── types/               # TypeScript type definitions
├── prisma/                  # Database schema and migrations
├── messages/                # Internationalization files
└── public/                  # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 👥 Team

- **Development Team**: ZH-Love Development Team
- **Design**: Custom gaming-themed UI/UX
- **Community**: Command & Conquer: Generals Zero Hour players

## 🎯 Future Features

- [ ] Real-time chat system
- [ ] Video streaming integration
- [ ] Mobile app development
- [ ] Advanced tournament brackets
- [ ] Integration with game servers
- [ ] Esports event management
- [ ] Sponsorship and partnership system

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Join our community forums

---

**ZH-Love** - The ultimate gaming community platform for Command & Conquer: Generals Zero Hour enthusiasts worldwide! 🎮 