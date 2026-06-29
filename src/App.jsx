import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import PageNotFound from './lib/PageNotFound'
import { AuthProvider } from '@/lib/AuthContext'
import SiteLayout from '@/components/realty/SiteLayout'
import HomePage from '@/pages/realty/Home'
import CatalogPage from '@/pages/realty/Catalog'
import PropertyDetail from '@/pages/realty/PropertyDetail'
import AgentsPage from '@/pages/realty/Agents'
import AboutPage from '@/pages/realty/About'
import ContactPage from '@/pages/realty/Contact'
import ScrollToTop from '@/components/realty/ScrollToTop'

const AuthenticatedApp = () => {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/agents" element={<AgentsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App