# CLAUDE.md

## Project Overview

Weeb showcase site — vitrine, blog, and authentication area for the Weeb company. Frontend SPA built with React 19 + Vite, consumes the Django REST API in `../weeb_API/`.

**Stack**: React 19 + Vite + TypeScript + Tailwind CSS v4 + react-router v7 + Formik/Yup + Axios + Motion

## Commands

```bash
pnpm dev          # Start Vite dev server
pnpm build        # tsc -b && vite build (typecheck included in build)
pnpm lint         # ESLint
pnpm test         # Vitest run
pnpm test:watch   # Vitest watch
pnpm preview      # Preview the production build
```

## Conventions (must follow)

- **Language**: Identifiers (variables, functions, types, file names) and commit messages are in ENGLISH. UI strings visible to the user are in FRENCH (the site is French-speaking) — validation messages, button labels, error copy. **Comments and JSDoc are in FRENCH**, written in a natural human tone (no robotic phrasing, no "TODO" English templates). When editing a file, match the language already in use; when adding new comments, default to French.
- **No `useEffect`**: Never use `useEffect` unless there is absolutely no alternative. Prefer derived state, event handlers, `useMemo`, refs in event callbacks. If you reach for it, justify why no alternative works.
- **HTTP via the central client**: All API calls go through `api` and `API_ENDPOINTS` from `src/config/api.ts`. Never call `axios.create` elsewhere or hardcode URLs in components. When the backend exposes a new route, add it to `API_ENDPOINTS` first.
- **Forms**: Formik + Yup. Pattern: see `src/components/form/LoginForm.tsx`. Yup validation messages in French (user-facing). Show field errors inline directly below the input — never as toasts or alerts.
- **Inline feedback, not toasts**: Mutation success/error renders inline at the point of interaction (the `submitStatus` block in `LoginForm` is the canonical pattern). No toast library, no `alert()`.
- **Async feedback required**: Every async interaction must have a visible loading state — button label change (`"Connexion..."`), `disabled`, or a spinner. Never fire-and-forget without visual feedback.
- **Styling**: Tailwind v4 only. No CSS modules, no styled-components. Custom tokens (e.g. `bg-primary`, `font-roboto`, `max-w-8xl`) are defined in `src/index.css` — extend there if you need a new token rather than inlining magic values.
- **Icons**: Both `lucide-react` and `react-icons` are installed. Pick one set per component for visual consistency; don't mix inside a single file.
- **Routing**: `react-router` v7. Routes declared in `src/main.tsx`. Keep `Home` eager (above-the-fold), lazy-load every other route via `lazy(() => import(...))`.
- **SEO**: Per-route metadata lives in `src/utils/routeMetas.tsx`. The root `App.tsx` reads it via `useLocation()` and injects via `<Helmet>`. Do not sprinkle `<Helmet>` inside individual page components — add the entry to `routeMetas` instead.
- **Page structure**: Pages live in `src/pages/<PageName>/index.tsx`. If a page has sections, put them in `src/pages/<PageName>/sections/`.
- **Components**: Split into `components/ui/` (primitives like `Button`, `ArrowLink`), `components/layout/` (`Header`, `Footer`), `components/form/` (form components). Don't add a new top-level folder without a reason.
- **Tests**: Co-locate next to the file (`Component.tsx` + `Component.test.tsx`). Vitest + `@testing-library/react`, JSDOM env. Test the user-visible behavior, not the implementation.
- **Animations**: `motion` (framer-motion successor). Keep them subtle and performant — avoid scroll-driven heavy effects or animations on long lists.
- **Lint/Format**: ESLint only (no Prettier). Run `pnpm lint` before committing.
- **TypeScript**: Strict mode. Use `as const` for literal unions (see `API_ENDPOINTS`). Prefer `unknown` over `any` and narrow.
- **Image optimization**: Build-time via `sharp` in `scripts/convert-images.mjs`. When adding new image sources, document any pipeline change in that script rather than adding ad-hoc conversion steps.

## Architecture (key things to know)

- **SPA only**: No SSR. Everything mounts under `BrowserRouter` in `src/main.tsx`. The root `App.tsx` is the layout (Header + `<Outlet />` + Footer + dynamic Helmet).
- **Backend**: Django REST API in `../weeb_API/` (default `http://localhost:8000`, override via `VITE_API_URL`).
- **Auth**: JWT via the Django backend. `LoginForm` POSTs to `API_ENDPOINTS.login` (`/api/token/`), receives `{ access, refresh }`, and stores them via `setTokens()` from `src/utils/auth.ts` (localStorage). The Axios interceptor in `src/config/api.ts` reads `getAccessToken()` and adds `Authorization: Bearer <token>` to every request automatically. Use `clearTokens()` on logout.
- **No CSRF**: We use JWT Bearer auth, not Django sessions. `withCredentials` is off and there is no CSRF token logic — don't reintroduce it.
- **Routing flow**: `App.tsx` reads the current pathname, looks up SEO meta in `routeMetas`, and renders `<Outlet />` for the matched route. Page-level layout starts inside the page component.
