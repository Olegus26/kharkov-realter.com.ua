import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Instagram, Facebook, Send as Telegram } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-4 mb-6 group">
              <img
                src="/logo.png"
                alt="Харьков Риелтер Корпорация"
                className="h-16 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <div>
                <p className="font-cormorant font-semibold text-xl leading-none tracking-widest text-foreground">ХАРКІВ</p>
                <p className="text-[9px] tracking-[0.3em] text-gold uppercase mt-1">РІЕЛТЕР</p>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Преміальна нерухомість у Харкові та Харківській області. Працюємо з 1996 року.
            </p>
            <div className="flex gap-3 mt-6">
              <a href="#" className="w-9 h-9 border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold transition-colors">
                <Telegram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-gold mb-5">Навігація</p>
            <ul className="space-y-3">
              {[['/', 'Головна'], ['/flats?deal=sale', 'Каталог'], ['/agents', 'Експерти'], ['/o-korporatcii', 'Про нас'], ['/kontakty', 'Контакти'], ['/vakansii', 'Вакансії']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-gold mb-5">Послуги</p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>Продаж нерухомості</li>
              <li>Оренда житла</li>
              <li>Оцінка об'єктів</li>
              <li>Юридичний супровід</li>
              <li>Інвестиції в нерухомість</li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-gold mb-5">Контакти</p>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                Харків, пр. Науки, 14
              </li>
              <li className="flex gap-3 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                +380 (50) 123-45-67
              </li>
              <li className="flex gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                info@kharkiv-realty.ua
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-muted-foreground text-center lg:text-right shrink-0">
            <p>© 2026 Харків Ріелтер. Всі права захищені.</p>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 lg:gap-4">
            {[
              { src: '/rieltor_logo.png', alt: 'РІЕЛТОР.ua Партнер', h: 'h-6' },
              { src: '/lun_logo_386.svg', alt: 'ЛУН Партнер', h: 'h-5' },
              { src: '/flatfy.svg', alt: 'Flatfy Партнер', h: 'h-5' },
              { src: '/olx_logo.svg', alt: 'OLX Партнер', h: 'h-5' },
              { src: '/dimria-partner.svg', alt: 'dim RIA Партнер', h: 'h-6' },
            ].map((logo, i) => (
              <div 
                key={i} 
                className="bg-navy rounded-xl px-5 py-3 flex items-center justify-center opacity-90 hover:opacity-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <img src={logo.src} alt={logo.alt} className={`${logo.h} w-auto object-contain`} />
              </div>
            ))}
          </div>

        </div>
      </div>
    </footer>
  )
}
export default Footer
