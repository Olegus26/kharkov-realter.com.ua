import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import PageNotFound from './lib/PageNotFound'
import { AuthProvider } from '@/lib/AuthContext'
import { FavoritesProvider } from '@/lib/FavoritesContext'
import { ThemeProvider } from '@/components/ThemeProvider'
import SiteLayout from '@/components/realty/SiteLayout'
import ScrollToTop from '@/components/realty/ScrollToTop'

// Lazy load all page components for code splitting
// Only the route the user visits gets downloaded
const HomePage = lazy(() => import('@/pages/realty/Home'))
const CatalogPage = lazy(() => import('@/pages/realty/Catalog'))
const PropertyDetail = lazy(() => import('@/pages/realty/PropertyDetail'))
const AgentsPage = lazy(() => import('@/pages/realty/Agents'))
const AboutPage = lazy(() => import('@/pages/realty/About'))
const ContactPage = lazy(() => import('@/pages/realty/Contact'))
const FavoritesPage = lazy(() => import('@/pages/realty/Favorites'))
const UtilitiesPage = lazy(() => import('@/pages/realty/Utilities'))
const VacanciesPage = lazy(() => import('@/pages/realty/Vacancies'))

// Minimal loading fallback — just a subtle pulse, no layout shift
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="flex gap-1.5">
      <div className="w-2 h-2 rounded-full bg-gold/60 animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 rounded-full bg-gold/60 animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 rounded-full bg-gold/60 animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  </div>
)

const CatalogWrapper = () => {
  const location = useLocation()
  const path = location.pathname
  
  if (!path.startsWith('/flats') && !path.startsWith('/houses') && !path.startsWith('/realtys')) {
    return <PageNotFound />
  }

  let category = 'apartment'
  if (path.startsWith('/houses')) category = 'house'
  else if (path.startsWith('/realtys')) category = 'commercial'
  
  return <CatalogPage defaultCategory={category} />
}

const AuthenticatedApp = () => {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        } />
        
        {/* Single dynamic route guarantees exactly zero unmounts between flats/houses/realtys */}
        <Route path="/:catalogType" element={<Suspense fallback={<PageLoader />}><CatalogWrapper /></Suspense>} />
        <Route path="/property/:id" element={
          <Suspense fallback={<PageLoader />}>
            <PropertyDetail />
          </Suspense>
        } />
        <Route path="/agents" element={
          <Suspense fallback={<PageLoader />}>
            <AgentsPage />
          </Suspense>
        } />
        <Route path="/o-korporatcii" element={
          <Suspense fallback={<PageLoader />}>
            <AboutPage />
          </Suspense>
        } />
        <Route path="/kontakty" element={
          <Suspense fallback={<PageLoader />}>
            <ContactPage />
          </Suspense>
        } />
        <Route path="/favorites" element={
          <Suspense fallback={<PageLoader />}>
            <FavoritesPage />
          </Suspense>
        } />
        <Route path="/utilities" element={
          <Suspense fallback={<PageLoader />}><UtilitiesPage /></Suspense>
        } />
        <Route path="/vakansii" element={
          <Suspense fallback={<PageLoader />}><VacanciesPage /></Suspense>
        } />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

const App = () => {
  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="system">
        <AuthProvider>
          <FavoritesProvider>
            <QueryClientProvider client={queryClientInstance}>
              <Router>
                <ScrollToTop />
                <AuthenticatedApp />
              </Router>
              <Toaster />
            </QueryClientProvider>
          </FavoritesProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}

export default App