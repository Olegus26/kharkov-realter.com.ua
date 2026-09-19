import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import FloatingTelegram from './FloatingTelegram'

const SiteLayout = () => {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <motion.main
        key={location.pathname}
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
