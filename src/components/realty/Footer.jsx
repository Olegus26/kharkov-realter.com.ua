import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, Send as Telegram, Bot, X, ArrowRight } from 'lucide-react'
import { OFFICES, MAIN_PHONE, GENERAL_EMAIL } from '@/data/offices'
import { getPhoneLink } from '@/lib/phones'

const ROTATION_INTERVAL_MS = 6000

const Footer = () => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false)
  const [activeOfficeIndex, setActiveOfficeIndex] = useState(0)
  const [isContactsPaused, setIsContactsPaused] = useState(false)

  useEffect(() => {
    if (isContactsPaused || OFFICES.length <= 1) return
    const timer = setInterval(() => {
      setActiveOfficeIndex((prev) => (prev + 1) % OFFICES.length)
    }, ROTATION_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [isContactsPaused])

  const currentOffice = OFFICES[activeOfficeIndex] || OFFICES[0]
  const officePhones =
    currentOffice.phones.length >= 2
      ? currentOffice.phones.slice(0, 2)
      : [currentOffice.phones[0], MAIN_PHONE].filter(Boolean)

  const handleContactsMouseEnter = () => {
    setIsContactsPaused(true)
  }

  const handleContactsMouseLeave = () => {
    setIsContactsPaused(false)
  }

  const handleContactsFocus = () => {
    setIsContactsPaused(true)
  }

  const handleContactsBlur = () => {
    setIsContactsPaused(false)
  }

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-4 mb-6 group">
              <img
                src="/images/brand/logo.png"
                alt=""
                width={160}
                height={160}
                className="h-16 w-16 object-contain transition-transform duration-500 group-hover:scale-105"
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
                className="w-9 h-9 border border-pink-200/80 bg-pink-50/70 text-[#E1306C] hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white hover:border-transparent flex items-center justify-center transition-all rounded-lg"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/people/%D0%90%D0%9D-%D0%A5%D0%B0%D1%80%D0%BA%D1%96%D0%B2-%D0%A0%D1%96%D0%B5%D0%BB%D1%82%D0%B5%D1%80/100057161062343/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Харків Ріелтер"
                className="w-9 h-9 border border-blue-200/80 bg-blue-50/70 text-[#1877F2] hover:bg-[#1877F2] hover:text-white hover:border-transparent flex items-center justify-center transition-all rounded-lg"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://t.me/kharkov_realter"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram канал Харків Ріелтер"
                className="w-9 h-9 border border-sky-200/80 bg-sky-50/70 text-[#0088cc] hover:bg-[#0088cc] hover:text-white hover:border-transparent flex items-center justify-center transition-all rounded-lg"
              >
                <Telegram className="w-4 h-4" />
              </a>
              <a
                href="https://t.me/kharkovrealter_bot"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram бот Харків Ріелтер"
                className="w-9 h-9 border border-amber-200/80 bg-amber-50/70 text-amber-600 hover:bg-amber-500 hover:text-white hover:border-transparent flex items-center justify-center transition-all rounded-lg"
              >
                <Bot className="w-4 h-4" />
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
                ['/flats?deal=rent', 'Оренда квартир'],
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
              <li>
                <Link to="/evidnovlennya" className="hover:text-foreground transition-colors">Житловий сертифікат єВідновлення</Link>
              </li>
              <li>
                <Link to="/eoselia" className="hover:text-foreground transition-colors">Державна іпотека єОселя</Link>
              </li>
              <li>Експертна оцінка та юридичний супровід</li>
            </ul>
          </div>

          {/* Contacts */}
          <div
            onMouseEnter={handleContactsMouseEnter}
            onMouseLeave={handleContactsMouseLeave}
            onFocus={handleContactsFocus}
            onBlur={handleContactsBlur}
          >
            <p className="text-xs tracking-[0.2em] uppercase text-gold mb-5 font-inter font-semibold">Контакти</p>
            <div className="space-y-3 text-sm text-muted-foreground font-inter">
              <div className="min-h-[104px]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.ul
                    key={currentOffice.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-2.5"
                  >
                    <li className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                      <div className="min-w-0 leading-snug">
                        <p className="font-semibold text-foreground truncate">{currentOffice.name}</p>
                        <p className="text-[13px] text-muted-foreground truncate" title={currentOffice.shortAddress}>
                          {currentOffice.shortAddress}
                        </p>
                      </div>
                    </li>
                    {officePhones.map((phone, idx) => (
                      <li key={`${currentOffice.id}-${idx}`}>
                        <a
                          href={getPhoneLink(phone)}
                          tabIndex={0}
                          aria-label={`Зателефонувати у філію ${currentOffice.name} за номером ${phone}`}
                          className="inline-flex items-center gap-2.5 text-foreground font-semibold hover:text-gold transition-colors"
                        >
                          <Phone className="w-4 h-4 text-gold shrink-0" />
                          <span>{phone}</span>
                        </a>
                      </li>
                    ))}
                  </motion.ul>
                </AnimatePresence>
              </div>

              <ul className="space-y-3 pt-0.5">
                <li>
                  <a
                    href={`mailto:${GENERAL_EMAIL}`}
                    tabIndex={0}
                    aria-label={`Написати на email ${GENERAL_EMAIL}`}
                    className="inline-flex items-center gap-2.5 hover:text-foreground transition-colors"
                  >
                    <Mail className="w-4 h-4 text-gold shrink-0" />
                    <span>{GENERAL_EMAIL}</span>
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-gold shrink-0" />
                  <span>Пн–Пт: 10:00 – 18:00</span>
                </li>
                <li className="pt-1">
                  <Link
                    to="/kontakty"
                    tabIndex={0}
                    aria-label="Переглянути всі 13 відділень та телефони"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-gold hover:text-foreground transition-colors group"
                  >
                    <span>Всі 13 відділень та телефони</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              </ul>
            </div>
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
              { src: '/images/partners/rieltor.svg', alt: 'РІЕЛТОР.ua Партнер', h: 'h-6', width: 80, height: 24 },
              { src: '/images/partners/lun.svg', alt: 'ЛУН Партнер', h: 'h-5', width: 51, height: 20 },
              { src: '/images/partners/flatfy.svg', alt: 'Flatfy Партнер', h: 'h-5', width: 49, height: 20 },
              { src: '/images/partners/olx.svg', alt: 'OLX Партнер', h: 'h-5', width: 35, height: 20 },
              { src: '/images/partners/dimria.svg', alt: 'dim RIA Партнер', h: 'h-6', width: 79, height: 24 },
            ].map((logo, i) => (
              <div
                key={i}
                className="bg-navy rounded-xl px-5 py-2.5 flex items-center justify-center opacity-90 hover:opacity-100 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              >
                <img src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} className={`${logo.h} w-auto object-contain`} />
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
                Користувач має право відкликати згоду на обробку персональних даних у будь-який момент, звернувшись за телефоном або електронною поштою info@kharkov-realter.com.ua.
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
