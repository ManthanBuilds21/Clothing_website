import jwt from 'jsonwebtoken';
import { config } from '../config.js';
const COOKIE_NAME = 'veloura.session';
const cookieDefaults = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (matches JWT expiry)
};
export function signAuthToken(user) {
    return jwt.sign({ userId: user.id, email: user.email, role: user.role }, config.jwtSecret, { expiresIn: '7d' });
}
export function verifyAuthToken(token) {
    return jwt.verify(token, config.jwtSecret);
}
export function setAuthCookie(response, token) {
    response.cookie(COOKIE_NAME, token, cookieDefaults);
}
export function clearAuthCookie(response) {
    response.clearCookie(COOKIE_NAME, { ...cookieDefaults, maxAge: 0 });
}
export function toClientRole(role) {
    return role === 'ADMIN' ? 'admin' : 'user';
}
