# Green Connect Web

**Green Connect** is a modern web application built with **Next.js**, providing an **introductory landing page** and an **admin dashboard** for managing eco-friendly initiatives and sustainable communities.

The application connects different user types: regular users, admins, and moderators.

---

## 🌟 Features

### Landing Page

- Clean, responsive design showcasing Green Connect’s mission.
- Hero section, feature highlights, testimonials, and call-to-action buttons.
- Footer with links to other pages and social media.

### Admin Features

- **Dashboard Overview**: Real-time analytics on user engagement, events, and environmental impact.
- **User Management**: CRUD operations for users, profile editing, role assignments (admin, moderator), and bulk actions.
- **Content Moderation**: Review and approve/reject user-submitted posts, tips, and events.
- **Event & Resource Management**: Create, edit, and schedule green events; manage resources like articles and guides.
- **Reporting Tools**: Export reports on sustainability metrics using **TanStack Query** for data fetching.

---

## 💻 Tech Stack

| Category         | Technologies                               |
| ---------------- | ------------------------------------------ |
| Framework        | Next.js 14+ (App Router)                   |
| UI Library       | Shadcn/UI (Radix UI primitives)            |
| Styling          | Tailwind CSS 3.x                           |
| Data Fetching    | TanStack Query (React Query)               |
| Language         | TypeScript 5.x                             |
| Linting          | ESLint + Prettier                          |
| Commit Standards | Commitlint (Conventional Commits)          |
| Other            | Axios / Fetch for APIs, Zod for validation |

---

## 📂 Folder Structure

```bash
GreenConnect/
├── app/                          # App Router: Pages, layouts, routes
│   ├── globals.css               # Global Tailwind styles
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Landing page
│
├── components/                   # Reusable UI components
│   ├── ui/                       # Shadcn/UI components (Button, Card, etc.)
│   ├── providers.tsx             # App providers (QueryClient, Theme)
│   └── theme-provider.tsx        # Tailwind theme wrapper
│
├── hooks/                        # Custom React hooks
│   ├── use-api.ts                # Generic API hooks
│   └── use-users.ts              # Domain-specific hooks (admin users)
│
├── lib/                          # Utilities and services
│   ├── api.ts                    # REST API client (fetch/axios with auth)
│   ├── constants.ts              # App constants
│   └── utils.ts                  # Helper functions
│
├── pages/                        # Legacy or static pages (if needed)
│   └── homepage/
│       ├── components/           # Landing page-specific components
│       └── homepage.tsx
│
├── public/                       # Static assets (images, icons)
│   └── leaf_1.png
│
├── types/                        # TypeScript types
│   └── middleware.ts
│
├── .env.development              # Environment variables
├── .gitignore
├── .prettierrc                   # Prettier config
├── commitlint.config.ts          # Commitlint rules
├── components.json               # Shadcn/UI config
├── next-env.d.ts
├── next.config.mjs
├── middleware.ts                 # Next.js middleware
├── package-lock.json
├── tsconfig.json
└── README.md                     # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### 1. Clone the repository

```bash
git clone https://github.com/thh1809/GreenConnectWeb.git
cd GreenConnectWeb
```

### 2. Install dependencies

```bash
npm install
# or
pnpm install
```

### 3. Set up environment file

```bash
cp .env.example .env
```

### 4. Run development server

```bash
npm run dev
# or
pnpm dev
```

### 5. Build for production

```bash
npm run build
npm start
# or
pnpm run build
pnpm start
```

## 📝 Commit Rules (Commitlint)

We follow Conventional Commits: https://www.conventionalcommits.org/en/v1.0.0/

🔹 Common Commit Types
| Type | Description |
| ----------- | -------------------------------------------------------- |
| ✨ feat | Add a new feature |
| 🐛 fix | Fix a bug |
| 📝 docs | Documentation changes |
| 🎨 style | Code style/formatting changes that don’t affect logic |
| ♻️ refactor | Refactor code without adding features |
| ✅ test | Add or modify tests |
| ⚙️ chore | Update configs, tools, or packages without affecting app |

🔹 Examples

```bash
git commit -m "feat(auth): add login with email/password"
git commit -m "fix(user): handle null avatar in profile"
git commit -m "docs: update README with folder structure"
```

## 👨‍💻 Contribution Guide

- 🍴 Fork the repository
- 🌱 Create a new branch: feat/feature-name
- ✅ Commit following the Commitlint rules: **npm or pnpm run commit**
- 🚀 Create a Pull Request

## 📄 License

MIT License © 2025 Green Connect
