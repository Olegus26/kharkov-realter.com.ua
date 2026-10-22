import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import FloatingTelegram from './FloatingTelegram'
import AmbientWaveBackground from './AmbientWaveBackground'

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
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-x-hidden">
      {/* Living ambient wave background that reacts to scroll in parallax and gently breathes */}
      <AmbientWaveBackground />

      <Navbar />
      <motion.main
        key={layoutKey}
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="flex-grow relative z-10"
      >
        <Outlet />
      </motion.main>
      <Footer />
      <FloatingTelegram />
    </div>
  )
}
export default SiteLayout
