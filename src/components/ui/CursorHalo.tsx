import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CursorHalo() {
  const [enabled, setEnabled] = useState(false)
  const x = useMotionValue(-160)
  const y = useMotionValue(-160)
  const smoothX = useSpring(x, { stiffness: 140, damping: 18, mass: 0.3 })
  const smoothY = useSpring(y, { stiffness: 140, damping: 18, mass: 0.3 })

  useEffect(() => {
    const media = window.matchMedia('(pointer:fine)')
    setEnabled(media.matches)

    const handleChange = () => setEnabled(media.matches)
    const handleMove = (event: PointerEvent) => {
      x.set(event.clientX - 90)
      y.set(event.clientY - 90)
    }

    media.addEventListener('change', handleChange)
    window.addEventListener('pointermove', handleMove)

    return () => {
      media.removeEventListener('change', handleChange)
      window.removeEventListener('pointermove', handleMove)
    }
  }, [x, y])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed z-[70] h-44 w-44 rounded-full bg-black/5 blur-3xl mix-blend-multiply"
      style={{ x: smoothX, y: smoothY }}
    />
  )
}
