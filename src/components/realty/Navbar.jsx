import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, Heart, Home as HomeIcon, Building2, Users, Info, LifeBuoy, Contact as ContactIcon, ChevronDown, MessageSquare, Briefcase } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFavorites } from '@/lib/FavoritesContext'
import { getPhonesForToday, getPhoneLink } from '@/lib/phones'
import { OFFICES } from '@/data/offices'
import PhoneRevolver from './PhoneRevolver'

const links = [
  { to: '/', label: 'Головна', icon: HomeIcon },
  { to: '/flats?deal=sale', label: 'Каталог', icon: Building2, activePaths: ['/flats', '/houses', '/realtys'] },
  { to: '/utilities', label: 'Служби', icon: LifeBuoy },
  { to: '/agents', label: 'Агенти', icon: Users },
  { to: '/o-korporatcii', label: 'Про нас', icon: Info },
  { to: '/kontakty', label: 'Контакти', icon: ContactIcon },
  { to: '/vakansii', label: 'Вакансії', icon: Briefcase },
]

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [reviewsOpen, setReviewsOpen] = useState(false)
  const [mobileReviewsOpen, setMobileReviewsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { favorites } = useFavorites()
  const count = favorites.length
  const reviewsRef = useRef(null)
  const phones = getPhonesForToday()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (reviewsRef.current && !reviewsRef.current.contains(e.target)) {
        setReviewsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        setReviewsOpen(false)
        setMobileReviewsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    setOpen(false)
    setReviewsOpen(false)
    setMobileReviewsOpen(false)
  }, [location])

  return (
    <header className={cn(
      'fixed top-0 inset-x-0 z-50 transition-all duration-300',
      scrolled ? 'bg-white/95 backdrop-blur-xl border-b border-black/5 shadow-sm' : 'bg-white/85 backdrop-blur-xl border-b border-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
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

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6" aria-label="Основна навігація">
          {links.map((l) => {
            const isActive = l.activePaths ? l.activePaths.includes(location.pathname) : location.pathname === l.to
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  'text-sm font-medium transition-colors duration-300',
                  isActive ? 'text-gold font-semibold' : 'text-foreground/70 hover:text-foreground'
                )}
              >
                {l.label}
              </Link>
            )
          })}

          {/* Reviews Dropdown (Desktop) */}
          <div className="relative" ref={reviewsRef}>
            <button
              type="button"
              onClick={() => setReviewsOpen((prev) => !prev)}
              aria-expanded={reviewsOpen}
              className={cn(
                'flex items-center gap-1 text-sm font-medium transition-colors duration-300',
                reviewsOpen ? 'text-gold' : 'text-foreground/70 hover:text-foreground'
              )}
            >
              <span>Відгуки</span>
              <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', reviewsOpen && 'rotate-180')} />
            </button>

            <AnimatePresence>
              {reviewsOpen && (
                <div className="absolute top-full right-0 mt-7 z-50">
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: 'top right' }}
                    className="w-[280px] max-h-[340px] overflow-y-auto custom-scrollbar bg-white rounded-2xl shadow-[0_14px_36px_rgba(15,23,42,0.14)] border border-border/60 p-2"
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
                        className="flex flex-col px-3 py-2 hover:bg-navy/5 rounded-xl transition-colors group"
                        onClick={() => setReviewsOpen(false)}
                      >
                        <span className="font-semibold text-sm text-foreground group-hover:text-navy transition-colors">{office.name}</span>
                        <span className="text-[11px] text-muted-foreground truncate">{office.shortAddress}</span>
                      </a>
                    ))}
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Favorites heart */}
          <Link
            to="/favorites"
            aria-label={`Збережені об'єкти (${count})`}
            className={cn(
              'relative w-10 h-10 rounded-full flex items-center justify-center transition-colors',
              location.pathname === '/favorites' ? 'text-gold' : 'text-foreground/60 hover:text-gold'
            )}
          >
            <Heart className={cn('w-5 h-5', location.pathname === '/favorites' && 'fill-gold text-gold')} />
            {count > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-gold text-white text-[9px] font-bold flex items-center justify-center rounded-full shadow-sm">
                {count}
              </span>
            )}
          </Link>

          {/* Phone revolver */}
          <PhoneRevolver phones={phones} />

          <Link
            to="/kontakty"
            className="hidden lg:block px-6 py-2.5 gradient-gold rounded-full text-xs tracking-wide uppercase font-inter font-semibold hover:opacity-90 transition-opacity text-white shadow-sm"
          >
            Консультація
          </Link>

          {/* Hamburger — mobile only */}
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? 'Закрити меню' : 'Відкрити меню'}
            aria-expanded={open}
            className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-foreground active:bg-black/5 transition-colors"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-black/5 px-4 py-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="space-y-1">
            {links.map((l) => {
              const isActive = l.activePaths ? l.activePaths.includes(location.pathname) : location.pathname === l.to
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cn(
                    'flex items-center gap-4 px-4 py-3 rounded-xl text-base font-medium transition-colors',
                    isActive ? 'bg-gold/10 text-gold font-semibold' : 'text-foreground/80 active:bg-black/5'
                  )}
                >
                  <l.icon className="w-5 h-5" />
                  <span>{l.label}</span>
                </Link>
              )
            })}

            <Link
              to="/favorites"
              className={cn(
                'flex items-center gap-4 px-4 py-3 rounded-xl text-base font-medium transition-colors',
                location.pathname === '/favorites' ? 'bg-gold/10 text-gold font-semibold' : 'text-foreground/80 active:bg-black/5'
              )}
            >
              <Heart className={cn('w-5 h-5', location.pathname === '/favorites' && 'fill-gold text-gold')} />
              <span>Обране {count > 0 && <span className="text-sm text-gold font-semibold">({count})</span>}</span>
            </Link>

            {/* Mobile Reviews Accordion */}
            <div className="flex flex-col pt-1">
              <button
                type="button"
                onClick={() => setMobileReviewsOpen((prev) => !prev)}
                className={cn(
                  'flex items-center gap-4 px-4 py-3 rounded-xl text-base font-medium transition-colors w-full',
                  mobileReviewsOpen ? 'bg-navy/5 text-navy' : 'text-foreground/80 active:bg-black/5'
                )}
              >
                <MessageSquare className="w-5 h-5" />
                <span>Відгуки за філіями</span>
                <ChevronDown className={cn('w-4 h-4 ml-auto transition-transform duration-200', mobileReviewsOpen && 'rotate-180')} />
              </button>

              <AnimatePresence>
                {mobileReviewsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 py-2 mt-1 space-y-1 bg-muted/40 rounded-xl ml-4 max-h-[260px] overflow-y-auto custom-scrollbar">
                      {OFFICES.map((office) => (
                        <a
                          key={office.id}
                          href={office.reviewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col py-2 px-3 hover:bg-navy/5 rounded-lg transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          <span className="font-semibold text-sm text-foreground">{office.name}</span>
                          <span className="text-[11px] text-muted-foreground">{office.shortAddress}</span>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          <div className="flex flex-col gap-1 mt-4 pt-3 border-t border-border/50">
            {phones.map((p, idx) => (
              <a
                key={idx}
                href={getPhoneLink(p)}
                className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium text-foreground/80 active:bg-black/5"
              >
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <span>{p}</span>
              </a>
            ))}
          </div>

          <Link
            to="/kontakty"
            className="block mt-4 mb-2 px-5 py-3.5 gradient-gold rounded-2xl text-xs tracking-wide uppercase font-semibold text-center text-white shadow-sm"
          >
            Консультація
          </Link>
        </div>
      )}
    </header>
  )
}

export default Navbar
