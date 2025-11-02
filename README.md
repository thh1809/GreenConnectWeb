# GreenConnect - Next.js 15 Frontend

Frontend project với Next.js 15 + Tailwind CSS + shadcn/ui + TanStack Query + Axios

## 🚀 Tech Stack

- **Next.js 15** - React framework với App Router
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Component library built on Radix UI
- **TanStack Query** - Data fetching & state management
- **Axios** - HTTP client
- **Roboto** - Google Font

## 📦 Installation

```bash
npm install
```

## 🛠️ Development

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trong browser.

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router
│   ├── layout.tsx    # Root layout với Providers
│   ├── page.tsx      # Homepage
│   └── providers.tsx # TanStack Query Provider
├── components/       # React components
│   └── ui/          # shadcn/ui components
├── hooks/            # Custom React hooks
│   └── useApi.ts    # TanStack Query hooks
├── lib/              # Utilities & configs
│   ├── utils.ts     # cn() helper cho Tailwind
│   └── api/         # API client setup
│       ├── client.ts    # Axios instance
│       └── endpoints.ts # API endpoints
├── services/         # API services
├── stores/           # Zustand stores
├── types/            # TypeScript types
└── utils/            # Helper functions
```

## 🎨 Adding shadcn/ui Components

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
```

## 📡 Using TanStack Query

```tsx
import { useApi } from "@/hooks/useApi";

function MyComponent() {
  const { data, isLoading, error } = useApi(
    ["users"],
    "/api/users"
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;

  return <div>{/* Render data */}</div>;
}
```

## 🔧 Configuration

- **Tailwind Config**: `tailwind.config.ts`
- **shadcn/ui Config**: `components.json`
- **API Base URL**: Set `NEXT_PUBLIC_API_URL` in `.env.local`

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 Next Steps

1. Add shadcn/ui components as needed
2. Setup API endpoints in `src/lib/api/endpoints.ts`
3. Create API services in `src/services/`
4. Add Zustand stores if needed in `src/stores/`
