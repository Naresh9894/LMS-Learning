import { useRef } from 'react'
import { useInView } from 'framer-motion'

/**
 * useScrollAnimation
 * ------------------
 * Consistent scroll-triggered animations across the whole app.
 *
 * @param {object} options
 * @param {boolean} options.once   - animate once or replay (default: true)
 * @param {string}  options.margin - when to fire (default: '-100px')
 *
 * Usage:
 *   const { ref, inView } = useScrollAnimation()
 *   const { ref, inView } = useScrollAnimation({ margin: '-150px' })
 */
const useScrollAnimation = (options = {}) => {
  const ref = useRef(null)
  const inView = useInView(ref, {
    once: true,
    margin: '-100px',
    ...options,
  })
  return { ref, inView }
}

export default useScrollAnimation