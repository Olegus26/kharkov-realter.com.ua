import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const CATALOG_PATHS = ['/flats', '/houses', '/realtys']

const ScrollToTop = () => {
  const { pathname } = useLocation()
  const prevPathnameRef = useRef(pathname)

  useEffect(() => {
    const isCatalogSwitch = CATALOG_PATHS.includes(prevPathnameRef.current) && CATALOG_PATHS.includes(pathname)
    prevPathnameRef.current = pathname

    if (isCatalogSwitch) return

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [pathname])

  return null
}

export default ScrollToTop
