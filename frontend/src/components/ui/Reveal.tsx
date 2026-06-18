import { motion, type HTMLMotionProps, type Variants } from 'framer-motion'

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
}

interface RevealProps extends HTMLMotionProps<'div'> {
  delay?: number
}

export default function Reveal({
  children,
  delay = 0,
  variants,
  ...props
}: RevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={variants ?? revealVariants}
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.06,
    },
  },
}
