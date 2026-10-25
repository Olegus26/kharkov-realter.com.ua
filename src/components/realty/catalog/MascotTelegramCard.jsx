import { Send, X, Sparkles, CheckCircle2 } from 'lucide-react'

const BOT_URL = 'https://t.me/kharkovrealter_bot'

const MascotTelegramCard = ({ deal = 'sale', variant = 'keys', onDismiss }) => {
  const handleDismiss = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!onDismiss) return
    onDismiss()
  }

  const handleKeyDownDismiss = (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return
    e.preventDefault()
    handleDismiss(e)
  }

  const isSearchVariant = variant === 'search'

  const titleText = isSearchVariant
    ? (deal === 'rent' ? 'Потрібна перевірена оренда?' : 'Індивідуальний підбір житла')
    : (deal === 'rent' ? 'Свіжа оренда від 13 філій' : 'Нові квартири з’являються щодня')

  const descriptionText = isSearchVariant
    ? 'Бот відстежує нові надходження по Харкову та сповістить вас, щойно з\'явиться відповідний об\'єкт'
    : 'Підпишіться на свої фільтри — бот надішле нові варіанти раніше, ніж вони потраплять на інші дошки'

  const badgeTag = isSearchVariant ? 'Пошук по базі' : 'Офіційний бот'
  const mascotSrc = isSearchVariant ? '/mascot-search.webp' : '/mascot-squirrel.webp'
  const mascotAlt = isSearchVariant
    ? 'Маскот Харків Ріелтер шукає квартиру з лупою'
    : 'Маскот Харків Ріелтер з ключами від квартири'

  return (
    <div
      tabIndex={0}
      aria-label="Підключення офіційного Telegram-бота Харків Ріелтер"
      className="group relative bg-[#0d1627] border border-amber-400/40 rounded-2xl overflow-hidden flex flex-col justify-between h-full p-5 sm:p-6 shadow-2xl hover:border-amber-400/70 transition-all duration-300"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Telegram watermark */}
      <Send
        aria-hidden="true"
        className="absolute -bottom-8 -right-8 w-44 h-44 text-white/[0.04] -rotate-12 pointer-events-none"
      />

      {/* Header bar with tag and dismiss button */}
      <div className="flex items-center justify-between gap-3 relative z-10 mb-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[11px] font-inter font-bold tracking-wide">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>{badgeTag}</span>
        </div>

        {onDismiss && (
          <button
            type="button"
            tabIndex={0}
            onClick={handleDismiss}
            onKeyDown={handleKeyDownDismiss}
            aria-label="Закрити оголошення про Telegram-бот"
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/20"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Mascot illustration */}
      <div className="relative z-10 flex items-center justify-center my-2">
        <div className="relative w-44 sm:w-48 max-w-[200px] flex items-center justify-center">
          <div className="absolute inset-0 bg-amber-400/25 rounded-full blur-2xl scale-75 pointer-events-none" />
          <img
            src={mascotSrc}
            alt={mascotAlt}
            loading="lazy"
            decoding="async"
            className="w-full h-auto object-contain relative z-10 drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)] group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-300"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center mt-2 flex flex-col items-center">
        <h3 className="font-cormorant font-bold text-2xl sm:text-[26px] text-white leading-tight mb-2 drop-shadow-sm">
          {titleText}
        </h3>
        <p className="font-inter text-xs sm:text-[13px] text-slate-200 leading-relaxed max-w-[280px] font-normal">
          {descriptionText}
        </p>

        {/* Benefits list */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-[11px] font-inter text-slate-100 font-medium">
          <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-md border border-white/15">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            База 13 філій
          </span>
          <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-md border border-white/15">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Миттєво
          </span>
          <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-md border border-white/15">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Без спаму
          </span>
        </div>
      </div>

      {/* CTA Button */}
      <div className="relative z-10 pt-4 mt-2">
        <a
          href={BOT_URL}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={0}
          aria-label="Підключити сповіщення від бота Харків Ріелтер"
          className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-inter font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-400/25 hover:shadow-amber-400/40 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Send className="w-4 h-4 fill-slate-950 text-slate-950 shrink-0" />
          <span>Підключити сповіщення</span>
        </a>
      </div>
    </div>
  )
}

export default MascotTelegramCard
