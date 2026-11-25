import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
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
  Layers,
  ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFavorites } from '@/lib/FavoritesContext'
import { useSeasonalAssets } from '@/lib/season'
import { OFFICES } from '@/data/offices'

const NAV_PILL_TRANSITION = { type: 'spring', stiffness: 420, damping: 38, mass: 0.85 }
const NAV_PILL_INSTANT = { duration: 0 }

const getDesktopNavClass = (isActive, isButton = false) =>
  cn(
    'relative z-10 px-3 py-1.5 xl:px-3.5 xl:py-2 rounded-full text-xs xl:text-sm font-medium whitespace-nowrap transition-colors duration-200',
    isButton && 'flex items-center gap-1 outline-none',
    isActive ? 'text-white' : 'text-foreground/75 hover:text-foreground hover:bg-black/5'
  )

const Navbar = () => {
  const { logo } = useSeasonalAssets()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [isReviewsOpen, setIsReviewsOpen] = useState(false)
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false)
  const [isMobileReviewsOpen, setIsMobileReviewsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const location = useLocation()
  const { favorites } = useFavorites()
  const favoritesCount = favorites.length
  const servicesRef = useRef(null)
  const reviewsRef = useRef(null)

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  const handleToggleServices = () => {
    setIsServicesOpen((prev) => !prev)
    setIsReviewsOpen(false)
  }

  const handleToggleReviews = () => {
    setIsReviewsOpen((prev) => !prev)
    setIsServicesOpen(false)
  }

  const handleToggleMobileServices = () => {
    setIsMobileServicesOpen((prev) => !prev)
  }

  const handleToggleMobileReviews = () => {
    setIsMobileReviewsOpen((prev) => !prev)
  }

  const handleCloseAll = () => {
    setIsMobileMenuOpen(false)
    setIsServicesOpen(false)
    setIsReviewsOpen(false)
    setIsMobileServicesOpen(false)
    setIsMobileReviewsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setIsServicesOpen(false)
      }
      if (reviewsRef.current && !reviewsRef.current.contains(e.target)) {
        setIsReviewsOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
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

  const isServicesActive = ['/eoselia', '/evidnovlennya', '/utilities'].includes(location.pathname)
  const isAboutActive = location.pathname === '/o-korporatcii'
  const isAgentsActive = location.pathname === '/agents'
  const isVacanciesActive = location.pathname === '/vakansii'
  const isContactActive = location.pathname === '/kontakty'

  const activeNavId = isServicesOpen
    ? 'services'
    : isReviewsOpen
      ? 'reviews'
      : isHomeActive
        ? 'home'
        : isCatalogActive
          ? 'catalog'
          : isServicesActive
            ? 'services'
            : isAboutActive
              ? 'about'
              : isAgentsActive
                ? 'agents'
                : isVacanciesActive
                  ? 'vacancies'
                  : isContactActive
                    ? 'contact'
                    : null

  const navRef = useRef(null)
  const tabRefs = useRef({})
  const hasShownPillRef = useRef(false)
  const [pillStyle, setPillStyle] = useState({ x: 0, width: 0, visible: false, animate: false })

  const setTabRef = useCallback(
    (id) => (el) => {
      tabRefs.current[id] = el
    },
    []
  )

  const measureActivePill = useCallback(
    (shouldAnimate) => {
      if (!activeNavId) {
        hasShownPillRef.current = false
        setPillStyle((prev) => (prev.visible ? { ...prev, visible: false, animate: false } : prev))
        return
      }
      const navEl = navRef.current
      const tabEl = tabRefs.current[activeNavId]
      if (!navEl || !tabEl) return

      const navRect = navEl.getBoundingClientRect()
      const tabRect = tabEl.getBoundingClientRect()
      if (tabRect.width === 0) return

      const x = tabRect.left - navRect.left
      const width = tabRect.width
      const animate = Boolean(shouldAnimate && hasShownPillRef.current)
      hasShownPillRef.current = true
      setPillStyle({ x, width, visible: true, animate })
    },
    [activeNavId]
  )

  useLayoutEffect(() => {
    measureActivePill(true)
  }, [measureActivePill])

  useEffect(() => {
    let isCancelled = false
    const handleResize = () => {
      measureActivePill(false)
    }
    window.addEventListener('resize', handleResize)
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!isCancelled) measureActivePill(false)
      })
    }
    return () => {
      isCancelled = true
      window.removeEventListener('resize', handleResize)
    }
  }, [measureActivePill])

  return (
    <header className={cn(
      'fixed top-0 inset-x-0 z-50 transition-all duration-300',
      scrolled ? 'bg-white/95 backdrop-blur-xl border-b border-black/5 shadow-sm' : 'bg-white/85 backdrop-blur-xl border-b border-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2.5 xl:gap-4">
        {/* Logo */}
        <Link
          to="/"
          onClick={handleCloseAll}
          className="flex items-center gap-2.5 sm:gap-3 shrink-0 group focus:outline-none"
        >
          <img
            src={logo}
            alt=""
            width={160}
            height={160}
            className="h-8 w-8 sm:h-9 sm:w-9 object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div>
            <p className="font-cormorant font-bold text-base sm:text-lg leading-none tracking-widest text-foreground">ХАРКІВ</p>
            <p className="text-[9px] tracking-[0.3em] text-gold uppercase font-semibold">Ріелтер</p>
          </div>
        </Link>

        {/* Desktop Navigation: Головна · Каталог · Послуги ▾ · Про нас · Агенти · Відгуки ▾ · Вакансії · Контакти */}
        <nav ref={navRef} className="relative hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Основна навігація">
          <motion.span
            aria-hidden="true"
            data-nav-pill="true"
            initial={false}
            animate={{
              x: pillStyle.x,
              width: pillStyle.width,
              opacity: pillStyle.visible ? 1 : 0,
            }}
            transition={pillStyle.animate ? NAV_PILL_TRANSITION : NAV_PILL_INSTANT}
            className="pointer-events-none absolute top-0 bottom-0 left-0 rounded-full bg-navy/90 border border-white/15 shadow-sm z-0"
          />

          <Link
            ref={setTabRef('home')}
            to="/"
            onClick={handleCloseAll}
            aria-current={activeNavId === 'home' ? 'page' : undefined}
            className={getDesktopNavClass(activeNavId === 'home')}
          >
            Головна
          </Link>

          <Link
            ref={setTabRef('catalog')}
            to="/flats?deal=sale"
            onClick={handleCloseAll}
            aria-current={activeNavId === 'catalog' ? 'page' : undefined}
            className={getDesktopNavClass(activeNavId === 'catalog')}
          >
            Каталог
          </Link>

          {/* Послуги ▾ Dropdown (єОселя, єВідновлення, Комунальні служби) */}
          <div className="relative" ref={servicesRef}>
            <button
              ref={setTabRef('services')}
              type="button"
              onClick={handleToggleServices}
              aria-expanded={isServicesOpen}
              aria-haspopup="true"
              className={getDesktopNavClass(activeNavId === 'services', true)}
            >
              <span>Послуги</span>
              <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', isServicesOpen && 'rotate-180')} />
            </button>

              <AnimatePresence>
                {isServicesOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50">
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.96 }}
                      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                      className="w-80 bg-white rounded-2xl shadow-[0_16px_40px_rgba(15,23,42,0.14)] border border-border/70 p-2 space-y-1"
                    >
                      <Link
                        to="/eoselia"
                        onClick={handleCloseAll}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted/70 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <HomeIcon className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-semibold text-foreground group-hover:text-blue-600 transition-colors">єОселя</span>
                          <span className="text-[10px] text-muted-foreground truncate">Пільгова іпотека від 3% та 7%</span>
                        </div>
                      </Link>

                      <Link
                        to="/evidnovlennya"
                        onClick={handleCloseAll}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted/70 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <Hammer className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-semibold text-foreground group-hover:text-emerald-600 transition-colors">єВідновлення</span>
                          <span className="text-[10px] text-muted-foreground truncate">Купівля житла за сертифікатом Дія</span>
                        </div>
                      </Link>

                      <div className="border-t border-border/40 my-1" />

                      <Link
                        to="/utilities"
                        onClick={handleCloseAll}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted/70 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                          <LifeBuoy className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-semibold text-foreground group-hover:text-amber-600 transition-colors">Комунальні служби</span>
                          <span className="text-[10px] text-muted-foreground truncate">Довідник аварійних телефонів Харкова</span>
                        </div>
                      </Link>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>

          <Link
            ref={setTabRef('about')}
            to="/o-korporatcii"
            onClick={handleCloseAll}
            aria-current={activeNavId === 'about' ? 'page' : undefined}
            className={getDesktopNavClass(activeNavId === 'about')}
          >
            Про нас
          </Link>

          <Link
            ref={setTabRef('agents')}
            to="/agents"
            onClick={handleCloseAll}
            aria-current={activeNavId === 'agents' ? 'page' : undefined}
            className={getDesktopNavClass(activeNavId === 'agents')}
          >
            Агенти
          </Link>

          {/* Відгуки ▾ Dropdown */}
          <div className="relative" ref={reviewsRef}>
            <button
              ref={setTabRef('reviews')}
              type="button"
              onClick={handleToggleReviews}
              aria-expanded={isReviewsOpen}
              aria-haspopup="true"
              className={getDesktopNavClass(activeNavId === 'reviews', true)}
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
                      className="w-[296px] bg-white rounded-2xl shadow-[0_16px_40px_rgba(15,23,42,0.14)] border border-border/70 overflow-hidden flex flex-col"
                    >
                      <div className="px-4 py-2.5 border-b border-border/40 bg-muted/20 shrink-0">
                        <p className="text-[10px] tracking-widest uppercase font-semibold text-muted-foreground font-inter">Відгуки Google Maps за філіями</p>
                      </div>
                      <div className="max-h-[280px] overflow-y-auto px-2 py-1.5 mr-1 my-1 space-y-0.5 custom-scrollbar">
                        {OFFICES.map((office) => (
                          <a
                            key={office.id}
                            href={office.reviewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            tabIndex={0}
                            aria-label={`Відгуки філії ${office.name}`}
                            className="flex flex-col px-3 py-2 hover:bg-muted/70 rounded-xl transition-colors group"
                            onClick={handleCloseAll}
                          >
                            <span className="font-semibold text-xs text-foreground group-hover:text-navy transition-colors">{office.name}</span>
                            <span className="text-[11px] text-muted-foreground truncate">{office.shortAddress}</span>
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>

          <Link
            ref={setTabRef('vacancies')}
            to="/vakansii"
            onClick={handleCloseAll}
            aria-current={activeNavId === 'vacancies' ? 'page' : undefined}
            className={getDesktopNavClass(activeNavId === 'vacancies')}
          >
            Вакансії
          </Link>

          <Link
            ref={setTabRef('contact')}
            to="/kontakty"
            onClick={handleCloseAll}
            aria-current={activeNavId === 'contact' ? 'page' : undefined}
            className={getDesktopNavClass(activeNavId === 'contact')}
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
              'relative w-10 h-10 rounded-full flex items-center justify-center transition-colors focus:outline-none shrink-0',
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

          <Link
            to="/kontakty"
            className="hidden lg:block px-5 py-2.5 gradient-gold rounded-full text-xs tracking-wide uppercase font-inter font-semibold hover:opacity-90 transition-opacity text-white shadow-sm shrink-0 whitespace-nowrap"
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

      {/* Mobile Navigation Drawer rendered via portal so fixed backdrop covers full viewport below header */}
      {isMobileMenuOpen && typeof document !== 'undefined' && createPortal(
        <>
          <div
            aria-hidden="true"
            onClick={handleCloseAll}
            className="lg:hidden fixed inset-0 top-16 sm:top-20 z-40 bg-black/30 backdrop-blur-[1px]"
          />
          <div
            id="mobile-navigation"
            className="lg:hidden fixed inset-x-0 top-16 sm:top-20 z-40 bg-white/98 backdrop-blur-xl border-t border-black/5 px-4 pt-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] max-h-[calc(100dvh-5.5rem)] sm:max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain shadow-xl"
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

            {/* Mobile "Послуги" Accordion */}
            <div className="flex flex-col pt-1">
              <button
                type="button"
                onClick={handleToggleMobileServices}
                aria-expanded={isMobileServicesOpen}
                className={cn(
                  'flex items-center gap-3.5 px-4 py-3 rounded-xl text-base font-medium transition-colors w-full',
                  isMobileServicesOpen || isServicesActive ? 'bg-muted/80 text-foreground font-semibold' : 'text-foreground/80 active:bg-black/5'
                )}
              >
                <Layers className="w-5 h-5 text-gold shrink-0" />
                <span>Послуги</span>
                <ChevronDown className={cn('w-4 h-4 ml-auto transition-transform duration-200', isMobileServicesOpen && 'rotate-180')} />
              </button>

              {isMobileServicesOpen && (
                <div className="pl-4 pr-1 py-1 space-y-1">
                  <Link
                    to="/eoselia"
                    onClick={handleCloseAll}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted/70 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-600 flex items-center justify-center shrink-0">
                      <HomeIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-xs text-foreground">єОселя</span>
                      <span className="text-[10px] text-muted-foreground">Пільгова іпотека від 3% та 7%</span>
                    </div>
                  </Link>

                  <Link
                    to="/evidnovlennya"
                    onClick={handleCloseAll}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted/70 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                      <Hammer className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-xs text-foreground">єВідновлення</span>
                      <span className="text-[10px] text-muted-foreground">Купівля житла за сертифікатом Дія</span>
                    </div>
                  </Link>

                  <Link
                    to="/utilities"
                    onClick={handleCloseAll}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted/70 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
                      <LifeBuoy className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-xs text-foreground">Комунальні служби</span>
                      <span className="text-[10px] text-muted-foreground">Довідник аварійних телефонів</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

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

          {/* Direct link to 13 branches */}
          <div className="flex flex-col gap-1 mt-5 pt-4 border-t border-border/60">
            <Link
              to="/kontakty"
              onClick={handleCloseAll}
              className="flex items-center justify-between px-4 py-3 rounded-2xl bg-muted/50 hover:bg-muted text-sm font-semibold text-foreground transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-gold shrink-0" />
                <span>13 філій у Харкові</span>
              </div>
              <span className="text-xs text-gold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Адреси <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          <Link
            to="/kontakty"
            onClick={handleCloseAll}
            className="block mt-5 mb-2 px-5 py-3.5 gradient-gold rounded-2xl text-xs tracking-wide uppercase font-semibold text-center text-white shadow-sm"
          >
            Замовити консультацію
          </Link>
        </div>
        </>,
        document.body
      )}
    </header>
  )
}

export default Navbar
