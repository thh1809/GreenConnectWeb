
<p align="center">
	<img src="./public/Eco-Tech-logo-web-no-background.ico" alt="Green Connect Logo" width="120"/>
</p>

<h1 align="center">
	<img src="./public/leaf_web_2.png" alt="Leaf Icon" width="30" />
	Green Connect Web
</h1>

<p align="center">
	<img src="https://img.shields.io/badge/platform-next.js-blue" />
	<img src="https://img.shields.io/badge/ui-shadcn--ui-success" />
	<img src="https://img.shields.io/badge/architecture-app--router-green" />
	<img src="https://img.shields.io/badge/language-typescript-blueviolet" />
	<img src="https://img.shields.io/badge/styling-tailwindcss-06b6d4" />
	<a href="https://github.com/thh1809/GreenConnectWeb/actions/workflows/playwright.yml">
    <img
      src="https://github.com/thh1809/GreenConnectWeb/actions/workflows/playwright.yml/badge.svg"
      alt="Playwright E2E Tests"
    />
  </a>

  <a href="https://github.com/thh1809/GreenConnectWeb/blob/main/LICENSE">
    <img
      src="https://img.shields.io/github/license/thh1809/GreenConnectWeb"
      alt="License"
    />
  </a>

  <a href="https://github.com/thh1809/GreenConnectWeb/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/thh1809/GreenConnectWeb"
      alt="Last Commit"
    />
  </a>
</p>

<p align="center">
	<i><b>Green Connect</b> is a modern web platform that connects the community for a greener environment, featuring an introductory landing page and a convenient admin dashboard.</i>
</p>

<p align="center">
	👥 <b>Connect:</b> ♻️ User  • 🛠️ Admin  • 🧑‍⚖️ Moderator
</p>

<p align="center">
	🌱 Built with <b>Next.js</b> • <b>TypeScript</b> • <b>Tailwind CSS</b> • <b>Shadcn/UI</b>
</p>

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
GREENCONNECTWEB/
│
├── .github/                      # GitHub Actions CI/CD workflows
├── .husky/                       # Husky hooks (lint-staged, pre-commit)
├── .vscode/                      # VSCode workspace settings
│
├── public/                       # Static assets (images, icons, favicons)
│   └── leaf_1.png
│
├── src/                          # Application source code
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Global styles
│   │   └── page.tsx              # Default landing page
│   │
│   ├── components/               # Shared UI components
│   │   ├── ui/                   # Shadcn/UI components
│   │   ├── providers.tsx         # Global context providers
│   │   └── theme-provider.tsx    # Tailwind theme wrapper
│   │
│   ├── hooks/                    # Custom React hooks
│   │   └── use-api/
│   │           ├── use-user.tsx
│   │           └── use-auth.tsx
│   │
│   ├── lib/                      # Core utilities and constants
│   │   ├── api.ts
│   │   ├── constants.ts
│   │   └── utils.ts
│   │
│   ├── pages/                    # (Optional) Legacy pages
│   │   └── homepage/
│   │       ├── components/
│   │       │   ├── ecomImpact.tsx
│   │       │   ├── features.tsx
│   │       │   ├── footer.tsx
│   │       │   ├── header.tsx
│   │       │   ├── hero.tsx
│   │       │   ├── how-it-works.tsx
│   │       │   └── testimonials.tsx
│   │       └── homepage.tsx
│   │
│   └── types/                    # TypeScript types
│       └── middleware.ts
│
├── tests/                        # Playwright E2E tests
│   ├── homepage.spec.ts          # Example homepage test
│   ├── auth.spec.ts              # Example authentication test
│   └── fixtures/                 # Custom fixtures, setup files
│
├── test-results/                 # Playwright output (screenshots, traces)
├── playwright-report/            # HTML report after test runs
│
├── .env                          # Local environment
├── .env.example
│
├── Dockerfile
├── docker-compose.yml
│
├── playwright.config.ts          # Playwright configuration
├── next.config.mjs               # Next.js configuration
├── eslint.config.js
├── prettier.config.js
├── tsconfig.json
│
├── package.json
├── pnpm-lock.yaml
│
└── README.md
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

### 2. create ENV

```bash
cp .env.example .env
```

### 3. Install dependencies

```bash
npm install
# or
pnpm install
```

### 4. Set up environment file

```bash
cp .env.example .env
```

### 5. Run development server

```bash
npm run dev
# or
pnpm dev
```

### 6. Build

```bash
npm run build
npm start
# or
pnpm run build
pnpm start
```

### 7. Build and Run production

```bash
docker compose up --build
docker compose down
```

### 8. Run test

```bash
npx playwright test
npx playwright test --headed
npx playwright test --ui
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
