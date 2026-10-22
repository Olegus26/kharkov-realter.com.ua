import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  Phone,
  Heart,
  ChevronDown,
  Info,
  Users,
  MessageSquare,
  Briefcase,
  LifeBuoy,
  Building2,
  Tag,
  KeyRound,
  FileSpreadsheet
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFavorites } from '@/lib/FavoritesContext'
import { getPhonesForToday, getPhoneLink } from '@/lib/phones'
import { OFFICES } from '@/data/offices'
import PhoneDropdown from './PhoneDropdown'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isReviewsSubOpen, setIsReviewsSubOpen] = useState(false)
  const [isMobileAboutOpen, setIsMobileAboutOpen] = useState(false)
  const [isMobileReviewsOpen, setIsMobileReviewsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const location = useLocation()
  const { favorites } = useFavorites()
  const favoritesCount = favorites.length
  const aboutRef = useRef(null)
  const phones = getPhonesForToday()

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  const handleToggleAbout = () => {
    setIsAboutOpen((prev) => !prev)
  }

  const handleToggleReviewsSubmenu = (e) => {
    e.stopPropagation()
    setIsReviewsSubOpen((prev) => !prev)
  }

  const handleToggleMobileAbout = () => {
    setIsMobileAboutOpen((prev) => !prev)
  }

  const handleToggleMobileReviews = (e) => {
    e.stopPropagation()
    setIsMobileReviewsOpen((prev) => !prev)
  }

  const handleCloseAll = () => {
    setIsMobileMenuOpen(false)
    setIsAboutOpen(false)
    setIsReviewsSubOpen(false)
    setIsMobileAboutOpen(false)
    setIsMobileReviewsOpen(false)
  }

  const handleSellClick = (e) => {
    if (location.pathname === '/') {
      const el = document.getElementById('sell')
      if (el) {
        e.preventDefault()
        el.scrollIntoView({ behavior: 'smooth' })
        handleCloseAll()
      }
    }
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (aboutRef.current && !aboutRef.current.contains(e.target)) {
        setIsAboutOpen(false)
        setIsReviewsSubOpen(false)
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

  const isBuyActive = (location.pathname === '/flats' || location.pathname === '/houses') &&
    (location.search.includes('deal=sale') || !location.search.includes('deal=rent'))

  const isRentActive = (location.pathname === '/flats' || location.pathname === '/houses') &&
    location.search.includes('deal=rent')

  const isCommercialActive = location.pathname === '/realtys'

  const isAboutActive = ['/o-korporatcii', '/agents', '/vakansii', '/utilities'].includes(location.pathname)

  const isContactActive = location.pathname === '/kontakty'

  return (
    <header className={cn(
      'fixed top-0 inset-x-0 z-50 transition-all duration-300',
      scrolled ? 'bg-white/95 backdrop-blur-xl border-b border-black/5 shadow-sm' : 'bg-white/85 backdrop-blur-xl border-b border-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          onClick={handleCloseAll}
          aria-label="На головну Харків Ріелтер"
          className="flex items-center gap-3 shrink-0 group focus:outline-none"
        >
          <img
            src="/logo.png"
            alt="Харків Ріелтер логотип"
            className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div>
            <p className="font-cormorant font-bold text-lg leading-none tracking-widest text-foreground">ХАРКІВ</p>
            <p className="text-[9px] tracking-[0.3em] text-gold uppercase font-semibold">Ріелтер</p>
          </div>
        </Link>

        {/* Streamlined Desktop Navigation: Купити · Орендувати · Продати · Комерція · Про нас ▾ · Контакти */}
        <nav className="hidden lg:flex items-center gap-7" aria-label="Основна навігація">
          <Link
            to="/flats?deal=sale"
            className={cn(
              'text-sm font-medium transition-colors duration-200',
              isBuyActive ? 'text-gold font-semibold' : 'text-foreground/75 hover:text-foreground'
            )}
          >
            Купити
          </Link>

          <Link
            to="/flats?deal=rent"
            className={cn(
              'text-sm font-medium transition-colors duration-200',
              isRentActive ? 'text-gold font-semibold' : 'text-foreground/75 hover:text-foreground'
            )}
          >
            Орендувати
          </Link>

          <Link
            to="/#sell"
            onClick={handleSellClick}
            className="text-sm font-medium text-foreground/75 hover:text-foreground transition-colors duration-200"
          >
            Продати
          </Link>

          <Link
            to="/realtys?deal=sale"
            className={cn(
              'text-sm font-medium transition-colors duration-200',
              isCommercialActive ? 'text-gold font-semibold' : 'text-foreground/75 hover:text-foreground'
            )}
          >
            Комерція
          </Link>

          {/* Про нас ▾ Dropdown */}
          <div className="relative" ref={aboutRef}>
            <button
              type="button"
              onClick={handleToggleAbout}
              aria-expanded={isAboutOpen}
              aria-haspopup="true"
              aria-label="Меню інформації про агентство"
              className={cn(
                'flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 outline-none',
                isAboutOpen || isAboutActive ? 'text-gold font-semibold' : 'text-foreground/75 hover:text-foreground'
              )}
            >
              <span>Про нас</span>
              <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', isAboutOpen && 'rotate-180')} />
            </button>

            <AnimatePresence>
              {isAboutOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 z-50">
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                    className="w-72 bg-white rounded-2xl shadow-[0_16px_40px_rgba(15,23,42,0.14)] border border-border/70 p-2"
                  >
                    <Link
                      to="/o-korporatcii"
                      onClick={handleCloseAll}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted/70 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0 group-hover:bg-gold group-hover:text-white transition-colors">
                        <Info className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-foreground">Про компанію</span>
                        <span className="text-[10px] text-muted-foreground truncate">Досвід та стандарти з 1996 року</span>
                      </div>
                    </Link>

                    <Link
                      to="/agents"
                      onClick={handleCloseAll}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted/70 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0 group-hover:bg-gold group-hover:text-white transition-colors">
                        <Users className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-foreground">Експерти</span>
                        <span className="text-[10px] text-muted-foreground truncate">Сертифіковані ріелтори та юристи</span>
                      </div>
                    </Link>

                    {/* Google Reviews branch selector */}
                    <div className="border-t border-b border-border/40 my-1 py-1">
                      <button
                        type="button"
                        onClick={handleToggleReviewsSubmenu}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-foreground hover:bg-muted/70 transition-colors text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0 group-hover:bg-gold group-hover:text-white transition-colors">
                            <MessageSquare className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold text-foreground">Відгуки за філіями</span>
                            <span className="text-[10px] text-muted-foreground truncate">Google Maps рейтинги</span>
                          </div>
                        </div>
                        <ChevronDown className={cn('w-3.5 h-3.5 text-muted-foreground transition-transform duration-200', isReviewsSubOpen && 'rotate-180')} />
                      </button>

                      {isReviewsSubOpen && (
                        <div className="mt-1 pl-11 pr-2 py-1 space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                          {OFFICES.map((office) => (
                            <a
                              key={office.id}
                              href={office.reviewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={handleCloseAll}
                              className="flex items-center justify-between py-1.5 px-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            >
                              <span className="font-semibold text-[11px] text-foreground">{office.name}</span>
                              <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">{office.shortAddress}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    <Link
                      to="/vakansii"
                      onClick={handleCloseAll}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted/70 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0 group-hover:bg-gold group-hover:text-white transition-colors">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-foreground">Вакансії</span>
                        <span className="text-[10px] text-muted-foreground truncate">Робота та стажування в АН</span>
                      </div>
                    </Link>

                    <Link
                      to="/utilities"
                      onClick={handleCloseAll}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted/70 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0 group-hover:bg-gold group-hover:text-white transition-colors">
                        <LifeBuoy className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-foreground">Комунальні служби</span>
                        <span className="text-[10px] text-muted-foreground truncate">Довідник телефонів Харкова</span>
                      </div>
                    </Link>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/kontakty"
            className={cn(
              'text-sm font-medium transition-colors duration-200',
              isContactActive ? 'text-gold font-semibold' : 'text-foreground/75 hover:text-foreground'
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

          {/* Intuitive Phone Dropdown (replaces wheel-based PhoneRevolver) */}
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
              to="/flats?deal=sale"
              onClick={handleCloseAll}
              className={cn(
                'flex items-center gap-3.5 px-4 py-3 rounded-xl text-base font-medium transition-colors',
                isBuyActive ? 'bg-gold/10 text-gold font-semibold' : 'text-foreground/80 active:bg-black/5'
              )}
            >
              <KeyRound className="w-5 h-5 text-gold shrink-0" />
              <span>Купити</span>
            </Link>

            <Link
              to="/flats?deal=rent"
              onClick={handleCloseAll}
              className={cn(
                'flex items-center gap-3.5 px-4 py-3 rounded-xl text-base font-medium transition-colors',
                isRentActive ? 'bg-gold/10 text-gold font-semibold' : 'text-foreground/80 active:bg-black/5'
              )}
            >
              <Tag className="w-5 h-5 text-gold shrink-0" />
              <span>Орендувати</span>
            </Link>

            <Link
              to="/#sell"
              onClick={(e) => {
                handleSellClick(e)
                handleCloseAll()
              }}
              className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-base font-medium text-foreground/80 active:bg-black/5 transition-colors"
            >
              <Building2 className="w-5 h-5 text-gold shrink-0" />
              <span>Продати нерухомість</span>
            </Link>

            <Link
              to="/realtys?deal=sale"
              onClick={handleCloseAll}
              className={cn(
                'flex items-center gap-3.5 px-4 py-3 rounded-xl text-base font-medium transition-colors',
                isCommercialActive ? 'bg-gold/10 text-gold font-semibold' : 'text-foreground/80 active:bg-black/5'
              )}
            >
              <FileSpreadsheet className="w-5 h-5 text-gold shrink-0" />
              <span>Комерція</span>
            </Link>

            {/* Mobile "Про нас" Accordion */}
            <div className="flex flex-col pt-1">
              <button
                type="button"
                onClick={handleToggleMobileAbout}
                aria-expanded={isMobileAboutOpen}
                className={cn(
                  'flex items-center gap-3.5 px-4 py-3 rounded-xl text-base font-medium transition-colors w-full',
                  isMobileAboutOpen || isAboutActive ? 'bg-muted/80 text-foreground font-semibold' : 'text-foreground/80 active:bg-black/5'
                )}
              >
                <Info className="w-5 h-5 text-gold shrink-0" />
                <span>Про нас</span>
                <ChevronDown className={cn('w-4 h-4 ml-auto transition-transform duration-200', isMobileAboutOpen && 'rotate-180')} />
              </button>

              {isMobileAboutOpen && (
                <div className="pl-4 pr-1 py-1 space-y-1">
                  <Link
                    to="/o-korporatcii"
                    onClick={handleCloseAll}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/80 hover:text-foreground"
                  >
                    <span>Про компанію</span>
                  </Link>

                  <Link
                    to="/agents"
                    onClick={handleCloseAll}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/80 hover:text-foreground"
                  >
                    <span>Експерти</span>
                  </Link>

                  {/* Reviews Sub-Accordion */}
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={handleToggleMobileReviews}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-foreground/80 hover:text-foreground w-full"
                    >
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-3.5 h-3.5 text-gold" />
                        <span>Відгуки за філіями</span>
                      </div>
                      <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', isMobileReviewsOpen && 'rotate-180')} />
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
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/80 hover:text-foreground"
                  >
                    <span>Вакансії</span>
                  </Link>

                  <Link
                    to="/utilities"
                    onClick={handleCloseAll}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/80 hover:text-foreground"
                  >
                    <span>Комунальні служби</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/kontakty"
              onClick={handleCloseAll}
              className={cn(
                'flex items-center gap-3.5 px-4 py-3 rounded-xl text-base font-medium transition-colors',
                isContactActive ? 'bg-gold/10 text-gold font-semibold' : 'text-foreground/80 active:bg-black/5'
              )}
            >
              <Phone className="w-5 h-5 text-gold shrink-0" />
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
