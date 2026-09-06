import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';

const links = [
  { to: '/', label: 'Головна' },
  { to: '/flats?deal=sale', label: 'Каталог', activePaths: ['/flats', '/houses', '/realtys'] },
  { to: '/agents', label: 'Експерти' },
  { to: '/o-korporatcii', label: 'Про нас' },
  { to: '/kontakty', label: 'Контакти' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setOpen(false), [location]);

  return (
    <header className={cn(
      'fixed top-0 inset-x-0 z-50 transition-all duration-500',
      scrolled ? 'bg-background/95 backdrop-blur-md border-b border-border' : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-4 group">
          <img
            src="/logo.png"
            alt="Харьков Риелтер Корпорация"
            className="h-16 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
          />
          <div>
            <p className="font-cormorant font-semibold text-2xl leading-none tracking-widest text-foreground">ХАРКІВ</p>
            <p className="text-[10px] tracking-[0.3em] text-gold uppercase mt-1">РІЕЛТЕР</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                'text-sm tracking-widest uppercase transition-colors duration-300',
                (l.activePaths ? l.activePaths.includes(location.pathname) : location.pathname === l.to) ? 'text-gold' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-muted-foreground hover:text-gold transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <a href="tel:+380501234567" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors">
            <Phone className="w-4 h-4" />
            +380 (50) 123-45-67
          </a>
          <Link to="/kontakty" className="px-5 py-2.5 gradient-gold text-background text-xs tracking-widest uppercase font-inter font-medium hover:opacity-90 transition-opacity">
            Консультація
          </Link>
        </div>

        {/* Mobile burger */}
        <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-foreground">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-card border-t border-border px-6 py-6 space-y-4">
          {links.map(l => (
            <Link key={l.to} to={l.to} className={cn(
              'block text-sm tracking-widest uppercase py-2 transition-colors',
              (l.activePaths ? l.activePaths.includes(location.pathname) : location.pathname === l.to) ? 'text-gold' : 'text-muted-foreground'
            )}>
              {l.label}
            </Link>
          ))}
          <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
            <span className="text-sm tracking-widest uppercase text-muted-foreground">Тема</span>
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-muted-foreground hover:text-gold transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          <Link to="/kontakty" className="block mt-4 px-5 py-3 gradient-gold text-background text-xs tracking-widest uppercase font-medium text-center">
            Консультація
          </Link>
        </div>
      )}
    </header>
  );
}