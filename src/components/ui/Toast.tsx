import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, Info, X, XCircle } from 'lucide-react'
import { useToastState, type Toast } from '../../hooks/useToast'

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
}

const ACCENT = {
  success: 'var(--green)',
  error: '#e85555',
  info: 'var(--blue)',
}

function ToastItem({ toast, dismiss }: { toast: Toast; dismiss: (id: string) => void }) {
  const Icon = ICONS[toast.type]
  const accent = ACCENT[toast.type]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.95 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      role="alert"
      aria-live="polite"
      className="pointer-events-auto flex w-full max-w-[360px] items-start gap-3 overflow-hidden rounded-[1.4rem] border border-black/[0.08] bg-white/[0.92] p-4 shadow-[0_22px_60px_rgba(17,17,17,0.14)] backdrop-blur-xl"
    >
      {/* accent bar */}
      <div
        className="mt-0.5 h-5 w-1 shrink-0 rounded-full"
        style={{ backgroundColor: accent }}
        aria-hidden="true"
      />

      <Icon
        className="mt-0.5 h-4 w-4 shrink-0"
        style={{ color: accent }}
        aria-hidden="true"
      />

      <p className="flex-1 text-xs leading-relaxed text-black/80">
        {toast.message}
      </p>

      <button
        type="button"
        onClick={() => dismiss(toast.id)}
        aria-label="Dismiss notification"
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-black/40 transition-colors hover:bg-black/[0.06] hover:text-black"
      >
        <X className="h-3 w-3" />
      </button>
    </motion.div>
  )
}

export default function ToastRegion() {
  const { toasts, dismiss } = useToastState()

  return (
    <div
      aria-label="Notifications"
      className="pointer-events-none fixed bottom-6 right-4 z-[200] flex flex-col items-end gap-3 sm:right-6"
    >
      <AnimatePresence mode="sync">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} dismiss={dismiss} />
        ))}
      </AnimatePresence>
    </div>
  )
}
