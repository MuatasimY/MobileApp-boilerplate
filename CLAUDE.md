# Boilerplate Developer Guide (CLAUDE.md)

This file contains standard commands, project structure, and coding guidelines for the workspace.

## Common Development Commands

### Backend
- **Run dev server**: `npm start` (executed in `/backend`)
- **Install packages**: `npm install <package-name>` (executed in `/backend`)

### Frontend (Expo v56)
- **Run dev server**: `npx expo start` or `npm run start` (executed in `/frontend`)
- **Run Android**: `npm run android` (executed in `/frontend`)
- **Run iOS**: `npm run ios` (executed in `/frontend`)
- **Run Web**: `npm run web` (executed in `/frontend`)
- **Lint project**: `npm run lint` (executed in `/frontend`)
- **Install packages**: `npx expo install <package-name>` (use `expo install` for Expo-compatible versions)

---

## Project Structure & Architecture

```
/
├── backend/               # Express JS server
│   ├── src/
│   │   └── server.js      # Entry point
│   ├── .env               # Environment variables
│   └── package.json
│
└── frontend/              # Expo React Native App (TypeScript)
    ├── src/
    │   ├── app/           # Expo Router file-based pages
    │   │   ├── _layout.tsx # Root layout and state providers
    │   │   └── index.tsx  # Initial screen
    │   ├── components/    # Reusable UI components
    │   ├── constants/     # Colors, Layouts, etc.
    │   └── hooks/         # Custom hooks
    ├── package.json
    └── tsconfig.json
```

---

## Coding Guidelines

### Backend (Express)
- Use ES modules or standard modern Node.js syntax (current boilerplate uses CommonJS `require`, maintain consistency unless refactoring to TS/ESM).
- Structure routes using Express Router in separate files (e.g., `/backend/src/routes/`).
- Place business logic in controller modules.

### Frontend (Expo / React Native)
- **TypeScript**: Always use TypeScript with proper type safety.
- **Expo Router**: Use Expo Router's file-based navigation rules. Do not use legacy React Navigation manually.
- **Styling**: Use Tailwind CSS (via NativeWind) if configured, or Vanilla StyleSheet / Styled components. Currently, Vanilla CSS (`global.css`) and StyleSheet are used.
- **State Management**: Use React Context or lightweight state libraries like `zustand` if state needs to be shared.
- **Secure Storage**: Use `expo-secure-store` for sensitive tokens (auth sessions, API keys). Never store credentials in AsyncStorage or global state.

---

## Authentication Standard (Better Auth)
- The app uses **Better Auth** for secure, database-backed authentication.
- **Backend**:
  - Better Auth is mounted on `/api/auth/*` using `toNodeHandler`.
  - Integrates with the database using a configured adapter (e.g., Prisma, Kysely, Drizzle, or built-in drivers).
- **Frontend**:
  - Configured via `@better-auth/expo` using `expoClient`.
  - Sessions are persisted using `expo-secure-store`.
