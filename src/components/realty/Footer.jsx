import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, Instagram, Facebook, Send as Telegram, MessageCircle, X } from 'lucide-react'
import { getPhonesForToday, getPhoneLink } from '@/lib/phones'
import { OFFICES, GENERAL_EMAIL, HOTLINE_PHONE } from '@/data/offices'
import AddressRevolver from './AddressRevolver'

const Footer = () => {
  const [activeOfficeIdx, setActiveOfficeIdx] = useState(0)
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false)
  const activeOffice = OFFICES[activeOfficeIdx] || OFFICES[0]
  const phones = activeOffice?.phones || getPhonesForToday()

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-4 mb-6 group">
              <img
                src="/logo.png"
                alt="Харків Ріелтер Корпорація"
                className="h-16 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <div>
                <p className="font-cormorant font-bold text-xl leading-none tracking-widest text-foreground">ХАРКІВ</p>
                <p className="text-[9px] tracking-[0.3em] text-gold uppercase mt-1 font-semibold">РІЕЛТЕР</p>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed font-inter">
              Нерухомість у Харкові та Харківській області. Надійно, перевірено та безпечно з 1996 року.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="https://www.instagram.com/kharkov_realter/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Харків Ріелтер"
                className="w-9 h-9 border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold transition-colors rounded-lg"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/people/%D0%90%D0%9D-%D0%A5%D0%B0%D1%80%D0%BA%D1%96%D0%B2-%D0%A0%D1%96%D0%B5%D0%BB%D1%82%D0%B5%D1%80/100057161062343/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Харків Ріелтер"
                className="w-9 h-9 border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold transition-colors rounded-lg"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://t.me/kharkov_realter"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram канал Харків Ріелтер"
                className="w-9 h-9 border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold transition-colors rounded-lg"
              >
                <Telegram className="w-4 h-4" />
              </a>
              <a
                href="viber://chat?number=%2B380507136363"
                aria-label="Viber чат Харків Ріелтер"
                className="w-9 h-9 border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold transition-colors rounded-lg"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-gold mb-5 font-inter font-semibold">Навігація</p>
            <ul className="space-y-3 font-inter">
              {[
                ['/', 'Головна'],
                ['/flats?deal=sale', 'Каталог нерухомості'],
                ['/agents', 'Експерти'],
                ['/o-korporatcii', 'Про нас'],
                ['/kontakty', 'Контакти'],
                ['/vakansii', 'Вакансії'],
                ['/utilities', 'Комунальні служби'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-gold mb-5 font-inter font-semibold">Послуги</p>
            <ul className="space-y-3 text-sm text-muted-foreground font-inter">
              <li>
                <Link to="/flats?deal=sale" className="hover:text-foreground transition-colors">Купівля та продаж квартир</Link>
              </li>
              <li>
                <Link to="/houses?deal=sale" className="hover:text-foreground transition-colors">Будинки та земельні ділянки</Link>
              </li>
              <li>
                <Link to="/realtys?deal=sale" className="hover:text-foreground transition-colors">Комерційна нерухомість</Link>
              </li>
              <li>
                <Link to="/flats?deal=rent" className="hover:text-foreground transition-colors">Оренда нерухомості</Link>
              </li>
              <li>Супровід програм єОселя та єВідновлення</li>
              <li>Експертна оцінка та юридичний супровід</li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-gold mb-5 font-inter font-semibold">Контакти</p>
            <ul className="space-y-4 font-inter">
              <li className="flex text-sm text-muted-foreground w-full">
                <AddressRevolver addresses={OFFICES} onChange={setActiveOfficeIdx} />
              </li>
              <li className="flex flex-col gap-2">
                {phones.map((p, idx) => (
                  <a
                    key={idx}
                    href={getPhoneLink(p)}
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-gold transition-colors font-semibold"
                  >
                    <Phone className="w-4 h-4 text-gold shrink-0" />
                    <span>{p}</span>
                  </a>
                ))}
              </li>
              <li className="text-xs text-muted-foreground">
                Гаряча лінія: <a href={getPhoneLink(HOTLINE_PHONE)} className="text-foreground hover:text-gold font-semibold">{HOTLINE_PHONE}</a>
              </li>
              <li className="flex gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <a href={`mailto:${GENERAL_EMAIL}`} className="hover:text-gold transition-colors">
                  {GENERAL_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-muted-foreground text-center lg:text-left shrink-0 font-inter">
            <p>© 1996–{new Date().getFullYear()} Корпорація «Харків Ріелтер». Всі права захищені.</p>
            <span className="hidden sm:inline opacity-40">•</span>
            <button
              type="button"
              onClick={() => setIsPrivacyOpen(true)}
              className="hover:text-foreground transition-colors underline underline-offset-4"
            >
              Політика конфіденційності
            </button>
          </div>

          {/* Partner logos */}
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
                className="bg-navy rounded-xl px-5 py-2.5 flex items-center justify-center opacity-90 hover:opacity-100 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              >
                <img src={logo.src} alt={logo.alt} className={`${logo.h} w-auto object-contain`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {isPrivacyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
            <button
              type="button"
              onClick={() => setIsPrivacyOpen(false)}
              aria-label="Закрити вікно"
              className="absolute top-5 right-5 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <p className="text-[10px] tracking-widest uppercase text-gold font-inter font-semibold mb-1">Юридична інформація</p>
              <h3 className="font-cormorant font-bold text-2xl sm:text-3xl text-foreground">Політика конфіденційності</h3>
            </div>

            <div className="overflow-y-auto space-y-4 text-xs sm:text-sm text-muted-foreground font-inter leading-relaxed pr-2 custom-scrollbar">
              <p>
                Ця Політика конфіденційності визначає порядок обробки та захисту персональних даних користувачів сайту Корпорації «Харків Ріелтер» відповідно до Закону України «Про захист персональних даних».
              </p>
              <h4 className="font-bold text-foreground text-sm">1. Збір та використання даних</h4>
              <p>
                Ми збираємо контактні дані (ім'я, номер телефону, коментарі), які користувач добровільно надає при заповненні форм зворотного зв'язку, запису на огляд об'єкта або відгуку на вакансію. Ці дані використовуються виключно для надання консультацій та організації перегляду нерухомості.
              </p>
              <h4 className="font-bold text-foreground text-sm">2. Захист та нерозголошення</h4>
              <p>
                Ми гарантуємо конфіденційність наданої інформації. Дані не передаються третім особам, крім випадків, прямо передбачених чинним законодавством України.
              </p>
              <h4 className="font-bold text-foreground text-sm">3. Ваші права</h4>
              <p>
                Користувач має право відкликати згоду на обробку персональних даних у будь-який момент, звернувшись на гарячу лінію або електронну пошту info@kharkov-realter.com.ua.
              </p>
            </div>

            <div className="pt-6 border-t border-border mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setIsPrivacyOpen(false)}
                className="px-6 py-2.5 bg-navy text-white text-xs font-inter font-semibold rounded-full hover:bg-navy/90 transition-colors"
              >
                Зрозуміло
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  )
}

export default Footer
