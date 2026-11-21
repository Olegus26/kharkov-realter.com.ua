import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import FloatingTelegram from './FloatingTelegram'

const SiteLayout = () => {
  const location = useLocation()
  const isMapView = location.search.includes('viewMode=map')

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-x-hidden">
      <Navbar />
      <main className="flex-grow relative z-10 min-h-screen">
        <Outlet />
      </main>
      {!isMapView && <Footer />}
      <FloatingTelegram />
    </div>
  )
}
export default SiteLayout
