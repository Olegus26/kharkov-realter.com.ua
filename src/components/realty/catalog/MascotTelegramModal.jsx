import { useState, useEffect } from 'react'
import { Send, X, Sparkles } from 'lucide-react'

const BOT_URL = 'https://t.me/kharkovrealter_bot'
const SESSION_KEY = 'kh_catalog_tg_modal_dismissed'

const MascotTelegramModal = ({ deal = 'sale' }) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const isDismissed = sessionStorage.getItem(SESSION_KEY) === 'true'
    if (isDismissed) return

    let timer = null

    const handleScrollTrigger = () => {
      if (window.scrollY > 800) {
        setIsOpen(true)
        window.removeEventListener('scroll', handleScrollTrigger)
      }
    }

    // Trigger after 25s idle/browsing OR on deep scroll
    timer = setTimeout(() => {
      setIsOpen(true)
      window.removeEventListener('scroll', handleScrollTrigger)
    }, 25000)

    window.addEventListener('scroll', handleScrollTrigger, { passive: true })

    return () => {
      if (timer) clearTimeout(timer)
      window.removeEventListener('scroll', handleScrollTrigger)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(SESSION_KEY, 'true')
    }
  }

  const handleKeyDownBackdrop = (e) => {
    if (e.key !== 'Escape') return
    handleClose()
  }

  if (!isOpen) return null

  const titleText = deal === 'rent'
    ? 'Шукаєте оренду під конкретний бюджет?'
    : 'Шукаєте житло за власними параметрами?'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Підбір нерухомості через Telegram-бот Харків Ріелтер"
      onKeyDown={handleKeyDownBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-[#0c1322] border-2 border-amber-400/80 rounded-3xl p-6 sm:p-8 text-center shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          type="button"
          tabIndex={0}
          onClick={handleClose}
          aria-label="Закрити вікно"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Mascot illustration (detective with magnifying glass and Kharkiv map) */}
        <div className="relative flex items-center justify-center -mt-2 mb-3">
          <div className="relative w-44 sm:w-48 max-w-[200px] flex items-center justify-center">
            <div className="absolute inset-0 bg-amber-400/25 rounded-full blur-2xl scale-75 pointer-events-none" />
            <img
              src="/mascot-search.webp"
              alt="Маскот Харків Ріелтер шукає квартиру з лупою"
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-contain relative z-10 drop-shadow-[0_12px_24px_rgba(0,0,0,0.25)]"
            />
          </div>
        </div>

        {/* Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-200 text-xs font-inter font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Швидкий підбір від «Харків Ріелтер»</span>
        </div>

        {/* Title */}
        <h3 className="font-cormorant font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white mb-2.5 leading-snug">
          {titleText}
        </h3>

        {/* Subtitle - high contrast, readable */}
        <p className="font-inter text-sm sm:text-[15px] text-slate-700 dark:text-slate-200 leading-relaxed max-w-sm mx-auto mb-6 font-normal">
          Наш офіційний бот підключений до бази 13 філій Харкова. Вкажіть бажаний район та ціну — свіжі перевірені об'єкти надходитимуть прямо у ваш Telegram.
        </p>

        {/* CTA Button */}
        <div className="flex flex-col gap-2.5">
          <a
            href={BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={0}
            onClick={handleClose}
            aria-label="Підібрати варіанти нерухомості в Telegram-боті Харків Ріелтер"
            className="w-full py-3.5 px-6 bg-slate-950 hover:bg-slate-800 text-amber-300 dark:bg-amber-400 dark:hover:bg-amber-300 dark:text-slate-950 font-inter font-bold text-sm sm:text-base rounded-xl flex items-center justify-center gap-2.5 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <Send className="w-4 h-4 shrink-0 text-amber-400 dark:text-slate-950 fill-current" />
            <span>Підібрати варіанти в Telegram</span>
          </a>

          <button
            type="button"
            tabIndex={0}
            onClick={handleClose}
            aria-label="Переглянути каталог самостійно"
            className="text-xs sm:text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white py-1.5 font-inter font-medium transition-colors underline-offset-4 hover:underline"
          >
            Переглянути каталог самостійно
          </button>
        </div>
      </div>
    </div>
  )
}

export default MascotTelegramModal
