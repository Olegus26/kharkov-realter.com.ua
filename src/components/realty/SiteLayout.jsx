import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import FloatingTelegram from './FloatingTelegram'
import AmbientSideWaves from './AmbientSideWaves'

const SiteLayout = () => {
  const location = useLocation()
  const isMapView = location.search.includes('viewMode=map')
  const isPropertyPage = location.pathname.startsWith('/property/')

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col relative overflow-x-clip">
      {!isMapView && <AmbientSideWaves />}
      <Navbar />
      <main className="flex-grow relative z-10 min-h-[100dvh]">
        <Outlet />
      </main>
      {!isMapView && <Footer />}
      {!isMapView && <FloatingTelegram hideOnMobile={isPropertyPage} />}
    </div>
  )
}
export default SiteLayout
