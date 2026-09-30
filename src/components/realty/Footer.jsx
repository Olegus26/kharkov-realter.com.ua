import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Instagram, Facebook, Send as Telegram } from 'lucide-react'
import { getPhonesForToday, getPhoneLink } from '@/lib/phones'
import { cn } from '@/lib/utils'
import AddressRevolver from './AddressRevolver'

const OFFICES = [
  { title: 'Центр-1', addr: 'вулиця Григорія Сковороди, 65, 2-й поверх, офіс № 3', phones: ['+380 (67) 714-36-52', '+380 (66) 909-51-04'] },
  { title: 'Центр-2', addr: 'вулиця Сумська, 80', phones: ['+380 (95) 737-22-61', '+380 (93) 396-35-10'] },
  { title: 'Левада', addr: 'Аерокосмічний проспект, 48', phones: ['+380 (67) 803-52-48', '+380 (50) 505-91-78'] },
  { title: 'Нові Будинки', addr: 'проспект Петра Григоренка, 7', phones: ['+380 (98) 284-33-43', '+380 (95) 775-08-88'] },
  { title: 'Одеська', addr: 'Аерокосмічний проспект, 176', phones: ['+380 (50) 135-18-16'] },
  { title: 'Олексіївка', addr: 'проспект Людвіга Свободи, 39', phones: ['+380 (99) 924-90-31', '+380 (96) 076-02-99'] },
  { title: 'Павлове Поле', addr: 'вулиця 23-го Серпня, 38', phones: ['+380 (50) 949-14-87', '+380 (97) 520-87-50'] },
  { title: 'Салтівка-2', addr: 'проспект Тракторобудівників, 108', phones: ['+380 (73) 056-16-70', '+380 (67) 575-51-09'] },
  { title: 'Салтівка-3', addr: 'вул. Нескорених, 30', phones: ['+380 (99) 049-83-91', '+380 (96) 201-02-20'] },
  { title: 'Салтівка-4', addr: 'вулиця Амосова, 25', phones: ['+380 (95) 737-22-61', '+380 (93) 396-35-10'] },
  { title: 'Салтівка-5', addr: 'вул. Нескорених, 30', phones: ['+380 (97) 943-07-93', '+380 (97) 016-15-07', '+380 (95) 816-21-63'] },
  { title: 'Холодна Гора', addr: 'вулиця Холодногірська, 3', phones: ['+380 (99) 933-89-02'] },
  { title: 'ХТЗ', addr: 'проспект Олександрівський, 154', phones: ['+380 (99) 484-46-69', '+380 (67) 113-11-95'] }
];

const Footer = () => {
  const [activeOfficeIdx, setActiveOfficeIdx] = useState(0);
  const phones = OFFICES[activeOfficeIdx]?.phones || getPhonesForToday();
  
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
              <a href="https://www.instagram.com/kharkov_realter/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.facebook.com/people/%D0%90%D0%9D-%D0%A5%D0%B0%D1%80%D0%BA%D1%96%D0%B2-%D0%A0%D1%96%D0%B5%D0%BB%D1%82%D0%B5%D1%80/100057161062343/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://www.tiktok.com/@kharkiv.realter" target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a href="https://t.me/kharkov_realter" target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold transition-colors">
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
              <li className="flex text-sm text-muted-foreground w-full">
                <AddressRevolver addresses={OFFICES} onChange={setActiveOfficeIdx} />
              </li>
              <li className="flex flex-col gap-2">
                {phones.map((p, idx) => (
                  <a key={idx} href={getPhoneLink(p)} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-gold transition-colors">
                    <Phone className={cn("w-4 h-4 text-gold shrink-0", idx > 0 && "opacity-0")} />
                    <motion.span key={p + activeOfficeIdx} className="flex">
                      {p.split('').map((char, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.2 + i * 0.03, duration: 0.1 }}
                        >
                          {char === ' ' ? '\u00A0' : char}
                        </motion.span>
                      ))}
                    </motion.span>
                  </a>
                ))}
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
