import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react'
import {
  addCartItem,
  ApiError,
  checkoutRequest,
  getStore,
  mergeGuestCart,
  removeCartItemRequest,
  toggleWishlistRequest,
  updateCartItemRequest,
} from '../lib/api'
import { useAuth } from './useAuth'
import { useToast } from './useToast'
import type { CartItem, CheckoutOrder, StoreSnapshot } from '../types/api'

// ─── Guest storage ────────────────────────────────────────────────────────────

const GUEST_KEY = 'manthan.guest_cart'

interface GuestStore {
  cart: CartItem[]
  wishlist: string[]
}

function loadGuest(): GuestStore {
  try {
    const raw = localStorage.getItem(GUEST_KEY)
    if (!raw) return { cart: [], wishlist: [] }
    return JSON.parse(raw) as GuestStore
  } catch {
    return { cart: [], wishlist: [] }
  }
}

function saveGuest(store: GuestStore) {
  try {
    localStorage.setItem(GUEST_KEY, JSON.stringify(store))
  } catch {
    // storage full — ignore
  }
}

function clearGuest() {
  localStorage.removeItem(GUEST_KEY)
}

function computeGuestSnapshot(guest: GuestStore): StoreSnapshot {
  const cartCount = guest.cart.reduce((s, i) => s + i.quantity, 0)
  // We don't have prices client-side here — subtotal stays 0 for guests
  // The cart page resolves prices from the catalog, so this is fine.
  return {
    cart: guest.cart,
    wishlist: guest.wishlist,
    cartCount,
    subtotal: 0,
  }
}

// ─── Context types ────────────────────────────────────────────────────────────

interface StoreContextValue {
  cart: CartItem[]
  wishlist: string[]
  cartCount: number
  subtotal: number
  isLoading: boolean
  isMutating: boolean
  isGuest: boolean
  addToCart: (productId: string, size: string, quantity: number) => Promise<boolean>
  updateCartItem: (productId: string, size: string, quantity: number) => Promise<boolean>
  removeCartItem: (productId: string, size: string) => Promise<boolean>
  toggleWishlist: (productId: string) => Promise<boolean>
  isWishlisted: (productId: string) => boolean
  checkout: () => Promise<CheckoutOrder | null>
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined)

