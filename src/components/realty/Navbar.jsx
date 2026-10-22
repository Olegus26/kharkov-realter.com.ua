import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  Phone,
  Heart,
  ChevronDown,
  LifeBuoy,
  Home as HomeIcon,
  Building2,
  PhoneCall,
  Hammer,
  Users,
  Info,
  MessageSquare,
  Briefcase,
  Layers
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFavorites } from '@/lib/FavoritesContext'
import { getPhonesForToday, getPhoneLink } from '@/lib/phones'
import { OFFICES } from '@/data/offices'
import PhoneDropdown from './PhoneDropdown'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProgramsOpen, setIsProgramsOpen] = useState(false)
  const [isReviewsOpen, setIsReviewsOpen] = useState(false)
  const [isMobileProgramsOpen, setIsMobileProgramsOpen] = useState(false)
  const [isMobileReviewsOpen, setIsMobileReviewsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const location = useLocation()
  const { favorites } = useFavorites()
  const favoritesCount = favorites.length
  const programsRef = useRef(null)
  const reviewsRef = useRef(null)
  const phones = getPhonesForToday()

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  const handleTogglePrograms = () => {
    setIsProgramsOpen((prev) => !prev)
    setIsReviewsOpen(false)
  }

  const handleToggleReviews = () => {
    setIsReviewsOpen((prev) => !prev)
    setIsProgramsOpen(false)
  }

  const handleToggleMobilePrograms = () => {
    setIsMobileProgramsOpen((prev) => !prev)
  }

  const handleToggleMobileReviews = () => {
    setIsMobileReviewsOpen((prev) => !prev)
  }

  const handleCloseAll = () => {
    setIsMobileMenuOpen(false)
    setIsProgramsOpen(false)
    setIsReviewsOpen(false)
    setIsMobileProgramsOpen(false)
    setIsMobileReviewsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (programsRef.current && !programsRef.current.contains(e.target)) {
        setIsProgramsOpen(false)
      }
      if (reviewsRef.current && !reviewsRef.current.contains(e.target)) {
        setIsReviewsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCloseAll()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    handleCloseAll()
  }, [location.pathname, location.search])

  const isHomeActive = location.pathname === '/'

  const isCatalogActive =
    location.pathname.startsWith('/flats') ||
    location.pathname.startsWith('/houses') ||
    location.pathname.startsWith('/realtys') ||
    location.pathname.startsWith('/property')

  const isProgramsActive = ['/evidnovlennya', '/eoselia'].includes(location.pathname)
  const isAgentsActive = location.pathname === '/agents'
  const isAboutActive = location.pathname === '/o-korporatcii'
  const isVacanciesActive = location.pathname === '/vakansii'
  const isUtilitiesActive = location.pathname === '/utilities'
  const isContactActive = location.pathname === '/kontakty'

  return (
    <header className={cn(
      'fixed top-0 inset-x-0 z-50 transition-all duration-300',
      scrolled ? 'bg-white/95 backdrop-blur-xl border-b border-black/5 shadow-sm' : 'bg-white/85 backdrop-blur-xl border-b border-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3 xl:gap-4">
        {/* Logo */}
        <Link
          to="/"
          onClick={handleCloseAll}
          aria-label="На головну Харків Ріелтер"
          className="flex items-center gap-2.5 sm:gap-3 shrink-0 group focus:outline-none"
        >
          <img
            src="/logo.png"
            alt="Харків Ріелтер логотип"
            className="h-8 sm:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div>
            <p className="font-cormorant font-bold text-base sm:text-lg leading-none tracking-widest text-foreground">ХАРКІВ</p>
            <p className="text-[9px] tracking-[0.3em] text-gold uppercase font-semibold">Ріелтер</p>
          </div>
        </Link>

        {/* Desktop Navigation: Головна · Каталог · Програми ▾ · Агенти · Про нас · Відгуки ▾ · Вакансії · Служби · Контакти */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2.5" aria-label="Основна навігація">
          <Link
            to="/"
            className={cn(
              'px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-full text-xs xl:text-sm font-medium transition-colors duration-200',
              isHomeActive ? 'bg-gold/10 text-gold font-semibold' : 'text-foreground/75 hover:text-foreground hover:bg-black/5'
            )}
          >
            Головна
          </Link>

          <Link
            to="/flats?deal=sale"
            className={cn(
              'px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-full text-xs xl:text-sm font-medium transition-colors duration-200',
              isCatalogActive ? 'bg-gold/10 text-gold font-semibold' : 'text-foreground/75 hover:text-foreground hover:bg-black/5'
            )}
          >
            Каталог
          </Link>

          {/* Програми ▾ Dropdown */}
          <div className="relative" ref={programsRef}>
            <button
              type="button"
              onClick={handleTogglePrograms}
              aria-expanded={isProgramsOpen}
              aria-haspopup="true"
              aria-label="Меню державних програм"
              className={cn(
                'flex items-center gap-1 px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-full text-xs xl:text-sm font-medium transition-colors duration-200 outline-none',
                isProgramsOpen || isProgramsActive ? 'bg-gold/10 text-gold font-semibold' : 'text-foreground/75 hover:text-foreground hover:bg-black/5'
              )}
            >
              <span>Програми</span>
              <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', isProgramsOpen && 'rotate-180')} />
            </button>

            <AnimatePresence>
              {isProgramsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50">
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                    className="w-80 bg-white rounded-2xl shadow-[0_16px_40px_rgba(15,23,42,0.14)] border border-border/70 p-2 space-y-1"
                  >
                    <Link
                      to="/evidnovlennya"
                      onClick={handleCloseAll}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted/70 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Hammer className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-foreground">єВідновлення</span>
                        <span className="text-[10px] text-muted-foreground truncate">Купівля житла за сертифікатом Дія</span>
                      </div>
                    </Link>

                    <Link
                      to="/eoselia"
                      onClick={handleCloseAll}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted/70 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#1a365d]/10 text-navy flex items-center justify-center shrink-0 group-hover:bg-navy group-hover:text-white transition-colors">
                        <HomeIcon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-foreground">єОселя</span>
                        <span className="text-[10px] text-muted-foreground truncate">Пільгова іпотека від 3% та 7%</span>
                      </div>
                    </Link>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/agents"
            className={cn(
              'px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-full text-xs xl:text-sm font-medium transition-colors duration-200',
              isAgentsActive ? 'bg-gold/10 text-gold font-semibold' : 'text-foreground/75 hover:text-foreground hover:bg-black/5'
            )}
          >
            Агенти
          </Link>

          <Link
            to="/o-korporatcii"
            className={cn(
              'px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-full text-xs xl:text-sm font-medium transition-colors duration-200',
              isAboutActive ? 'bg-gold/10 text-gold font-semibold' : 'text-foreground/75 hover:text-foreground hover:bg-black/5'
            )}
          >
            Про нас
          </Link>

          {/* Відгуки ▾ Dropdown */}
          <div className="relative" ref={reviewsRef}>
            <button
              type="button"
              onClick={handleToggleReviews}
              aria-expanded={isReviewsOpen}
              aria-haspopup="true"
              aria-label="Відгуки за філіями Google Maps"
              className={cn(
                'flex items-center gap-1 px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-full text-xs xl:text-sm font-medium transition-colors duration-200 outline-none',
                isReviewsOpen ? 'bg-gold/10 text-gold font-semibold' : 'text-foreground/75 hover:text-foreground hover:bg-black/5'
              )}
            >
              <span>Відгуки</span>
              <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', isReviewsOpen && 'rotate-180')} />
            </button>

            <AnimatePresence>
              {isReviewsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50">
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                    className="w-[290px] max-h-[340px] overflow-y-auto custom-scrollbar bg-white rounded-2xl shadow-[0_16px_40px_rgba(15,23,42,0.14)] border border-border/70 p-2 space-y-1"
                  >
                    <div className="px-3 py-1.5 border-b border-border/40 mb-1">
                      <p className="text-[10px] tracking-widest uppercase font-semibold text-muted-foreground font-inter">Відгуки Google Maps за філіями</p>
                    </div>
                    {OFFICES.map((office) => (
                      <a
                        key={office.id}
                        href={office.reviewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col px-3 py-2 hover:bg-muted/70 rounded-xl transition-colors group"
                        onClick={handleCloseAll}
                      >
                        <span className="font-semibold text-xs text-foreground group-hover:text-navy transition-colors">{office.name}</span>
                        <span className="text-[11px] text-muted-foreground truncate">{office.shortAddress}</span>
                      </a>
                    ))}
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/vakansii"
            className={cn(
              'px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-full text-xs xl:text-sm font-medium transition-colors duration-200',
              isVacanciesActive ? 'bg-gold/10 text-gold font-semibold' : 'text-foreground/75 hover:text-foreground hover:bg-black/5'
            )}
          >
            Вакансії
          </Link>

          <Link
            to="/utilities"
            className={cn(
              'px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-full text-xs xl:text-sm font-medium transition-colors duration-200',
              isUtilitiesActive ? 'bg-gold/10 text-gold font-semibold' : 'text-foreground/75 hover:text-foreground hover:bg-black/5'
            )}
          >
            Служби
          </Link>

          <Link
            to="/kontakty"
            className={cn(
              'px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-full text-xs xl:text-sm font-medium transition-colors duration-200',
              isContactActive ? 'bg-gold/10 text-gold font-semibold' : 'text-foreground/75 hover:text-foreground hover:bg-black/5'
            )}
          >
            Контакти
          </Link>
        </nav>

        {/* Right Section: Favorites, Phone Dropdown, Consultation CTA & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Favorites Heart */}
          <Link
            to="/favorites"
            onClick={handleCloseAll}
            aria-label={`Збережені об'єкти (${favoritesCount})`}
            className={cn(
              'relative w-10 h-10 rounded-full flex items-center justify-center transition-colors focus:outline-none',
              location.pathname === '/favorites' ? 'text-gold' : 'text-foreground/60 hover:text-gold'
            )}
          >
            <Heart className={cn('w-5 h-5', location.pathname === '/favorites' && 'fill-gold text-gold')} />
            {favoritesCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-gold text-white text-[9px] font-bold flex items-center justify-center rounded-full shadow-sm">
                {favoritesCount}
              </span>
            )}
          </Link>

          {/* Intuitive Phone Dropdown */}
          <PhoneDropdown phones={phones} />

          <Link
            to="/kontakty"
            className="hidden lg:block px-5 py-2.5 gradient-gold rounded-full text-xs tracking-wide uppercase font-inter font-semibold hover:opacity-90 transition-opacity text-white shadow-sm"
          >
            Консультація
          </Link>

          {/* Accessible Hamburger Toggle */}
          <button
            type="button"
            onClick={handleToggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Закрити меню навігації' : 'Відкрити меню навігації'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            tabIndex={0}
            className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-foreground hover:bg-black/5 active:bg-black/10 transition-colors focus:outline-none focus:ring-2 focus:ring-gold/40"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="lg:hidden bg-white/98 backdrop-blur-xl border-t border-black/5 px-4 py-4 max-h-[calc(100vh-4rem)] overflow-y-auto"
        >
          <nav className="space-y-1">
            <Link
              to="/"
              onClick={handleCloseAll}
              className={cn(
                'flex items-center gap-3.5 px-4 py-3 rounded-xl text-base font-medium transition-colors',
                isHomeActive ? 'bg-gold/10 text-gold font-semibold' : 'text-foreground/80 active:bg-black/5'
              )}
            >
              <HomeIcon className="w-5 h-5 text-gold shrink-0" />
              <span>Головна</span>
            </Link>

            <Link
              to="/flats?deal=sale"
              onClick={handleCloseAll}
              className={cn(
                'flex items-center gap-3.5 px-4 py-3 rounded-xl text-base font-medium transition-colors',
                isCatalogActive ? 'bg-gold/10 text-gold font-semibold' : 'text-foreground/80 active:bg-black/5'
              )}
            >
              <Building2 className="w-5 h-5 text-gold shrink-0" />
              <span>Каталог нерухомості</span>
            </Link>

            {/* Mobile "Програми" Accordion */}
            <div className="flex flex-col pt-1">
              <button
                type="button"
                onClick={handleToggleMobilePrograms}
                aria-expanded={isMobileProgramsOpen}
                className={cn(
                  'flex items-center gap-3.5 px-4 py-3 rounded-xl text-base font-medium transition-colors w-full',
                  isMobileProgramsOpen || isProgramsActive ? 'bg-muted/80 text-foreground font-semibold' : 'text-foreground/80 active:bg-black/5'
                )}
              >
                <Layers className="w-5 h-5 text-gold shrink-0" />
                <span>Програми</span>
                <ChevronDown className={cn('w-4 h-4 ml-auto transition-transform duration-200', isMobileProgramsOpen && 'rotate-180')} />
              </button>

              {isMobileProgramsOpen && (
                <div className="pl-4 pr-1 py-1 space-y-1">
                  <Link
                    to="/evidnovlennya"
                    onClick={handleCloseAll}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/80 hover:text-foreground"
                  >
                    <Hammer className="w-4 h-4 text-emerald-600" />
                    <span>єВідновлення</span>
                  </Link>

                  <Link
                    to="/eoselia"
                    onClick={handleCloseAll}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/80 hover:text-foreground"
                  >
                    <HomeIcon className="w-4 h-4 text-navy" />
                    <span>єОселя</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/agents"
              onClick={handleCloseAll}
              className={cn(
                'flex items-center gap-3.5 px-4 py-3 rounded-xl text-base font-medium transition-colors',
                isAgentsActive ? 'bg-gold/10 text-gold font-semibold' : 'text-foreground/80 active:bg-black/5'
              )}
            >
              <Users className="w-5 h-5 text-gold shrink-0" />
              <span>Агенти</span>
            </Link>

            <Link
              to="/o-korporatcii"
              onClick={handleCloseAll}
              className={cn(
                'flex items-center gap-3.5 px-4 py-3 rounded-xl text-base font-medium transition-colors',
                isAboutActive ? 'bg-gold/10 text-gold font-semibold' : 'text-foreground/80 active:bg-black/5'
              )}
            >
              <Info className="w-5 h-5 text-gold shrink-0" />
              <span>Про нас</span>
            </Link>

            {/* Mobile "Відгуки за філіями" Accordion */}
            <div className="flex flex-col pt-1">
              <button
                type="button"
                onClick={handleToggleMobileReviews}
                aria-expanded={isMobileReviewsOpen}
                className={cn(
                  'flex items-center gap-3.5 px-4 py-3 rounded-xl text-base font-medium transition-colors w-full',
                  isMobileReviewsOpen ? 'bg-muted/80 text-foreground font-semibold' : 'text-foreground/80 active:bg-black/5'
                )}
              >
                <MessageSquare className="w-5 h-5 text-gold shrink-0" />
                <span>Відгуки за філіями</span>
                <ChevronDown className={cn('w-4 h-4 ml-auto transition-transform duration-200', isMobileReviewsOpen && 'rotate-180')} />
              </button>

              {isMobileReviewsOpen && (
                <div className="ml-3 pl-3 border-l border-border/50 space-y-1 py-1 max-h-48 overflow-y-auto">
                  {OFFICES.map((office) => (
                    <a
                      key={office.id}
                      href={office.reviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleCloseAll}
                      className="block py-1.5 px-2 rounded-lg text-xs text-muted-foreground hover:text-foreground"
                    >
                      <div className="font-semibold text-foreground text-[12px]">{office.name}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{office.shortAddress}</div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/vakansii"
              onClick={handleCloseAll}
              className={cn(
                'flex items-center gap-3.5 px-4 py-3 rounded-xl text-base font-medium transition-colors',
                isVacanciesActive ? 'bg-gold/10 text-gold font-semibold' : 'text-foreground/80 active:bg-black/5'
              )}
            >
              <Briefcase className="w-5 h-5 text-gold shrink-0" />
              <span>Вакансії</span>
            </Link>

            <Link
              to="/utilities"
              onClick={handleCloseAll}
              className={cn(
                'flex items-center gap-3.5 px-4 py-3 rounded-xl text-base font-medium transition-colors',
                isUtilitiesActive ? 'bg-gold/10 text-gold font-semibold' : 'text-foreground/80 active:bg-black/5'
              )}
            >
              <LifeBuoy className="w-5 h-5 text-gold shrink-0" />
              <span>Комунальні служби</span>
            </Link>

            <Link
              to="/kontakty"
              onClick={handleCloseAll}
              className={cn(
                'flex items-center gap-3.5 px-4 py-3 rounded-xl text-base font-medium transition-colors',
                isContactActive ? 'bg-gold/10 text-gold font-semibold' : 'text-foreground/80 active:bg-black/5'
              )}
            >
              <PhoneCall className="w-5 h-5 text-gold shrink-0" />
              <span>Контакти</span>
            </Link>

            <Link
              to="/favorites"
              onClick={handleCloseAll}
              className={cn(
                'flex items-center gap-3.5 px-4 py-3 rounded-xl text-base font-medium transition-colors',
                location.pathname === '/favorites' ? 'bg-gold/10 text-gold font-semibold' : 'text-foreground/80 active:bg-black/5'
              )}
            >
              <Heart className={cn('w-5 h-5', location.pathname === '/favorites' && 'fill-gold text-gold')} />
              <span>Обране {favoritesCount > 0 && <span className="text-sm text-gold font-semibold">({favoritesCount})</span>}</span>
            </Link>
          </nav>

          {/* Mobile phone numbers */}
          <div className="flex flex-col gap-1 mt-5 pt-4 border-t border-border/60">
            <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground px-4 mb-1">Чергові номери</p>
            {phones.map((p, idx) => (
              <a
                key={idx}
                href={getPhoneLink(p)}
                onClick={handleCloseAll}
                className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-foreground hover:bg-muted/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gold shrink-0" />
                  <span>{p}</span>
                </div>
                <span className="text-[11px] text-muted-foreground font-normal">Дзвінок</span>
              </a>
            ))}
          </div>

          <Link
            to="/kontakty"
            onClick={handleCloseAll}
            className="block mt-5 mb-2 px-5 py-3.5 gradient-gold rounded-2xl text-xs tracking-wide uppercase font-semibold text-center text-white shadow-sm"
          >
            Замовити консультацію
          </Link>
        </div>
      )}
    </header>
  )
}

export default Navbar
