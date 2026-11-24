import { useRef, useCallback } from 'react'

export const useSwipe = ({ onSwipeLeft, onSwipeRight, threshold = 50 }) => {
  const startRef = useRef(null)

  const onTouchStart = useCallback((e) => {
    const t = e.touches[0]
    startRef.current = { x: t.clientX, y: t.clientY }
  }, [])

  const onTouchEnd = useCallback((e) => {
    if (!startRef.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - startRef.current.x
    const dy = t.clientY - startRef.current.y
    startRef.current = null
    if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy) * 1.2) return
    if (dx < 0) onSwipeLeft?.()
    else onSwipeRight?.()
  }, [onSwipeLeft, onSwipeRight, threshold])

  return { onTouchStart, onTouchEnd }
}
