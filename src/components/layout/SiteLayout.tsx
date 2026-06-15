import { motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '../navigation/Navbar'
import CursorHalo from '../ui/CursorHalo'
import ScrollProgress from '../ui/ScrollProgress'
import SiteFooter from './SiteFooter'

export default function SiteLayout() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <div className="relative min-h-screen">
      <ScrollProgress />
      <CursorHalo />
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="pt-24 sm:pt-28"
      >
        <Outlet />
      </motion.main>
      <SiteFooter />
    </div>
  )
}
