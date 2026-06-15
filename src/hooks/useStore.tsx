import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { products } from '../data/catalog'

interface CartItem {
  productId: string
  size: string
  quantity: number
}

interface StoreContextValue {
  cart: CartItem[]
  wishlist: string[]
  cartCount: number
  subtotal: number
  addToCart: (productId: string, size: string, quantity: number) => void
  updateCartItem: (productId: string, size: string, quantity: number) => void
  removeCartItem: (productId: string, size: string) => void
  toggleWishlist: (productId: string) => void
  isWishlisted: (productId: string) => boolean
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined)

export function StoreProvider({ children }: PropsWithChildren) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])

  const addToCart = (productId: string, size: string, quantity: number) => {
    setCart((current) => {
      const existing = current.find(
        (item) => item.productId === productId && item.size === size,
      )

      if (!existing) {
        return [...current, { productId, size, quantity }]
      }

      return current.map((item) =>
        item.productId === productId && item.size === size
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      )
    })
  }

  const updateCartItem = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((current) =>
        current.filter((item) => !(item.productId === productId && item.size === size)),
      )
      return
    }

    setCart((current) =>
      current.map((item) =>
        item.productId === productId && item.size === size ? { ...item, quantity } : item,
      ),
    )
  }

  const removeCartItem = (productId: string, size: string) => {
    setCart((current) =>
      current.filter((item) => !(item.productId === productId && item.size === size)),
    )
  }

  const toggleWishlist = (productId: string) => {
    setWishlist((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    )
  }

  const value = useMemo<StoreContextValue>(() => {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = cart.reduce((sum, item) => {
      const product = products.find((entry) => entry.id === item.productId)
      return sum + (product ? product.price * item.quantity : 0)
    }, 0)

    return {
      cart,
      wishlist,
      cartCount,
      subtotal,
      addToCart,
      updateCartItem,
      removeCartItem,
      toggleWishlist,
      isWishlisted: (productId: string) => wishlist.includes(productId),
    }
  }, [cart, wishlist])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)

  if (!context) {
    throw new Error('useStore must be used within StoreProvider')
  }

  return context
}