const emptyStore: StoreSnapshot = {
  cart: [],
  wishlist: [],
  cartCount: 0,
  subtotal: 0,
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function StoreProvider({ children }: PropsWithChildren) {
  const { logout, session, isReady } = useAuth()
  const toast = useToast()
  const [store, setStore] = useState<StoreSnapshot>(emptyStore)
  const [isLoading, setIsLoading] = useState(true)
  const [isMutating, setIsMutating] = useState(false)
  const mergeAttempted = useRef(false)

  // On session change: load server store (and merge guest cart on first login)
  useEffect(() => {
    if (!isReady) return

    if (!session) {
      // Guest mode — load from localStorage
      setStore(computeGuestSnapshot(loadGuest()))
      setIsLoading(false)
      mergeAttempted.current = false
      return
    }

    setIsLoading(true)

    const doLoad = async () => {
      // Merge guest cart items into server cart on first login
      if (!mergeAttempted.current) {
        mergeAttempted.current = true
        const guest = loadGuest()
        if (guest.cart.length > 0) {
          try {
            await mergeGuestCart(session.token, guest.cart)
          } catch {
            // Non-fatal — server cart takes precedence
          }
          clearGuest()
        }
      }

      const snapshot = await getStore(session.token)
      setStore(snapshot)
    }

    void doLoad()
      .catch((error) => {
        console.error(error)
        if (error instanceof ApiError && error.status === 401) logout()
        setStore(emptyStore)
      })
      .finally(() => setIsLoading(false))
  }, [isReady, logout, session])

  // ─── Guest mutations ─────────────────────────────────────────────────────

  const guestAddToCart = useCallback((productId: string, size: string, quantity: number): boolean => {
    const guest = loadGuest()
    const existing = guest.cart.find((i) => i.productId === productId && i.size === size)
    if (existing) {
      existing.quantity += quantity
    } else {
      guest.cart.push({ productId, size, quantity })
    }
    saveGuest(guest)
    setStore(computeGuestSnapshot(guest))
    return true
  }, [])

  const guestUpdateCartItem = useCallback((productId: string, size: string, quantity: number): boolean => {
    const guest = loadGuest()
    const item = guest.cart.find((i) => i.productId === productId && i.size === size)
    if (item) item.quantity = quantity
    saveGuest(guest)
    setStore(computeGuestSnapshot(guest))
    return true
  }, [])

  const guestRemoveCartItem = useCallback((productId: string, size: string): boolean => {
    const guest = loadGuest()
    guest.cart = guest.cart.filter((i) => !(i.productId === productId && i.size === size))
    saveGuest(guest)
    setStore(computeGuestSnapshot(guest))
    return true
  }, [])

  const guestToggleWishlist = useCallback((productId: string): boolean => {
    const guest = loadGuest()
    const idx = guest.wishlist.indexOf(productId)
    if (idx === -1) {
      guest.wishlist.push(productId)
    } else {
      guest.wishlist.splice(idx, 1)
    }
    saveGuest(guest)
    setStore(computeGuestSnapshot(guest))
    return true
  }, [])

  // ─── Server mutation helper ──────────────────────────────────────────────

  const handleMutationError = useCallback((error: unknown, fallbackMessage: string) => {
    console.error(error)
    if (error instanceof ApiError && error.status === 401) {
      logout()
      toast.error('Your session expired. Please log in again.')
      return
    }
    toast.error(fallbackMessage)
  }, [logout, toast])

  const runServerMutation = useCallback(async (
    fallbackMessage: string,
    action: (token: string) => Promise<StoreSnapshot>,
  ): Promise<boolean> => {
    if (!session?.token) return false
    setIsMutating(true)
    try {
      const nextStore = await action(session.token)
      setStore(nextStore)
      return true
    } catch (error) {
      handleMutationError(error, fallbackMessage)
      return false
    } finally {
      setIsMutating(false)
    }
  }, [handleMutationError, session])

  // ─── Unified API ─────────────────────────────────────────────────────────

  const value = useMemo<StoreContextValue>(() => {
    const isGuest = !session

    return {
      ...store,
      isLoading,
      isMutating,
      isGuest,
      addToCart: async (productId, size, quantity) => {
        if (isGuest) return guestAddToCart(productId, size, quantity)
        return runServerMutation(
          'We could not update your cart right now.',
          (token) => addCartItem(token, { productId, size, quantity }),
        )
      },
      updateCartItem: async (productId, size, quantity) => {
        if (isGuest) return guestUpdateCartItem(productId, size, quantity)
        return runServerMutation(
          'We could not update your cart right now.',
          (token) => updateCartItemRequest(token, { productId, size, quantity }),
        )
      },
      removeCartItem: async (productId, size) => {
        if (isGuest) return guestRemoveCartItem(productId, size)
        return runServerMutation(
          'We could not remove that cart item right now.',
          (token) => removeCartItemRequest(token, { productId, size }),
        )
      },
      toggleWishlist: async (productId) => {
        if (isGuest) return guestToggleWishlist(productId)
        return runServerMutation(
          'We could not update your wishlist right now.',
          (token) => toggleWishlistRequest(token, { productId }),
        )
      },
      isWishlisted: (productId) => store.wishlist.includes(productId),
      checkout: async () => {
        if (isGuest) {
          toast.info('Please log in to complete your purchase.')
          return null
        }

        if (!session?.token) return null
        setIsMutating(true)

        try {
          const response = await checkoutRequest(session.token)
          setStore(response.store)
          return response.order
        } catch (error) {
          handleMutationError(error, 'We could not complete checkout right now.')
          return null
        } finally {
          setIsMutating(false)
        }
      },
    }
  }, [
    guestAddToCart,
    guestRemoveCartItem,
    guestToggleWishlist,
    guestUpdateCartItem,
    handleMutationError,
    isLoading,
    isMutating,
    runServerMutation,
    session,
    store,
    toast,
  ])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)

  if (!context) {
    throw new Error('useStore must be used within StoreProvider')
  }

  return context
}
