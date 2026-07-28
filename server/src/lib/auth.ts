import type { CookieOptions, Response } from 'express'
import jwt from 'jsonwebtoken'
import type { Role, User } from '@prisma/client'
import { config } from '../config.js'

export interface AuthTokenPayload {
  userId: string
  email: string
  role: Role
}

const COOKIE_NAME = 'veloura.session'

const cookieDefaults: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/api',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (matches JWT expiry)
}

export function signAuthToken(user: Pick<User, 'id' | 'email' | 'role'>) {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role } satisfies AuthTokenPayload,
    config.jwtSecret,
    { expiresIn: '7d' },
  )
}

export function verifyAuthToken(token: string) {
  return jwt.verify(token, config.jwtSecret) as AuthTokenPayload
}

export function setAuthCookie(response: Response, token: string) {
  response.cookie(COOKIE_NAME, token, cookieDefaults)
}

export function clearAuthCookie(response: Response) {
  response.clearCookie(COOKIE_NAME, { ...cookieDefaults, maxAge: 0 })
}

export function toClientRole(role: Role) {
  return role === 'ADMIN' ? 'admin' : 'user'
}
