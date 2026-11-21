import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const CATALOG_PATHS = ['/flats', '/houses', '/realtys']

const ScrollToTop = () => {
  const { pathname } = useLocation()
  const prevPathnameRef = useRef(pathname)

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

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [pathname])

  return null
}

export default ScrollToTop
