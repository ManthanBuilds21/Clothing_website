import { AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import SiteLayout from './components/layout/SiteLayout'
import AboutPage from './pages/About/AboutPage'
import CartPage from './pages/Cart/CartPage'
import CollectionsPage from './pages/Collections/CollectionsPage'
import HomePage from './pages/Home/HomePage'
import ProductPage from './pages/Product/ProductPage'

export default function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}
