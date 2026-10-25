import { Send, RotateCcw, Sparkles } from 'lucide-react'

const BOT_URL = 'https://t.me/kharkovrealter_bot'

const MascotTelegramEmptyState = ({ deal = 'sale', onClearFilters }) => {
  const handleClear = (e) => {
    e.preventDefault()
    if (!onClearFilters) return
    onClearFilters()
  }

  const handleKeyDownClear = (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return
    e.preventDefault()
    handleClear(e)
  }

  const headingText = deal === 'rent'
    ? 'Поки що немає оренди з такими фільтрами'
    : 'За вибраними фільтрами зараз немає об\'єктів'

  return (
    <div
      tabIndex={0}
      aria-label="Підказка від бота-помічника Харків Ріелтер"
      className="max-w-xl mx-auto my-12 p-8 sm:p-10 bg-gradient-to-b from-card via-card to-muted/30 border border-amber-500/25 rounded-3xl text-center shadow-xl relative overflow-hidden"
    >
      {/* Ambient background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

      {/* Mascot illustration */}
      <div className="relative z-10 flex items-center justify-center mb-5">
        <div className="relative w-48 sm:w-56 max-w-[240px] flex items-center justify-center">
          <div className="absolute inset-0 bg-amber-400/25 rounded-full blur-2xl scale-75 pointer-events-none" />
          <img
            src="/mascot-search.webp"
            alt="Маскот Харків Ріелтер шукає квартиру з лупою"
            loading="lazy"
            decoding="async"
            className="w-full h-auto object-contain relative z-10 drop-shadow-[0_16px_32px_rgba(0,0,0,0.25)] hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Mascot Speech bubble badge */}
      <div className="relative z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-600 dark:text-amber-400 text-xs font-inter font-semibold mb-4">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Підбір від «Харків Ріелтер»</span>
      </div>

      {/* Main text */}
      <h3 className="relative z-10 font-cormorant font-bold text-3xl sm:text-4xl text-foreground mb-3 leading-tight">
        {headingText}
      </h3>

      <p className="relative z-10 text-sm sm:text-base text-muted-foreground font-inter max-w-md mx-auto leading-relaxed mb-8">
        Але наша база оновлюється щодня! Підключіть Telegram-бот — він збереже ваш запит і повідомить, щойно нова квартира з'явиться у 13 філіях Харкова.
      </p>

      {/* Action Buttons */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href={BOT_URL}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={0}
          aria-label="Зберегти параметри пошуку в Telegram-боті Харків Ріелтер"
          className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-inter font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 hover:shadow-amber-400/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Send className="w-4 h-4 fill-slate-950 text-slate-950 shrink-0" />
          <span>Зберегти пошук у Telegram</span>
        </a>

        {onClearFilters && (
          <button
            type="button"
            tabIndex={0}
            onClick={handleClear}
            onKeyDown={handleKeyDownClear}
            aria-label="Скинути всі вибрані фільтри та показати всі об'єкти"
            className="w-full sm:w-auto px-5 py-3.5 bg-card hover:bg-muted text-muted-foreground hover:text-foreground font-inter font-medium text-sm rounded-xl border border-border flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Скинути фільтри</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default MascotTelegramEmptyState
