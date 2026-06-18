import type {
  BrandValue,
  Category,
  CollectionSpotlight,
  EditorialMoment,
  FilterCategory,
  Product,
} from '../types/catalog'

export const categories: FilterCategory[] = [
  'All',
  'Hoodies',
  'T-Shirts',
  'Jackets',
  'Cargo Pants',
  'Sneakers',
  'Accessories',
]

export const products: Product[] = [
  {
    id: 'gridline-hoodie',
    slug: 'gridline-heavy-hoodie',
    name: 'Gridline Heavy Hoodie',
    category: 'Hoodies',
    collection: 'Signal Noise',
    price: 148,
    accent: '#F4845F',
    background: '#F6B39D',
    ghostText: 'Gridline',
    badge: 'New Drop',
    shortDescription: 'A heavyweight hoodie cut with a sculpted shoulder and oversized street silhouette.',
    description:
      'Built for long nights and sharp mornings, the Gridline Heavy Hoodie balances soft brushed fleece with a structured body that holds its shape throughout the day.',
    story:
      'This silhouette was designed around city movement: generous through the torso, clean at the cuff, and finished to feel premium without losing the raw energy of street culture.',
    fit: 'Oversized fit with dropped shoulders and slightly cropped length.',
    material: '520 GSM brushed cotton fleece.',
    colors: ['Bone', 'Heat Orange', 'Washed Black'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    features: ['Double-layer hood', 'Hidden phone sleeve', 'Ribbed cuffs', 'Garment washed finish'],
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'noctis-parka',
    slug: 'noctis-shell-parka',
    name: 'Noctis Shell Parka',
    category: 'Jackets',
    collection: 'After Hours',
    price: 264,
    accent: '#6EB5FF',
    background: '#A2CCFF',
    ghostText: 'Noctis',
    badge: 'Editorial Pick',
    shortDescription: 'Weather-ready technical parka with a refined campaign finish.',
    description:
      'The Noctis Shell Parka is engineered with a crisp matte shell, interior utility pocketing, and a voluminous silhouette that layers cleanly over knitwear and graphic tees.',
    story:
      'Inspired by after-dark city light, this piece brings a calm architectural line to outerwear while keeping the attitude of modern street uniform.',
    fit: 'Relaxed technical fit with adjustable hem and extended collar.',
    material: 'Water-resistant recycled nylon with tonal mesh lining.',
    colors: ['Sky', 'Stone', 'Midnight'],
    sizes: ['S', 'M', 'L', 'XL'],
    features: ['Storm placket', 'Two-way zip', 'Ventilated back yoke', 'Hidden drawcord'],
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'district-tee',
    slug: 'district-cut-tee',
    name: 'District Cut Tee',
    category: 'T-Shirts',
    collection: 'Signal Noise',
    price: 72,
    accent: '#6BBF7A',
    background: '#9FDBAA',
    ghostText: 'District',
    badge: 'Core Essential',
    shortDescription: 'Boxy premium tee with a clean drape and sharp rib collar.',
    description:
      'An elevated staple shaped with a wide body and precise sleeve break, the District Cut Tee is the foundation layer that anchors the rest of the wardrobe.',
    story:
      'The pattern is deliberately minimal, letting proportion do the work. It feels effortless but reads unmistakably premium in motion.',
    fit: 'Relaxed, boxy fit with a straight hem.',
    material: '280 GSM compact combed cotton jersey.',
    colors: ['Soft White', 'Moss', 'Ink'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    features: ['High-rib collar', 'Pre-shrunk finish', 'Side seam structure', 'Soft hand feel'],
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'axis-cargo',
    slug: 'axis-cargo-pant',
    name: 'Axis Cargo Pant',
    category: 'Cargo Pants',
    collection: 'After Hours',
    price: 182,
    accent: '#F5E6D3',
    background: '#F8EEE1',
    ghostText: 'Axis',
    badge: 'Best Seller',
    shortDescription: 'Tailored cargo volume with precise utility details and a fluid break.',
    description:
      'Axis Cargo Pant refines the classic utility shape through cleaner lines, articulated seams, and a tapered pool over premium footwear.',
    story:
      'This pant is all about movement. It shifts between sneaker culture, night events, and everyday wear without ever feeling overdesigned.',
    fit: 'Relaxed thigh with tapered ankle and adjustable opening.',
    material: 'Structured cotton twill with enzyme wash.',
    colors: ['Sand', 'Olive Drab', 'Black'],
    sizes: ['28', '30', '32', '34', '36'],
    features: ['Inset cargo pockets', 'Articulated knee', 'Adjustable hem toggle', 'Reinforced seat panel'],
    images: [
      'https://images.unsplash.com/photo-1506629905607-d9d7d3b81676?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'vertex-runner',
    slug: 'vertex-runner-sneaker',
    name: 'Vertex Runner',
    category: 'Sneakers',
    collection: 'Future Motion',
    price: 228,
    accent: '#6EB5FF',
    background: '#C5E0FF',
    ghostText: 'Vertex',
    badge: 'Fast Lane',
    shortDescription: 'Sculptural runner with layered mesh, premium suede, and campaign-ready contrast.',
    description:
      'The Vertex Runner brings performance-inspired geometry into a luxury streetwear frame with a multi-density sole and elevated material palette.',
    story:
      'Every angle was designed to feel in motion, even when static. It is the footwear expression of the brand: bold, technical, and quietly refined.',
    fit: 'True-to-size performance street fit.',
    material: 'Open mesh, nubuck overlays, injected foam midsole.',
    colors: ['Glacier', 'Steel', 'Bone'],
    sizes: ['40', '41', '42', '43', '44', '45'],
    features: ['Layered upper', 'Reflective lace loop', 'Molded heel clip', 'High rebound sole'],
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'signal-cap',
    slug: 'signal-6-panel-cap',
    name: 'Signal 6 Panel Cap',
    category: 'Accessories',
    collection: 'Signal Noise',
    price: 58,
    accent: '#E882B4',
    background: '#F0B7D3',
    ghostText: 'Signal',
    badge: 'Studio Favorite',
    shortDescription: 'Minimal six-panel cap with tonal embroidery and soft structure.',
    description:
      'The Signal Cap completes the silhouette with understated branding, a comfortable crown, and a washed finish that feels broken in from day one.',
    story:
      'Accessories in the MANTHAN universe are designed to punctuate a look, not overpower it. This one brings exactly the right note.',
    fit: 'Classic six-panel fit with adjustable back strap.',
    material: 'Washed cotton twill with tonal embroidery.',
    colors: ['Rose Dust', 'Slate', 'Off White'],
    sizes: ['One Size'],
    features: ['Curved brim', 'Metal slider', 'Tonal stitch detailing', 'Soft crown'],
    images: [
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'static-fleece',
    slug: 'static-fleece-hoodie',
    name: 'Static Fleece Hoodie',
    category: 'Hoodies',
    collection: 'Future Motion',
    price: 156,
    accent: '#F4F4F4',
    background: '#F5F5F5',
    ghostText: 'Static',
    badge: 'Limited Wash',
    shortDescription: 'Soft fleece volume with a washed neutral tone and premium finish.',
    description:
      'A quieter take on the statement hoodie, Static Fleece is made for layering with outerwear, cargos, and tonal sneakers without losing presence.',
    story:
      'The finish intentionally feels lived-in and elevated, giving the garment a collector-quality softness from the very first wear.',
    fit: 'Relaxed fit with wide body and compact rib finish.',
    material: '480 GSM brushed fleece with vintage wash treatment.',
    colors: ['Mineral', 'Ash', 'Ink'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    features: ['Washed surface', 'Double-needle seams', 'Wide rib hem', 'Soft brushed interior'],
    images: [
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'frame-bomber',
    slug: 'frame-bomber-jacket',
    name: 'Frame Bomber Jacket',
    category: 'Jackets',
    collection: 'After Hours',
    price: 238,
    accent: '#111111',
    background: '#2D2D2D',
    ghostText: 'Frame',
    badge: 'Night Shift',
    shortDescription: 'Compact bomber with a clean frame, glossy hardware, and minimal branding.',
    description:
      'Frame Bomber is all line and proportion. A cropped silhouette, polished zip hardware, and lightly padded structure give it instant authority.',
    story:
      'Where classic bomber energy meets editorial restraint, this is the kind of jacket that makes the whole look feel resolved.',
    fit: 'Cropped fit with a softly padded body.',
    material: 'Technical satin shell with quilted interior.',
    colors: ['Black', 'Petrol', 'Sand'],
    sizes: ['S', 'M', 'L', 'XL'],
    features: ['Metal zipper', 'Padded sleeve', 'Interior pocket', 'Rib stand collar'],
    images: [
      'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
    ],
  },
]

export const collections: CollectionSpotlight[] = [
  {
    id: 'signal-noise',
    slug: 'signal-noise',
    name: 'Signal Noise',
    ghostText: 'Signal',
    tagline: 'Built for daylight energy and after-hours movement.',
    description:
      'Bold fleece, essential tees, and sharp accessories in tones that feel immediate on screen and even stronger in person.',
    category: 'Hoodies',
    background: '#F4845F',
    accent: '#F7B49C',
    heroImage:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=80',
    productSlugs: ['gridline-heavy-hoodie', 'district-cut-tee', 'signal-6-panel-cap'],
  },
  {
    id: 'after-hours',
    slug: 'after-hours',
    name: 'After Hours',
    ghostText: 'Midnight',
    tagline: 'Technical layers and grounded tailoring for the city after dark.',
    description:
      'Clean outerwear, cargos, and refined proportions designed to move from campaign shots to everyday rotation.',
    category: 'Jackets',
    background: '#6EB5FF',
    accent: '#A3D1FF',
    heroImage:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=80',
    productSlugs: ['noctis-shell-parka', 'axis-cargo-pant', 'frame-bomber-jacket'],
  },
  {
    id: 'future-motion',
    slug: 'future-motion',
    name: 'Future Motion',
    ghostText: 'Motion',
    tagline: 'Sculpted layers and forward sneakers made for constant movement.',
    description:
      'This collection pushes the brand into a more technical lane with softer neutrals, dynamic textures, and performance-rooted details.',
    category: 'Sneakers',
    background: '#6BBF7A',
    accent: '#9FDBAA',
    heroImage:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=80',
    productSlugs: ['vertex-runner-sneaker', 'static-fleece-hoodie'],
  },
  {
    id: 'rose-frequency',
    slug: 'rose-frequency',
    name: 'Rose Frequency',
    ghostText: 'Frequency',
    tagline: 'Soft pink energy cut with the same sharp editorial restraint.',
    description:
      'Accessories and statement layers in warmer tones that still feel clean, premium, and campaign-ready.',
    category: 'Accessories',
    background: '#E882B4',
    accent: '#F1B5D2',
    heroImage:
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1400&q=80',
    productSlugs: ['signal-6-panel-cap', 'gridline-heavy-hoodie'],
  },
]

export const editorialMoments: EditorialMoment[] = [
  {
    title: 'Campaign Issue 01',
    description: 'Oversized layers, clean staging, and monochrome color fields that feel like pages from a fashion annual.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=80',
    location: 'Mumbai / Studio Floor',
  },
  {
    title: 'City Uniforms',
    description: 'A wardrobe built to handle transit, daylight, midnight, and the lens in one uninterrupted rhythm.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=80',
    location: 'Delhi / Street Level',
  },
  {
    title: 'Quiet Luxury, Loud Presence',
    description: 'Refined fabrication meets street posture, giving every silhouette a clean but unmistakable weight.',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1400&q=80',
    location: 'Bengaluru / Night Shift',
  },
]

export const brandValues: BrandValue[] = [
  {
    title: 'Shape First',
    description: 'Every drop starts with proportion, because fit creates presence before graphics ever do.',
  },
  {
    title: 'Color With Intent',
    description: 'Monochrome campaign backdrops and focused accent tones keep the visual system memorable and disciplined.',
  },
  {
    title: 'Streetwear, Refined',
    description: 'MANTHAN balances raw energy with clean finishing so each piece feels collectible rather than disposable.',
  },
]

export const lookbookNotes = [
  'Layer wide silhouettes with compact accessories.',
  'Use one bright field color to let the product do the talking.',
  'Keep footwear sculptural and the rest of the look controlled.',
]

export const shippingHighlights = [
  'Free shipping on orders above $180',
  'Easy exchanges within 14 days',
  'Studio support available Monday to Saturday',
]

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug)
}

export function getProductsByCategory(category: Category) {
  return products.filter((product) => product.category === category)
}
