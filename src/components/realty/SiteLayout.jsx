import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import FloatingTelegram from './FloatingTelegram'

const CATALOG_PATHS = ['/flats', '/houses', '/realtys']

const getLayoutKey = (pathname) => {
  if (CATALOG_PATHS.some(p => pathname.startsWith(p))) {
    return 'catalog-layout'
  }
  return pathname
}

const SiteLayout = () => {
  const location = useLocation()
  const layoutKey = getLayoutKey(location.pathname)

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative">
      {/* Left side atmospheric blur & gradient towards center (matching PropertyCard style) */}
      <div
        className="pointer-events-none fixed inset-y-0 left-0 w-8 sm:w-24 md:w-40 lg:w-64 xl:w-80 2xl:w-[420px] z-30 bg-gradient-to-r from-navy/45 via-navy/15 to-transparent backdrop-blur-[3px]"
        style={{
          maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0) 100%)'
        }}
        aria-hidden="true"
      />

      {/* Right side atmospheric blur & gradient towards center (matching PropertyCard style) */}
      <div
        className="pointer-events-none fixed inset-y-0 right-0 w-8 sm:w-24 md:w-40 lg:w-64 xl:w-80 2xl:w-[420px] z-30 bg-gradient-to-l from-navy/45 via-navy/15 to-transparent backdrop-blur-[3px]"
        style={{
          maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0) 100%)'
        }}
        aria-hidden="true"
      />

      <Navbar />
      <motion.main
        key={layoutKey}
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="flex-grow"
      >
        <Outlet />
      </motion.main>
      <Footer />
      <FloatingTelegram />
    </div>
  )
}
export default SiteLayout
