import { vi } from 'vitest'

export const mockPrisma = {
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

export function resetMockPrisma() {
  Object.values(mockPrisma).forEach((value) => {
    if (value && typeof value === 'object') {
      Object.values(value).forEach((member) => {
        if (typeof member === 'function' && 'mockReset' in member) {
          ;(member as { mockReset: () => void }).mockReset()
        }
      })
    }
  })
}
