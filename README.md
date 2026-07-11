# IDP Frontend

A modern Identity Provider (IDP) frontend application built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **TanStack Query**.

## 🚀 Features

- ✅ **Next.js 15** - Latest React framework with App Router
- ✅ **TypeScript** - Full type safety and better developer experience
- ✅ **Tailwind CSS** - Utility-first CSS framework
- ✅ **TanStack Query** - Powerful async state management
- ✅ **Zod Validation** - Runtime type checking and schema validation
- ✅ **React Hook Form** - Performant, flexible form validation
- ✅ **Context API** - User and Theme management
- ✅ **Feature-Based Architecture** - Scalable and maintainable code structure
- ✅ **ESLint** - Code quality and consistency

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── auth/                # Authentication pages (login, register)
│   ├── dashboard/           # Protected dashboard
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── features/                 # Feature modules (Feature-Based Architecture)
│   ├── auth/                # Authentication feature
│   │   ├── components/      # Auth components
│   │   ├── hooks/           # Auth custom hooks
│   │   └── types/           # Auth types
│   ├── dashboard/           # Dashboard feature
│   ├── profile/             # Profile management
│   └── ...                  # Other features
├── contexts/                 # Context API setup
│   ├── ThemeContext.tsx     # Theme management (light/dark)
│   ├── UserContext.tsx      # User management
│   └── ...
├── providers/                # React providers
│   └── Providers.tsx        # Centralized provider setup (Query, Theme, User)
├── lib/                      # Utility functions and helpers
├── types/                    # Global type definitions
│   └── user.ts              # User types with Zod schemas
└── shared/                   # Shared components and utilities
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd IDP-Frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env.local
```

Then update `.env.local` with your API endpoints.

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📦 Dependencies

### Main Dependencies
- **next**: ^15.2.0 - React framework
- **react**: ^19.0.0 - UI library
- **@tanstack/react-query**: ^5.64.0 - Data fetching and caching
- **zod**: ^3.24.1 - Schema validation
- **react-hook-form**: ^7.54.0 - Form state management
- **@hookform/resolvers**: ^3.4.2 - Hook Form resolvers for Zod

### Dev Dependencies
- **typescript**: ^5.7.0 - Type checking
- **tailwindcss**: ^3.4.0 - Styling
- **postcss** & **autoprefixer**: CSS processing
- **eslint** & **eslint-config-next**: Code quality

## 🎨 Context API Setup

### Theme Management
Use the `useTheme` hook to access theme functionality:
```tsx
import { useTheme } from '@/contexts/ThemeContext';

function MyComponent() {
  const { theme, setTheme, isDark } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  );
}
```

### User Management
Use the `useUser` hook to manage user state:
```tsx
import { useUser } from '@/contexts/UserContext';

function MyComponent() {
  const { user, login, logout, isLoading } = useUser();
  
  return (
    <div>
      {user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

## 🔍 Validation with Zod

Define and validate schemas using Zod:
```tsx
import { LoginSchema } from '@/types/user';

// Use in forms
const { register, handleSubmit } = useForm({
  resolver: zodResolver(LoginSchema),
});
```

## 📡 TanStack Query Usage

Queries and mutations are set up in feature-specific hooks:
```tsx
// src/features/auth/hooks/useAuth.ts
export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: LoginInput) => {
      // API call here
    },
  });
}
```

## 🎯 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🏗️ Building for Production

```bash
npm run build
npm start
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Zod Documentation](https://zod.dev)
- [React Hook Form Docs](https://react-hook-form.com)

## 📝 Notes

- Replace API endpoints in `.env.local` with your backend URLs
- Update mock user data in `UserContext.tsx` with real API calls
- Customize Tailwind colors in `tailwind.config.ts`

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License - feel free to use this project for your own purposes.
