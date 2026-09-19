import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Heart, Home as HomeIcon, Building2, Users, Info, LifeBuoy, Contact as ContactIcon, ChevronDown, MessageSquare, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/lib/FavoritesContext';

const links = [
  { to: '/', label: 'Головна', icon: HomeIcon },
  { to: '/flats?deal=sale', label: 'Каталог', icon: Building2, activePaths: ['/flats', '/houses', '/realtys'] },
  { to: '/utilities', label: 'Служби', icon: LifeBuoy },
  { to: '/agents', label: 'Агенти', icon: Users },
  { to: '/o-korporatcii', label: 'Про нас', icon: Info },
  { to: '/kontakty', label: 'Контакти', icon: ContactIcon },
  { to: '/vakansii', label: 'Вакансії', icon: Briefcase },
];

const REVIEW_GROUPS = [
  [
    { name: 'АЛЕКСЕЕВКА', subtitle: 'Філія «АЛЕКСЕЕВКА»', url: 'https://www.google.com/search?q=АН+Харків-Ріелтер+Алексеевка#lrd=0x4127a41b8c5ed819:0x6b2dee6f3b93e37f,1' },
    { name: 'ГАГАРИНА', subtitle: 'Філія «ГАГАРИНА»', url: 'https://www.google.com/search?q=АН+Харків-Ріелтер+Гагарина#lrd=0x4127a08797907619:0x5dfb221d2bc5d778,1' },
    { name: 'НОВЫЕ ДОМА', subtitle: 'Філія «НОВЫЕ ДОМА»', url: 'https://www.google.com/search?q=АН+Харків-Ріелтер+Новые+Дома#lrd=0x41270a4fb908a46d:0xadacdcb1f20dcf3b,1' },
    { name: 'ОДЕССКАЯ', subtitle: 'Філія «ОДЕССКАЯ»', url: 'https://www.google.com/search?q=АН+Харків-Ріелтер+Одесская#lrd=0x41270a9632008db3:0x44a76c12d3ce7f5e,1' },
    { name: 'ПАВЛОВО ПОЛЕ', subtitle: 'Філія «ПАВЛОВО ПОЛЕ»', url: 'https://www.google.com/search?q=АН+Харків-Ріелтер+Павлово+Поле#lrd=0x4127a6b576c30355:0x94796041da45487c,1' },
  ],
  [
    { name: 'САЛТОВКА-2', subtitle: 'Філія «САЛТОВКА-2»', url: 'https://www.google.com/search?q=АН+Харків-Ріелтер+Салтовка-2#lrd=0x412709f3ac950a27:0x9631459d2d056b8d,1' },
    { name: 'САЛТОВКА-3', subtitle: 'Філія «САЛТОВКА-3»', url: 'https://www.google.com/search?q=АН+Харків-Ріелтер+Салтовка-3#lrd=0x412709d8835a2725:0x58aee67da27117b6,1' },
    { name: 'САЛТОВКА-4', subtitle: 'Філія «САЛТОВКА-4»', url: 'https://www.google.com/search?q=АН+Харків-Ріелтер+Салтовка-4#lrd=0x412709872feacc21:0x4b60e810c9bccc8d,1' },
    { name: 'САЛТОВКА-5', subtitle: 'Філія «САЛТОВКА-5»', url: 'https://www.google.com/search?q=АН+Харків-Ріелтер+Салтовка-5#lrd=0x412709e08d68d3f7:0x53dee34e1ca75e2e,1' },
  ],
  [
    { name: 'ХОЛОДНАЯ ГОРА', subtitle: 'Філія «ХОЛОДНАЯ ГОРА»', url: 'https://www.google.com/search?q=АН+Харків-Ріелтер+Холодная+Гора#lrd=0x4127a1b6fbe26829:0x8e70d5c0fe3ae2e2,1' },
    { name: 'ХТЗ', subtitle: 'Філія «ХТЗ»', url: 'https://www.google.com/search?q=АН+Харків-Ріелтер+ХТЗ#lrd=0x41270b8516e70c1b:0x69aaf2d405f83757,1' },
  ],
  [
    { name: 'ЦЕНТР-1', subtitle: 'Філія «ЦЕНТР-1»', url: 'https://www.google.com/search?q=АН+Харків-Ріелтер+Центр-1#lrd=0x4127a0c2c79f564f:0x335f80521ccbe442,1' },
    { name: 'ЦЕНТР-2', subtitle: 'Філія «ЦЕНТР-2»', url: 'https://www.google.com/search?q=АН+Харків-Ріелтер+Центр-2#lrd=0x4127a0de66af253f:0xa9e390a3fab4e824,1' },
  ]
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { favorites } = useFavorites();
  const count = favorites.length;
  const reviewsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (reviewsRef.current && !reviewsRef.current.contains(e.target)) {
        setReviewsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => setOpen(false), [location]);

  return (
    <header className={cn(
      "fixed top-0 inset-x-0 z-50 transition-all duration-300",
      scrolled ? "bg-white/95 backdrop-blur-xl border-b border-black/5 shadow-sm" : "bg-white/85 backdrop-blur-xl border-b border-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <img
            src="/logo.png"
            alt="Харьков Риелтер"
            className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div>
            <p className="font-cormorant font-bold text-lg leading-none tracking-widest text-foreground">ХАРКІВ</p>
            <p className="text-[9px] tracking-[0.3em] text-gold uppercase">Ріелтер</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {links.map(l => {
            const isActive = l.activePaths ? l.activePaths.includes(location.pathname) : location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  'text-sm font-medium transition-colors duration-300',
                  isActive ? 'text-gold' : 'text-foreground/60 hover:text-foreground'
                )}
              >
                {l.label}
              </Link>
            )
          })}
          
          {/* Reviews Dropdown (Desktop) */}
          <div className="relative" ref={reviewsRef}>
            <button
              onClick={() => setReviewsOpen(!reviewsOpen)}
              className={cn(
                'flex items-center gap-1 text-sm font-medium transition-colors duration-300',
                reviewsOpen ? 'text-gold' : 'text-foreground/60 hover:text-foreground'
              )}
            >
              Відгуки
              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", reviewsOpen && "rotate-180")} />
            </button>

            {reviewsOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 min-w-[240px] bg-white rounded-2xl shadow-[0_12px_30px_rgba(15,23,42,0.16)] border border-border/50 py-2 animate-in fade-in slide-in-from-top-2 z-50">
                {REVIEW_GROUPS.map((group, idx) => (
                  <div key={idx}>
                    {group.map(link => (
                      <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col px-4 py-2 hover:bg-navy/5 transition-colors"
                        onClick={() => setReviewsOpen(false)}
                      >
                        <span className="font-semibold text-sm text-foreground">{link.name}</span>
                        <span className="text-[11px] text-muted-foreground">{link.subtitle}</span>
                      </a>
                    ))}
                    {idx < REVIEW_GROUPS.length - 1 && <div className="mx-4 my-2 border-t border-border/50 border-dashed" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Favorites heart — always visible */}
          <Link
            to="/favorites"
            className={cn(
              'relative w-10 h-10 sm:p-2 rounded-full flex items-center justify-center transition-colors',
              location.pathname === '/favorites' ? 'text-gold' : 'text-foreground/50 hover:text-gold'
            )}
          >
            <Heart className={cn('w-5 h-5', location.pathname === '/favorites' && 'fill-gold')} />
            {count > 0 && (
              <span className="absolute top-1 right-1 sm:top-0.5 sm:right-0.5 w-4 h-4 bg-gold text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                {count}
              </span>
            )}
          </Link>

          {/* Phone + CTA — desktop only */}
          <a href="tel:+380501234567" className="hidden xl:flex items-center gap-2 text-sm text-foreground/60 hover:text-gold transition-colors">
            <Phone className="w-4 h-4" />
            +380 (50) 123-45-67
          </a>
          <Link to="/kontakty" className="hidden lg:block px-6 py-2.5 gradient-gold rounded-full text-xs tracking-wide uppercase font-inter font-semibold hover:opacity-90 transition-opacity text-white">
            Консультація
          </Link>

          {/* Hamburger — mobile only, comfortable touch zone */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Меню"
            className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-foreground active:bg-black/5 transition-colors"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu — big touch-friendly items with icons */}
      {open && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-black/5 px-4 py-3 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="space-y-1">
            {links.map(l => {
              const isActive = l.activePaths ? l.activePaths.includes(location.pathname) : location.pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cn(
                    'flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-medium transition-colors',
                    isActive ? 'bg-gold/10 text-gold' : 'text-foreground/70 active:bg-black/5'
                  )}
                >
                  <l.icon className="w-5 h-5" />
                  {l.label}
                </Link>
              )
            })}
            <Link
              to="/favorites"
              className={cn(
                'flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-medium transition-colors',
                location.pathname === '/favorites' ? 'bg-gold/10 text-gold' : 'text-foreground/70 active:bg-black/5'
              )}
            >
              <Heart className={cn('w-5 h-5', location.pathname === '/favorites' && 'fill-gold')} />
              Обране {count > 0 && <span className="text-sm text-gold font-semibold">({count})</span>}
            </Link>

            {/* Mobile Reviews Accordion */}
            <div className="flex flex-col">
              <button
                onClick={() => setReviewsOpen(!reviewsOpen)}
                className={cn(
                  'flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-medium transition-colors w-full',
                  reviewsOpen ? 'bg-navy/5 text-navy' : 'text-foreground/70 active:bg-black/5'
                )}
              >
                <MessageSquare className="w-5 h-5" />
                Відгуки
                <ChevronDown className={cn("w-4 h-4 ml-auto transition-transform duration-200", reviewsOpen && "rotate-180")} />
              </button>
              
              {reviewsOpen && (
                <div className="px-4 py-2 mt-1 space-y-4 bg-muted/30 rounded-xl ml-4">
                  {REVIEW_GROUPS.map((group, idx) => (
                    <div key={idx} className="space-y-1">
                      {group.map(link => (
                        <a
                          key={link.name}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col py-2 px-3 hover:bg-navy/5 rounded-lg transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          <span className="font-semibold text-sm text-foreground">{link.name}</span>
                          <span className="text-[11px] text-muted-foreground">{link.subtitle}</span>
                        </a>
                      ))}
                      {idx < REVIEW_GROUPS.length - 1 && <div className="border-t border-border/50 border-dashed my-2 mx-3" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </nav>
          <a href="tel:+380501234567" className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-medium text-foreground/70 active:bg-black/5">
            <Phone className="w-5 h-5" />
            +380 (50) 123-45-67
          </a>
          <Link to="/kontakty" className="block mt-2 mb-2 px-5 py-4 gradient-gold rounded-2xl text-sm tracking-wide uppercase font-semibold text-center text-white">
            Консультація
          </Link>
        </div>
      )}
    </header>
  );
}
