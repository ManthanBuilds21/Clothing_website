import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.25,
  })

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[120] h-1 origin-left bg-black"
      style={{ scaleX }}
    />
  )
}
