import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

const CATALOG_PATHS = ['/flats', '/houses', '/realtys']

const ScrollToTop = () => {
  const { pathname, key } = useLocation()
  const navType = useNavigationType()
  const prevPathnameRef = useRef(pathname)
  const isRestoringRef = useRef(false)

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    let rafId = null

    const handleScroll = () => {
      if (isRestoringRef.current || rafId !== null) return
      rafId = window.requestAnimationFrame(() => {
        rafId = null
        try {
          sessionStorage.setItem(`scroll_pos_${key}`, String(Math.round(window.scrollY)))
        } catch {
          // Storage unavailable
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId !== null) window.cancelAnimationFrame(rafId)
    }
  }, [key])

  useEffect(() => {
    const prevPath = prevPathnameRef.current
    const isCatalogSwitch = CATALOG_PATHS.includes(prevPath) && CATALOG_PATHS.includes(pathname)
    const isReturningFromProperty = prevPath.startsWith('/property/') && CATALOG_PATHS.includes(pathname)
    prevPathnameRef.current = pathname

    if (isReturningFromProperty && typeof window !== 'undefined') {
      sessionStorage.setItem('catalogReturnScroll', '1')
      return
    }

    if (isCatalogSwitch) return

    let saved = 0
    if (navType === 'POP') {
      try {
        saved = Number(sessionStorage.getItem(`scroll_pos_${key}`) || 0)
      } catch {
        saved = 0
      }
    }

    if (navType === 'POP' && saved > 0) {
      isRestoringRef.current = true
      let attempts = 0
      let timerId = null

      const stopRestore = () => {
        if (timerId !== null) {
          clearInterval(timerId)
          timerId = null
        }
        isRestoringRef.current = false
      }

      const tryScroll = () => {
        window.scrollTo({ top: saved, left: 0, behavior: 'instant' })
        attempts += 1
        if (Math.abs(window.scrollY - saved) < 5 || attempts >= 25) {
          stopRestore()
        }
      }

      tryScroll()
      if (isRestoringRef.current) {
        timerId = setInterval(tryScroll, 100)
      }

      return () => {
        stopRestore()
      }
    }

    isRestoringRef.current = false
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    })
  }, [pathname, key, navType])

  return null
}

export default ScrollToTop
