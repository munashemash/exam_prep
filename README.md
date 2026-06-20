# COS332 Practice Hub

A focused study dashboard for COS332 Database Systems, built with Next.js 15, TypeScript, Tailwind CSS, shadcn/ui primitives, Zustand, Zod, date-fns, and Lucide icons.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
npm run format:check
npm run lint
npm run typecheck
npm run build
```

## Structure

- `src/app` — App Router pages and global layout
- `src/components` — shared application and shadcn/ui components
- `src/data` — validated study content
- `src/hooks` — reusable React hooks
- `src/lib` — shared utilities
- `src/store` — persisted Zustand state
- `src/types` — shared TypeScript types
