import { betterAuth } from "better-auth";
import { expo } from "@better-auth/expo";
import pg from "pg";

const { Pool } = pg;

export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "placeholder",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder",
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID || "placeholder",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "placeholder",
        },
        apple: {
            clientId: process.env.APPLE_CLIENT_ID || "placeholder",
            clientSecret: process.env.APPLE_CLIENT_SECRET || "placeholder",
        },
    },
    plugins: [
        expo(),
    ],
    trustedOrigins: ["frontend://"],
});
