import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <motion.div
      className="page-shell flex min-h-[80vh] flex-col items-center justify-center py-20 text-center"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Ghost number */}
      <div
        className="ghost-label ghost-outline pointer-events-none select-none"
        aria-hidden="true"
      >
        404
      </div>

      <div className="relative -mt-6 sm:-mt-10">
        <p className="eyebrow">Page not found</p>
        <h1 className="mt-5 text-[3.2rem] leading-[0.9] sm:text-[5rem] lg:text-[6.5rem]">
          Nothing lives here yet.
        </h1>
        <p className="section-copy mx-auto mt-6">
          The page you're looking for doesn't exist or may have moved. Head back to the collections and find something worth wearing.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/collections" className="button-primary">
            Browse collections
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link to="/website" className="button-secondary">
            Go home
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
