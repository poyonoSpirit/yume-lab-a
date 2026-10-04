# YumeLab A - Agent Instructions

## Project

YumeLab A is a Next.js project.

Before modifying code, inspect the relevant files and understand
their responsibilities and dependencies.

Do not make unrelated changes.

## Architecture

Keep responsibilities separated.

- `app/`: Next.js pages and API routes
- `components/`: UI components
- `hooks/`: React hooks and state-related logic
- `lib/`: domain/application logic and external integrations
- `types/`: shared TypeScript types
- `public/`: static assets

Avoid concentrating application logic in `DreamScene.tsx`.

## Secret Handling

Never read, inspect, print, modify, copy, summarize, or expose:

- `.env`
- `.env.*`
- `*.pem`
- `*.key`

Do not run commands intended to reveal secret values, including:

- `cat .env*`
- `env`
- `printenv`

If environment-variable information is required, use `.env.example`.

If a task requires the value of a secret, stop and ask the user.

## Safety

- Do not push directly to `main`.
- Do not deploy to production without explicit permission.
- Do not modify files outside this repository.
- Ask before performing destructive operations.

## Verification

After modifying code, run the relevant checks.

For example:

- TypeScript type checking
- tests
- build

If a check fails because of the modification, investigate the error,
fix it, and run the check again.

Report what was changed and what verification was performed.