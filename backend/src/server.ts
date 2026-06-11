import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth.js';

dotenv.config();

const app = express();

// Set up CORS properly to allow Expo origins
app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(express.json());

// Mount Better Auth handler
app.all("/api/auth/*splat", toNodeHandler(auth));

// Protected Example Route
import { authMiddleware, AuthRequest } from './middleware/auth.js';
app.get('/api/user/profile', authMiddleware, (req: AuthRequest, res) => {
    res.json({
        message: "Successfully retrieved authenticated profile data!",
        session: req.session
    });
});

const PORT = process.env.PORT || 5000;

app.get('/api/test', (req, res) => {
    res.json({ message: "Backend boilerplate is working perfectly!" });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is active on http://localhost:${PORT}`);
});
