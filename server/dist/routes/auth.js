import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { asyncHandler, ApiError } from '../lib/http.js';
import { sendPasswordResetEmail } from '../lib/mailer.js';
import { config } from '../config.js';
import { authenticate } from '../middleware/auth.js';
import { resetPasswordLimiter } from '../middleware/security.js';
import { signAuthToken, toClientRole } from '../lib/auth.js';
const router = Router();
const signupSchema = z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(255),
    password: z.string().min(8).max(128),
    role: z.literal('user'),
});
const loginSchema = z.object({
    email: z.string().trim().email().max(255),
    password: z.string().min(8).max(128),
    role: z.enum(['user', 'admin']),
});
function serializeUser(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: toClientRole(user.role),
    };
}
router.post('/signup', asyncHandler(async (request, response) => {
    const payload = signupSchema.parse(request.body);
    const existingUser = await prisma.user.findUnique({
        where: {
            email: payload.email.toLowerCase(),
        },
    });
    if (existingUser) {
        throw new ApiError(409, 'An account with that email already exists.');
    }
    const user = await prisma.user.create({
        data: {
            name: payload.name,
            email: payload.email.toLowerCase(),
            passwordHash: await bcrypt.hash(payload.password, 12),
            role: 'USER',
        },
    });
    response.status(201).json({
        token: signAuthToken(user),
        user: serializeUser(user),
    });
}));
router.post('/login', asyncHandler(async (request, response) => {
    const payload = loginSchema.parse(request.body);
    const user = await prisma.user.findUnique({
        where: {
            email: payload.email.toLowerCase(),
        },
    });
    if (!user) {
        throw new ApiError(401, 'Invalid email or password.');
    }
    const passwordMatches = await bcrypt.compare(payload.password, user.passwordHash);
    if (!passwordMatches) {
        throw new ApiError(401, 'Invalid email or password.');
    }
    if (toClientRole(user.role) !== payload.role) {
        throw new ApiError(403, 'That account does not match the selected role.');
    }
    response.json({
        token: signAuthToken(user),
        user: serializeUser(user),
    });
}));
router.get('/me', authenticate, asyncHandler(async (request, response) => {
    const user = await prisma.user.findUnique({
        where: {
            id: request.auth?.userId,
        },
    });
    if (!user) {
        throw new ApiError(401, 'Authentication required.');
    }
    response.json({
        user: serializeUser(user),
    });
}));
const forgotPasswordSchema = z.object({
    email: z.string().trim().email().max(255),
});
const resetPasswordSchema = z.object({
    email: z.string().trim().email().max(255),
    token: z.string().trim().min(1).max(256),
    password: z.string().min(8).max(128),
});
router.post('/forgot-password', resetPasswordLimiter, asyncHandler(async (request, response) => {
    const { email } = forgotPasswordSchema.parse(request.body);
    const normalizedEmail = email.toLowerCase();
    const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
    });
    if (user) {
        const token = crypto.randomBytes(32).toString('hex');
        await prisma.passwordResetToken.upsert({
            where: { email: normalizedEmail },
            update: { token, expiresAt: new Date(Date.now() + 15 * 60 * 1000) },
            create: { email: normalizedEmail, token, expiresAt: new Date(Date.now() + 15 * 60 * 1000) },
        });
        const resetLink = `${config.clientOrigin}/reset-password?email=${encodeURIComponent(normalizedEmail)}&token=${token}`;
        try {
            await sendPasswordResetEmail({ to: normalizedEmail, resetLink });
        }
        catch (error) {
            console.error('[PASSWORD RESET] Failed to send email:', error);
        }
    }
    response.json({
        success: true,
        message: 'If that email exists in our system, we have sent a reset code.',
    });
}));
router.post('/reset-password', resetPasswordLimiter, asyncHandler(async (request, response) => {
    const { email, token, password } = resetPasswordSchema.parse(request.body);
    const normalizedEmail = email.toLowerCase();
    const stored = await prisma.passwordResetToken.findUnique({
        where: { email: normalizedEmail },
    });
    if (!stored || stored.token !== token || Date.now() > stored.expiresAt.getTime()) {
        throw new ApiError(400, 'Invalid or expired reset token.');
    }
    const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
    });
    if (!user) {
        throw new ApiError(404, 'User not found.');
    }
    await prisma.user.update({
        where: { id: user.id },
        data: {
            passwordHash: await bcrypt.hash(password, 12),
        },
    });
    await prisma.passwordResetToken.delete({
        where: { email: normalizedEmail },
    });
    response.json({
        success: true,
        message: 'Password has been reset successfully.',
    });
}));
export default router;
