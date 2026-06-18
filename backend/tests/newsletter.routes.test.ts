import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp } from '../src/app.js'
import { mockPrisma, resetMockPrisma } from './helpers/mockPrisma.js'

vi.mock('../src/lib/prisma.js', () => ({
  prisma: mockPrisma,
}))

describe('newsletter routes', () => {
  const app = createApp()

  beforeEach(() => {
    resetMockPrisma()
  })

  it('stores newsletter subscribers with the success envelope', async () => {
    mockPrisma.newsletterSubscriber.upsert.mockResolvedValueOnce({
      email: 'subscriber@example.com',
    })

    const response = await request(app).post('/api/newsletter').send({
      email: 'subscriber@example.com',
    })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      success: true,
      data: {
        email: 'subscriber@example.com',
      },
    })
  })

  it('rejects invalid email addresses', async () => {
    const response = await request(app).post('/api/newsletter').send({
      email: 'bad-email',
    })

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('Validation failed.')
  })
})
