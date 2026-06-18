import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp } from '../src/app.js'
import { mockPrisma, resetMockPrisma } from './helpers/mockPrisma.js'

vi.mock('../src/lib/prisma.js', () => ({
  prisma: mockPrisma,
}))

describe('catalog routes', () => {
  const app = createApp()

  beforeEach(() => {
    resetMockPrisma()
  })

  it('returns the catalog payload in the success envelope', async () => {
    mockPrisma.collection.findMany.mockResolvedValueOnce([
      {
        id: 'signal-noise',
        slug: 'signal-noise',
        name: 'Signal Noise',
        ghostText: 'Signal',
        tagline: 'Built for daylight energy and after-hours movement.',
        description: 'Description',
        category: 'Hoodies',
        background: '#F4845F',
        accent: '#F7B49C',
        heroImage: 'https://example.com/image.jpg',
        productSlugs: ['gridline-heavy-hoodie'],
      },
    ])
    mockPrisma.product.findMany.mockResolvedValueOnce([
      {
        id: 'gridline-hoodie',
        slug: 'gridline-heavy-hoodie',
        name: 'Gridline Heavy Hoodie',
        category: 'Hoodies',
        collection: {
          id: 'signal-noise',
          slug: 'signal-noise',
          name: 'Signal Noise',
          ghostText: 'Signal',
          tagline: 'Tagline',
          description: 'Description',
          category: 'Hoodies',
          background: '#F4845F',
          accent: '#F7B49C',
          heroImage: 'https://example.com/image.jpg',
          productSlugs: ['gridline-heavy-hoodie'],
        },
        price: 148,
        accent: '#F4845F',
        background: '#F6B39D',
        ghostText: 'Gridline',
        badge: 'New Drop',
        shortDescription: 'Short description',
        description: 'Description',
        story: 'Story',
        fit: 'Fit',
        material: 'Material',
        colors: ['Bone'],
        sizes: ['M'],
        features: ['Feature'],
        images: ['https://example.com/product.jpg'],
      },
    ])

    const response = await request(app).get('/api/catalog')

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data.products).toHaveLength(1)
    expect(response.body.data.collections).toHaveLength(1)
  })

  it('returns a single product by slug', async () => {
    mockPrisma.product.findUnique.mockResolvedValueOnce({
      id: 'gridline-hoodie',
      slug: 'gridline-heavy-hoodie',
      name: 'Gridline Heavy Hoodie',
      category: 'Hoodies',
      collection: {
        id: 'signal-noise',
        slug: 'signal-noise',
        name: 'Signal Noise',
        ghostText: 'Signal',
        tagline: 'Tagline',
        description: 'Description',
        category: 'Hoodies',
        background: '#F4845F',
        accent: '#F7B49C',
        heroImage: 'https://example.com/image.jpg',
        productSlugs: ['gridline-heavy-hoodie'],
      },
      price: 148,
      accent: '#F4845F',
      background: '#F6B39D',
      ghostText: 'Gridline',
      badge: 'New Drop',
      shortDescription: 'Short description',
      description: 'Description',
      story: 'Story',
      fit: 'Fit',
      material: 'Material',
      colors: ['Bone'],
      sizes: ['M'],
      features: ['Feature'],
      images: ['https://example.com/product.jpg'],
    })

    const response = await request(app).get('/api/catalog/products/gridline-heavy-hoodie')

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data.product.slug).toBe('gridline-heavy-hoodie')
  })

  it('returns a failure envelope for unknown products', async () => {
    mockPrisma.product.findUnique.mockResolvedValueOnce(null)

    const response = await request(app).get('/api/catalog/products/missing-product')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({
      success: false,
      message: 'Product not found.',
    })
  })
})
