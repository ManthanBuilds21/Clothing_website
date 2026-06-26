import { CheckCircle, ArrowRight, Package } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Reveal from '../../components/ui/Reveal'

export default function OrderConfirmationPage() {
  const { orderId } = useParams()

  return (
    <motion.div
      className="page-shell pb-16 pt-8"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="section-frame">
        <Reveal className="campaign-surface bg-black p-8 text-white sm:p-12 lg:p-16">
          <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--green)]">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <p className="eyebrow text-white/[0.55]">Order confirmed</p>
              </div>
              <h1 className="mt-6 text-[4rem] leading-[0.88] sm:text-[6rem] lg:text-[8rem]">
                You're all set.
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-7 text-white/[0.65] sm:text-base">
                Your order has been placed and is being prepared. A confirmation will be sent to
                your registered email address.
              </p>
            </div>

            <div className="shrink-0 rounded-[1.5rem] border border-white/[0.12] bg-white/[0.06] p-6">
              <p className="eyebrow text-white/[0.45]">Order reference</p>
              <p className="mt-3 font-mono text-lg font-semibold text-white">
                #{orderId?.slice(0, 8).toUpperCase()}
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: Package,
              title: 'Processing',
              description: 'Your order is being reviewed and packed in our studio.',
            },
            {
              icon: CheckCircle,
              title: 'Dispatch',
              description: 'Estimated dispatch within 2–3 business days.',
            },
            {
              icon: ArrowRight,
              title: 'Delivery',
              description: 'You\'ll receive tracking details once the parcel ships.',
            },
          ].map(({ icon: Icon, title, description }) => (
            <Reveal key={title}>
              <div className="campaign-surface bg-[var(--cloud)] p-6">
                <Icon className="h-5 w-5 text-black/[0.5]" />
                <p className="eyebrow mt-5">{title}</p>
                <p className="mt-3 text-sm leading-7 text-black/[0.68]">{description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link to="/collections" className="button-primary">
            Continue shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link to="/account" className="button-secondary">
            View my orders
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
