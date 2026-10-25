import { lazy, Suspense } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { queryClientInstance } from '@/lib/query-client'
import PageNotFound from '@/lib/PageNotFound'
import { AuthProvider } from '@/lib/AuthContext'
import { FavoritesProvider } from '@/lib/FavoritesContext'
import SiteLayout from '@/components/realty/SiteLayout'
import ScrollToTop from '@/components/realty/ScrollToTop'

// Lazy load all page components for code splitting: only the visited route gets downloaded
const HomePage = lazy(() => import('@/pages/realty/Home'))
const CatalogPage = lazy(() => import('@/pages/realty/Catalog'))
const PropertyDetail = lazy(() => import('@/pages/realty/PropertyDetail'))
const AgentsPage = lazy(() => import('@/pages/realty/Agents'))
const AboutPage = lazy(() => import('@/pages/realty/About'))
const ContactPage = lazy(() => import('@/pages/realty/Contact'))
const FavoritesPage = lazy(() => import('@/pages/realty/Favorites'))
const UtilitiesPage = lazy(() => import('@/pages/realty/Utilities'))
const VacanciesPage = lazy(() => import('@/pages/realty/Vacancies'))
const EOseliaPage = lazy(() => import('@/pages/realty/EOselia'))
const EVidnovlennyaPage = lazy(() => import('@/pages/realty/EVidnovlennya'))

const CATALOG_CATEGORY_BY_PATH = {
  '/flats': 'apartment',
  '/houses': 'house',
  '/realtys': 'commercial',
}

// Minimal loading fallback — just a subtle pulse, no layout shift
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-label="Завантаження">
    <div className="flex gap-1.5">
      {[0, 150, 300].map((delay) => (
        <div
          key={delay}
          className="w-2 h-2 rounded-full bg-gold/60 animate-bounce"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  </div>
)

const CatalogWrapper = () => {
  const { pathname } = useLocation()
  const category = CATALOG_CATEGORY_BY_PATH[pathname.replace(/\/+$/, '')]

  if (!category) return <PageNotFound />

  return <CatalogPage defaultCategory={category} />
}

const lazyElement = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
)

const PAGE_ROUTES = [
  { path: '/', component: HomePage },
  { path: '/eoselia', component: EOseliaPage },
  { path: '/evidnovlennya', component: EVidnovlennyaPage },
  // Single dynamic route guarantees zero unmounts between flats/houses/realtys
  { path: '/:catalogType', component: CatalogWrapper },
  { path: '/property/:id', component: PropertyDetail },
  { path: '/agents', component: AgentsPage },
  { path: '/o-korporatcii', component: AboutPage },
  { path: '/kontakty', component: ContactPage },
  { path: '/favorites', component: FavoritesPage },
  { path: '/utilities', component: UtilitiesPage },
  { path: '/vakansii', component: VacanciesPage },
]

const AppRoutes = () => (
  <Routes>
    <Route element={<SiteLayout />}>
      {PAGE_ROUTES.map(({ path, component }) => (
        <Route key={path} path={path} element={lazyElement(component)} />
      ))}
    </Route>
    <Route path="*" element={<PageNotFound />} />
  </Routes>
)

const App = () => (
  <HelmetProvider>
    <AuthProvider>
      <FavoritesProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <ScrollToTop />
            <AppRoutes />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </FavoritesProvider>
    </AuthProvider>
  </HelmetProvider>
)

export default App