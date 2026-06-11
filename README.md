# Expo & Express TypeScript Mobile Boilerplate 🚀

A high-performance, developer-friendly starter template for building cross-platform (iOS, Android, Web) mobile applications quickly. Fully integrated with **Better Auth** and **PostgreSQL**.

---

## Architecture Overview

```
/
├── backend/               # Express.js Server (TypeScript)
│   ├── src/
│   │   ├── lib/auth.ts    # Better Auth Configuration
│   │   ├── middleware/    # Auth and routing middlewares
│   │   └── server.ts      # Server entrypoint
│   ├── schema.sql         # PostgreSQL database schema script
│   └── tsconfig.json      
│
└── frontend/              # React Native App (Expo SDK 56 + TypeScript)
    ├── src/
    │   ├── app/           # Expo Router file-based screens
    │   ├── components/    # Common UI & Themed components
    │   ├── constants/     # Global theme and styling variables
    │   └── lib/           # Better Auth client config
    └── app.json           
```

---

## Getting Started

### 1. Database Setup (PostgreSQL)
Ensure you have a local PostgreSQL server running, then execute the following commands in your client (e.g., `psql` or pgAdmin):

```sql
-- 1. Create a database for your new project
CREATE DATABASE boilerplate_db;

-- 2. Open boilerplate_db and execute the tables schema found in:
-- /backend/schema.sql
```

### 2. Backend Installation & Launch
1. Navigate to `/backend`:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env` (copy and customize from the default `.env` template):
   ```env
   PORT=5000
   DATABASE_URL=postgresql://<user>:<password>@localhost:5432/boilerplate_db
   BETTER_AUTH_SECRET=your_32_plus_character_secure_secret_key
   BETTER_AUTH_URL=http://localhost:5000
   ```
4. Start the server in development mode (watches for file changes):
   ```bash
   npm run dev
   ```

### 3. Frontend Installation & Launch
1. Navigate to `/frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```env
   EXPO_PUBLIC_API_URL=<YOUR_LOCAL_IP_ADDRESS>
   EXPO_PUBLIC_BETTER_AUTH_BASE_URL=http://<YOUR_LOCAL_IP_ADDRESS>:5000
   ```
   *Note: Avoid using `localhost` for `EXPO_PUBLIC_API_URL` if testing on an Android emulator or physical device. Use your local machine's IP address (e.g., `192.168.1.50`).*
4. Run the Metro bundler:
   ```bash
   npm run start
   ```
   Press `i` for iOS simulator, `a` for Android emulator, or `w` for Web.

---

## How to Customize for a New Project

When cloning this boilerplate to build a new app (e.g., a marketplace, social network, or SaaS product):

1.  **Rename custom deep linking scheme**:
    In `/frontend/app.json`, change `"scheme": "frontend"` to your new app's name (e.g., `"scheme": "my-marketplace"`).
    Also, update `trustedOrigins` in `/backend/src/lib/auth.ts` to match (`"my-marketplace://"`).
2.  **Add new database tables**:
    Append your new tables to the schema and run migrations. Always associate business items (like posts, comments, or purchases) with the `user` table:
    ```sql
    CREATE TABLE posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        user_id VARCHAR(255) REFERENCES "user"(id) ON DELETE CASCADE
    );
    ```
3.  **Create protected routes on the Backend**:
    Import `authMiddleware` to guard any route requiring an active user session:
    ```typescript
    import { authMiddleware, AuthRequest } from './middleware/auth.js';

    app.get('/api/posts', authMiddleware, async (req: AuthRequest, res) => {
        const userId = req.session.user.id; // Access authenticated user id
        // Query posts for this user...
    });
    ```
4.  **Fetch Authenticated Data on the Frontend**:
    Use the pre-configured `authClient` fetcher, which automatically forwards the user's session tokens:
    ```typescript
    const response = await authClient.fetch('/api/posts');
    const posts = await response.json();
    ```
