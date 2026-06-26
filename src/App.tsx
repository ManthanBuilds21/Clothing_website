import { AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import SiteLayout from './components/layout/SiteLayout'
import ProtectedRoute from './components/routing/ProtectedRoute'
import AdminPreviewPage from './pages/Admin/AdminPreviewPage'
import AboutPage from './pages/About/AboutPage'
import CartPage from './pages/Cart/CartPage'
import CollectionsPage from './pages/Collections/CollectionsPage'
import FrontPage from './pages/FrontPage/FrontPage'
import HomePage from './pages/Home/HomePage'
import ProductPage from './pages/Product/ProductPage'
import AccountPage from './pages/Account/AccountPage'
import OrderConfirmationPage from './pages/Checkout/OrderConfirmationPage'
import CheckoutPage from './pages/Checkout/CheckoutPage'
import NotFoundPage from './pages/NotFound/NotFoundPage'

export default function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<FrontPage />} />
        <Route element={<SiteLayout />}>
          {/* Public routes — browsable without login */}
          <Route path="/website" element={<HomePage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/cart" element={<CartPage />} />

          {/* Auth-required routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/account" element={<AccountPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
          </Route>

          {/* Admin-only routes */}
          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/admin" element={<AdminPreviewPage />} />
          </Route>

          {/* 404 catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}
