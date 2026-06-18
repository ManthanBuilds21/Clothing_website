import bcrypt from 'bcrypt'
import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { signAuthToken } from '../src/lib/auth.js'
import { createApp } from '../src/app.js'

const { mockPrisma, resetMockPrisma } = vi.hoisted(() => {
  const prisma = {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      upsert: vi.fn(),
    },
    collection: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
    product: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    newsletterSubscriber: {
      upsert: vi.fn(),
    },
    cartItem: {
      findMany: vi.fn(),
      upsert: vi.fn(),
      update: vi.fn(),
      deleteMany: vi.fn(),
    },
    wishlistItem: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
      create: vi.fn(),
    },
    order: {
      count: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
    },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $transaction: vi.fn(),
  }

  return {
    mockPrisma: prisma,
    resetMockPrisma() {
      Object.values(prisma).forEach((value) => {
        if (value && typeof value === 'object') {
          Object.values(value).forEach((member) => {
            if (typeof member === 'function' && 'mockReset' in member) {
              ;(member as { mockReset: () => void }).mockReset()
            }
          })
        }
      })
    },
  }
})

vi.mock('../src/lib/prisma.js', () => ({
  prisma: mockPrisma,
}))

describe('auth routes', () => {
  const app = createApp()

  beforeEach(() => {
    resetMockPrisma()
  })

  it('signs up a user with the standard success envelope', async () => {
    mockPrisma.user.findUnique.mockResolvedValueOnce(null)
    mockPrisma.user.create.mockResolvedValueOnce({
      id: 'user_1',
      name: 'Manthan User',
      email: 'user@example.com',
      role: 'USER',
    })

    const response = await request(app).post('/api/auth/signup').send({
      name: 'Manthan User',
      email: 'user@example.com',
      password: 'strong-pass',
      role: 'user',
    })

    expect(response.status).toBe(201)
    expect(response.body.success).toBe(true)
    expect(response.body.data.user.email).toBe('user@example.com')
    expect(response.body.data.token).toEqual(expect.any(String))
  })

  it('logs in a user with a hashed password', async () => {
    const passwordHash = await bcrypt.hash('strong-pass', 12)

    mockPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'user_1',
      name: 'Manthan User',
      email: 'user@example.com',
      role: 'USER',
      passwordHash,
    })

    const response = await request(app).post('/api/auth/login').send({
      email: 'user@example.com',
      password: 'strong-pass',
      role: 'user',
    })

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data.user.role).toBe('user')
  })

  it('rejects duplicate signups', async () => {
    mockPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'user_1',
      name: 'Existing User',
      email: 'user@example.com',
      role: 'USER',
    })

    const response = await request(app).post('/api/auth/signup').send({
      name: 'Existing User',
      email: 'user@example.com',
      password: 'strong-pass',
      role: 'user',
    })

    expect(response.status).toBe(409)
    expect(response.body).toEqual({
      success: false,
      message: 'An account with that email already exists.',
    })
  })

  it('rejects invalid login credentials and mismatched roles', async () => {
    const passwordHash = await bcrypt.hash('strong-pass', 12)

    mockPrisma.user.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        id: 'user_1',
        name: 'Manthan User',
        email: 'user@example.com',
        role: 'USER',
        passwordHash,
      })
      .mockResolvedValueOnce({
        id: 'admin_1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'ADMIN',
        passwordHash,
      })

    const missingUserResponse = await request(app).post('/api/auth/login').send({
      email: 'missing@example.com',
      password: 'strong-pass',
      role: 'user',
    })

    expect(missingUserResponse.status).toBe(401)
    expect(missingUserResponse.body.message).toBe('Invalid email or password.')

    const wrongPasswordResponse = await request(app).post('/api/auth/login').send({
      email: 'user@example.com',
      password: 'wrong-pass',
      role: 'user',
    })

    expect(wrongPasswordResponse.status).toBe(401)
    expect(wrongPasswordResponse.body.message).toBe('Invalid email or password.')

    const wrongRoleResponse = await request(app).post('/api/auth/login').send({
      email: 'admin@example.com',
      password: 'strong-pass',
      role: 'user',
    })

    expect(wrongRoleResponse.status).toBe(403)
    expect(wrongRoleResponse.body.message).toBe(
      'That account does not match the selected role.',
    )
  })

  it('returns the authenticated user for /me', async () => {
    const token = signAuthToken({
      id: 'user_1',
      email: 'user@example.com',
      role: 'USER',
    })

    mockPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'user_1',
      name: 'Manthan User',
      email: 'user@example.com',
      role: 'USER',
    })

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      success: true,
      data: {
        user: {
          id: 'user_1',
          name: 'Manthan User',
          email: 'user@example.com',
          role: 'user',
        },
      },
    })
  })

  it('fails /me when the token is valid but the user no longer exists', async () => {
    const token = signAuthToken({
      id: 'missing_user',
      email: 'missing@example.com',
      role: 'USER',
    })

    mockPrisma.user.findUnique.mockResolvedValueOnce(null)

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(401)
    expect(response.body).toEqual({
      success: false,
      message: 'Authentication required.',
    })
  })

  it('rejects invalid login bodies with a failure envelope', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'not-an-email',
      password: 'short',
      role: 'user',
    })

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('Validation failed.')
  })
})
