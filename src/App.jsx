import { Component, lazy, Suspense } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import { queryClientInstance } from '@/lib/query-client'
import PageNotFound from '@/lib/PageNotFound'
import { FavoritesProvider } from '@/lib/FavoritesContext'
import SiteLayout from '@/components/realty/SiteLayout'
import ScrollToTop from '@/components/realty/ScrollToTop'
import HomePage from '@/pages/realty/Home'
import CatalogPage from '@/pages/realty/Catalog'
import PropertyDetail from '@/pages/realty/PropertyDetail'

const CHUNK_RELOAD_KEY = 'chunk_reload_ried'

const lazyWithRetry = (importer) =>
  lazy(async () => {
    try {
      const mod = await importer()
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(CHUNK_RELOAD_KEY)
      }
      return mod
    } catch (err) {
      if (typeof window !== 'undefined' && !sessionStorage.getItem(CHUNK_RELOAD_KEY)) {
        sessionStorage.setItem(CHUNK_RELOAD_KEY, '1')
        window.location.reload()
        return new Promise(() => {})
      }
      throw err
    }
  })

const AgentsPage = lazyWithRetry(() => import('@/pages/realty/Agents'))
const AboutPage = lazyWithRetry(() => import('@/pages/realty/About'))
const ContactPage = lazyWithRetry(() => import('@/pages/realty/Contact'))
const FavoritesPage = lazyWithRetry(() => import('@/pages/realty/Favorites'))
const UtilitiesPage = lazyWithRetry(() => import('@/pages/realty/Utilities'))
const VacanciesPage = lazyWithRetry(() => import('@/pages/realty/Vacancies'))
const EOseliaPage = lazyWithRetry(() => import('@/pages/realty/EOselia'))
const EVidnovlennyaPage = lazyWithRetry(() => import('@/pages/realty/EVidnovlennya'))

const CATALOG_CATEGORY_BY_PATH = {
  '/flats': 'apartment',
  '/houses': 'house',
  '/realtys': 'commercial',
}

// Minimal loading fallback — full viewport height keeps Footer below the fold to avoid CLS
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center" role="status" aria-label="Завантаження">
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

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  handleReload = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(CHUNK_RELOAD_KEY)
      window.location.reload()
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div
        role="alert"
        className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center font-inter"
      >
        <p className="font-cormorant text-4xl font-bold text-foreground mb-3">
          Сторінка оновилася
        </p>
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          Сталася тимчасова помилка відображення або сайт був щойно оновлений. Оновіть сторінку, щоб продовжити.
        </p>
        <button
          type="button"
          tabIndex={0}
          aria-label="Оновити сторінку"
          onClick={this.handleReload}
          className="px-6 py-3 rounded-full bg-navy text-white text-xs font-semibold tracking-wider uppercase hover:bg-navy/90 transition-colors cursor-pointer"
        >
          Оновити сторінку
        </button>
      </div>
    )
  }
}

const lazyElement = (LazyComponent) => (
  <Suspense fallback={<PageLoader />}>
    <LazyComponent />
  </Suspense>
)

const PAGE_ROUTES = [
  { path: '/', element: <HomePage /> },
  { path: '/eoselia', element: lazyElement(EOseliaPage) },
  { path: '/evidnovlennya', element: lazyElement(EVidnovlennyaPage) },
  // Single dynamic route guarantees zero unmounts between flats/houses/realtys
  { path: '/:catalogType', element: <CatalogWrapper /> },
  { path: '/property/:id', element: <PropertyDetail /> },
  { path: '/agents', element: lazyElement(AgentsPage) },
  { path: '/o-korporatcii', element: lazyElement(AboutPage) },
  { path: '/kontakty', element: lazyElement(ContactPage) },
  { path: '/favorites', element: lazyElement(FavoritesPage) },
  { path: '/utilities', element: lazyElement(UtilitiesPage) },
  { path: '/vakansii', element: lazyElement(VacanciesPage) },
]

const AppRoutes = () => (
  <Routes>
    <Route element={<SiteLayout />}>
      {PAGE_ROUTES.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
    </Route>
    <Route path="*" element={<PageNotFound />} />
  </Routes>
)

const App = () => (
  <HelmetProvider>
    <FavoritesProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </Router>
      </QueryClientProvider>
    </FavoritesProvider>
  </HelmetProvider>
)

export default App