import type { NextFunction, Request, Response } from 'express'

/**
 * Dependency-free security headers. Mirrors the essential subset of helmet's
 * defaults without adding a runtime dependency. Applied globally before routes.
 */
export function securityHeaders(_request: Request, response: Response, next: NextFunction) {
  response.setHeader('X-Content-Type-Options', 'nosniff')
  response.setHeader('X-Frame-Options', 'DENY')
  response.setHeader('Referrer-Policy', 'no-referrer')
  response.setHeader('X-DNS-Prefetch-Control', 'off')
  response.setHeader('Cross-Origin-Resource-Policy', 'same-site')
  response.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  )
  // The API serves JSON only; a strict CSP prevents this origin being abused to
  // render attacker-controlled markup.
  response.setHeader(
    'Content-Security-Policy',
    "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
  )
  // HSTS is only meaningful over HTTPS; safe to always send (ignored on http).
  response.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')

  next()
}

interface RateLimitOptions {
  windowMs: number
  max: number
  message?: string
}

/**
 * Minimal fixed-window in-memory rate limiter keyed by client IP. Sufficient for
 * a single-instance deployment to blunt credential-stuffing / brute force on the
 * auth endpoints. For multi-instance deployments, back this with a shared store.
 */
export const resetPasswordLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 3 })

export function rateLimit({ windowMs, max, message }: RateLimitOptions) {
  const hits = new Map<string, { count: number; resetAt: number }>()

  return (request: Request, response: Response, next: NextFunction) => {
    const now = Date.now()
    const key = request.ip ?? request.socket.remoteAddress ?? 'unknown'
    const entry = hits.get(key)

    if (!entry || now > entry.resetAt) {
      hits.set(key, { count: 1, resetAt: now + windowMs })
    } else {
      entry.count += 1
      if (entry.count > max) {
        const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000)
        response.setHeader('Retry-After', String(retryAfterSeconds))
        response.status(429).json({
          message: message ?? 'Too many requests. Please try again later.',
        })
        return
      }
    }

    // Opportunistic cleanup so the map does not grow unbounded.
    if (hits.size > 10_000) {
      for (const [mapKey, value] of hits) {
        if (now > value.resetAt) hits.delete(mapKey)
      }
    }

    next()
  }
}
