import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Hash,
  MapPin,
  Navigation,
  Phone,
  Search,
  TrainFront,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const MobileSearchModal = ({
  isOpen,
  onClose,
  query,
  onQueryChange,
  onClearQuery,
  deal,
  onDealChange,
  searchIntent,
  suggestions,
  onSelectSuggestion,
  onSubmit,
}) => {
  const inputRef = useRef(null)

  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return
    document.body.style.overflow = 'hidden'
    inputRef.current?.focus()

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || typeof document === 'undefined') return null

  const handleSetSale = () => {
    onDealChange('sale')
  }

  const handleSetRent = () => {
    onDealChange('rent')
  }

  const handleClearAndFocus = () => {
    onClearQuery()
    inputRef.current?.focus()
  }

  const trimmedQuery = query.trim()

  const suggestionGroups = []
  if (suggestions.metro?.length > 0) {
    suggestionGroups.push({
      id: 'metro',
      title: 'Метро',
      icon: TrainFront,
      iconColor: 'text-blue-600',
      dotColor: 'bg-blue-500',
      items: suggestions.metro,
      type: 'metro',
      prefix: 'м. ',
    })
  }
  if (suggestions.districts?.length > 0) {
    suggestionGroups.push({
      id: 'districts',
      title: 'Райони',
      icon: MapPin,
      iconColor: 'text-amber-600',
      dotColor: 'bg-amber-500',
      items: suggestions.districts,
      type: 'district',
      prefix: 'р-н ',
    })
  }
  if (suggestions.complexes?.length > 0) {
    suggestionGroups.push({
      id: 'complexes',
      title: 'ЖК',
      icon: Building2,
      iconColor: 'text-purple-600',
      dotColor: 'bg-purple-500',
      items: suggestions.complexes,
      type: 'complex',
      prefix: '',
    })
  }
  if (suggestions.streets?.length > 0) {
    suggestionGroups.push({
      id: 'streets',
      title: 'Вулиці',
      icon: Navigation,
      iconColor: 'text-emerald-600',
      dotColor: 'bg-emerald-500',
      items: suggestions.streets,
      type: 'street',
      prefix: '',
    })
  }

  return createPortal(
    <div
      id="mobile-search-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Пошук нерухомості"
      className="fixed inset-0 z-[110] bg-white flex flex-col font-inter text-foreground"
    >
      {/* Pinned Top Search Bar + Deal Toggle */}
      <div className="shrink-0 bg-white border-b border-border px-3 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-3 space-y-2.5 shadow-sm">
        <form onSubmit={onSubmit} className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            tabIndex={0}
            aria-label="Закрити пошук"
            className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 text-foreground flex items-center justify-center shrink-0 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </button>

          <div className="flex-1 min-w-0 flex items-center bg-muted rounded-full px-3.5 h-11 border border-border/70 focus-within:border-navy focus-within:bg-white transition-colors">
            <Search className="w-4 h-4 text-muted-foreground shrink-0 mr-2" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              enterKeyHint="search"
              value={query}
              onChange={onQueryChange}
              placeholder="Район, метро, ЖК, #ID або тел."
              autoComplete="off"
              spellCheck="false"
              aria-label="Пошук за районом, метро, вулицею, ЖК, кодом об'єкта або номером агента"
              aria-controls="mobile-search-suggestions"
              className="w-full min-w-0 bg-transparent text-base text-foreground placeholder:text-muted-foreground outline-none font-inter"
            />
            {query && (
              <button
                type="button"
                onClick={handleClearAndFocus}
                tabIndex={0}
                aria-label="Очистити поле пошуку"
                className="w-7 h-7 rounded-full bg-black/10 hover:bg-black/15 text-foreground flex items-center justify-center shrink-0 ml-1 transition-colors"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>

          <button
            type="submit"
            tabIndex={0}
            className="px-4 h-11 rounded-full bg-navy hover:bg-navy/90 text-white text-xs font-bold uppercase tracking-wider shrink-0 transition-colors shadow-sm"
          >
            Знайти
          </button>
        </form>

        <div className="grid grid-cols-2 p-1 bg-muted rounded-full">
          <button
            type="button"
            onClick={handleSetSale}
            aria-pressed={deal === 'sale'}
            tabIndex={0}
            className={cn(
              'py-1.5 rounded-full text-xs tracking-widest uppercase font-semibold transition-all text-center',
              deal === 'sale' ? 'bg-white text-navy shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Купити
          </button>
          <button
            type="button"
            onClick={handleSetRent}
            aria-pressed={deal === 'rent'}
            tabIndex={0}
            className={cn(
              'py-1.5 rounded-full text-xs tracking-widest uppercase font-semibold transition-all text-center',
              deal === 'rent' ? 'bg-white text-navy shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Орендувати
          </button>
        </div>
      </div>

      {/* Scrollable Results List - Always visible above soft keyboard */}
      <div
        id="mobile-search-suggestions"
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))] bg-white"
      >
        {searchIntent.type === 'tag' || searchIntent.type === 'phone' ? (
          <div className="py-1">
            <button
              type="button"
              onClick={() =>
                onSelectSuggestion(
                  'query',
                  searchIntent.type === 'tag' ? `#${searchIntent.value}` : searchIntent.value
                )
              }
              tabIndex={0}
              className="w-full text-left px-4 py-3.5 rounded-2xl bg-navy/5 active:bg-navy active:text-white text-foreground transition-colors flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center shrink-0">
                  {searchIntent.type === 'tag' ? (
                    <Hash className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Phone className="w-4 h-4" aria-hidden="true" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">
                    {searchIntent.type === 'tag'
                      ? `Знайти об'єкт #${searchIntent.value}`
                      : `Всі об'єкти агента ${trimmedQuery}`}
                  </p>
                  <p className="text-xs text-muted-foreground group-active:text-white/80 truncate">
                    {searchIntent.type === 'tag'
                      ? "Пошук по всій базі за кодом об'єкта"
                      : 'Показати оголошення за номером телефону'}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
            </button>
          </div>
        ) : suggestions.hasResults ? (
          <div className="space-y-4">
            {suggestionGroups.map((group) => {
              const IconComp = group.icon
              return (
                <div key={group.id} className="space-y-1">
                  <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <IconComp className={cn('w-3.5 h-3.5 shrink-0', group.iconColor)} aria-hidden="true" />
                    <span>{group.title}</span>
                  </div>
                  <div className="space-y-0.5">
                    {group.items.map((item) => (
                      <button
                        key={`${group.id}-${item.value}`}
                        type="button"
                        onClick={() => onSelectSuggestion(group.type, item.value)}
                        tabIndex={0}
                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-muted/70 active:bg-muted transition-colors flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={cn('w-2 h-2 rounded-full shrink-0', group.dotColor)} />
                          <span className="text-sm font-semibold text-foreground truncate">
                            {group.prefix}
                            {item.label}
                          </span>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="py-6 px-3 text-center">
            <p className="text-sm text-foreground font-medium mb-1">
              Не знайдено точних назв серед метро, районів, вулиць чи ЖК
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Ви можете знайти «{trimmedQuery}» по всій базі описів та оголошень
            </p>
            <button
              type="button"
              onClick={() => onSelectSuggestion('query', trimmedQuery)}
              tabIndex={0}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy text-white text-xs font-semibold rounded-full hover:bg-navy/90 transition-colors shadow-sm"
            >
              <Search className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Шукати «{trimmedQuery}» у каталозі</span>
            </button>
          </div>
        )}

        {trimmedQuery.length > 0 && searchIntent.type === 'text' && suggestions.hasResults && (
          <div className="pt-3 mt-3 border-t border-border/60">
            <button
              type="button"
              onClick={() => onSelectSuggestion('query', trimmedQuery)}
              tabIndex={0}
              className="w-full text-left px-3.5 py-3 rounded-xl bg-muted/70 active:bg-navy active:text-white transition-colors flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Search className="w-4 h-4 text-gold shrink-0" aria-hidden="true" />
                <span className="text-xs font-semibold truncate">
                  Шукати всі об'єкти за запитом: «{trimmedQuery}»
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

export default MobileSearchModal
