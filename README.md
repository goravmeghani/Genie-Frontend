# Genie Frontend - AI Coding Assistant Dashboard

Modern React + TypeScript dashboard for AI-powered coding assistance with real-time streaming, GitHub integration, and premium features.

## 🌟 Features

- 💬 **Real-time Chat** - Streaming AI responses with NDJSON protocol
- 🔐 **GitHub OAuth** - Secure authentication via Supabase Auth
- 💳 **Stripe Checkout** - Seamless subscription upgrades
- 📁 **Code Explorer** - Interactive file tree viewer for generated projects
- 📄 **Documentation Preview** - Live README and user manual display
- 🎨 **Beautiful UI** - Glassmorphism design with Framer Motion animations
- 🌌 **Animated Backgrounds** - Aurora gradients, floating sparkles, and glow orbs
- 🧵 **Thread Management** - Persistent conversation history
- 👤 **User Menu** - Account management and GitHub connection status
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- ⚡ **Fast Performance** - Built with Vite for lightning-fast HMR

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | React 18, TypeScript |
| **Build Tool** | Vite 6.0 |
| **Styling** | Tailwind CSS, PostCSS |
| **Animation** | Framer Motion |
| **Auth** | Supabase Auth (GitHub OAuth) |
| **HTTP Client** | Fetch API with streaming |
| **Routing** | React Router v6 |
| **UI Components** | Radix UI primitives |
| **Markdown** | react-markdown |
| **Icons** | Lucide React |
| **State Management** | React Context API |

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Supabase project with GitHub OAuth configured
- Backend API running (see [Genie Backend](https://github.com/goravmeghani/Genie-Backend))

## 🚀 Quick Start

### 1. Clone and Setup

# Clone the repository
git clone https://github.com/goravmeghani/Genie-Frontend.git
cd Genie-Frontend

# Install dependencies
npm install

### 2. Configure Environment

Create .env.local in the root directory:

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_BASE_URL=http://localhost:8000


**Important:** Never commit .env.local to git. Use .env.example as a template.

### 3. Run Development Server


npm run dev

The app will be available at `http://localhost:5173`

### 4. Build for Production


npm run build
npm run preview  # Preview production build locally


## 📁 Project Structure


Frontend/
├── src/
│   ├── main.tsx              # App entry point
│   ├── App.tsx               # Root component with routing
│   ├── index.css             # Global styles and Tailwind imports
│   ├── components/
│   │   ├── ChatDashboard.tsx      # Main chat interface
│   │   ├── Home.tsx               # Landing page
│   │   ├── AdminDashboard.tsx     # Admin panel
│   │   ├── GenieApp.tsx           # Legacy chat component
│   │   ├── Logo.tsx               # Animated logo
│   │   ├── UserMenu.tsx           # Account dropdown
│   │   ├── FuturisticBackground.tsx
│   │   ├── FloatingSparkles.tsx
│   │   ├── GlowOrbs.tsx
│   │   ├── AuroraGradient.tsx
│   │   └── ui/                    # Radix UI components
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── scroll-area.tsx
│   │       ├── tabs.tsx
│   │       └── ...
│   ├── contexts/
│   │   └── AuthContext.tsx        # Auth state management
│   ├── hooks/
│   │   └── usePricing.ts          # Pricing plan hook
│   ├── lib/
│   │   └── supabaseClient.ts      # Supabase initialization
│   └── pages/
│       └── auth/
│           └── callback.tsx       # OAuth callback handler
├── public/
│   ├── logo.svg
│   └── Logo-large.svg
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── .env.example


## 🎯 Key Components

### ChatDashboard
Main chat interface with:
- Thread sidebar for conversation history
- Real-time streaming message display
- Code explorer modal for viewing project files
- Upgrade modal for Stripe checkout
- File upload for project analysis

### AuthContext
Manages authentication state:
- User session and profile
- GitHub token connection status
- Sign in/out functionality
- Role-based access (user/admin)

### Code Explorer
Interactive file viewer:
- Recursive file tree rendering
- Syntax-highlighted code display
- Project navigation
- File content loading

## 🔌 API Integration

### Chat Streaming
POST /chat/stream
Content-Type: application/json
X-Github-Token: <token>

{
  "message": "user message",
  "thread_id": "optional-thread-id",
  "user_id": "user-uuid"
}

Response: NDJSON stream
{"event": "token", "content": "chunk"}
{"event": "end", "thread_id": "...", "reply": "..."}
{"event": "error", "message": "..."}

### Project File Tree
GET /projects/{project_id}/file-tree?user_id=...&thread_id=...

Response:
{
  "project_id": "...",
  "files": [
    {"type": "folder", "name": "src", "path": "src", "children": [...]},
    {"type": "file", "name": "App.tsx", "path": "src/App.tsx"}
  ]
}

## 🔐 Authentication Flow

1. User clicks "Sign in with GitHub"
2. Redirected to Supabase GitHub OAuth
3. After approval, redirected to `/auth/callback`
4. Callback extracts session and provider token
5. Session stored in Supabase Auth
6. User redirected to chat dashboard

## 🎨 Design System

### Colors
- **Primary:** Cyan/Violet gradient
- **Background:** Deep blue/purple gradient
- **Glass panels:** Semi-transparent slate with backdrop blur
- **Accent:** Cyan for highlights and actions

### Typography
- **Font:** System font stack for optimal performance
- **Scale:** Tailwind default scale

### Animations
- **Page transitions:** Framer Motion with fade/slide
- **Message appearance:** Staggered fade-in
- **Button hovers:** Scale and color transitions
- **Background effects:** Continuous floating animations

## 🧪 Development

### Recommended VS Code Extensions
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)

### Code Style
# Format code
npm run format

# Lint
npm run lint

## 📦 Deployment

### Vercel (Recommended)
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

### Netlify
# Build command
npm run build

# Publish directory
dist

### Environment Variables
Set these in your deployment platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_BASE_URL`

## 🔒 Security

- ✅ Environment variables for sensitive data
- ✅ Supabase Row Level Security
- ✅ HTTP-only cookies for session management
- ✅ OAuth tokens passed via headers (not stored in localStorage)
- ✅ Input sanitization for user messages
- ✅ CORS configured on backend

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Ensure .env.local exists with correct values
- Restart dev server after changing env vars

### GitHub OAuth not working
- Check Supabase Auth providers configuration
- Verify callback URL: `http://localhost:5173/auth/callback`
- Ensure GitHub OAuth app has correct redirect URI

### Streaming not working
- Verify backend is running on correct port
- Check CORS configuration in backend
- Ensure `VITE_API_BASE_URL` points to backend

## 🙏 Acknowledgments

- [React](https://react.dev/) for the UI framework
- [Vite](https://vitejs.dev/) for blazing-fast builds
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Supabase](https://supabase.com/) for auth and database
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Lucide](https://lucide.dev/) for beautiful icons

---

Built with ❤️ using React, TypeScript, and Vite
