import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Hammer, Home as HomeIcon, Search, X } from 'lucide-react'
import { Autocomplete } from '@/components/ui/autocomplete'
import { METRO_LINES, DISTRICTS } from '@/data/geoFilters'
import { SUBTYPES_BY_CATEGORY, STATES } from '@/pages/realty/catalogConfig'
import { cn } from '@/lib/utils'

const MobileFilterSheet = ({
  isOpen,
  onClose,
  deal,
  category,
  filteredCount,
  activeFiltersCount,
  hasFilters,
  onClearFilters,
  onEnsureGeoData,
  searchQuery,
  onSearchQueryChange,
  searchComplex,
  complexOptions,
  onComplexSelect,
  onComplexInputChange,
  searchStreet,
  streetOptions,
  onStreetChange,
  onStreetInputChange,
  searchHouse,
  houseOptions,
  onHouseChange,
  onHouseInputChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  minArea,
  maxArea,
  onMinAreaChange,
  onMaxAreaChange,
  subTypes,
  onSubTypesChange,
  filterErecovery,
  onToggleErecovery,
  filterEoselia,
  onToggleEoselia,
  metroStations,
  onMetroStationsChange,
  districts,
  onDistrictsChange,
  minFloor,
  maxFloor,
  onMinFloorChange,
  onMaxFloorChange,
  minFloorsTotal,
  maxFloorsTotal,
  onMinFloorsTotalChange,
  onMaxFloorsTotalChange,
  states,
  onStatesChange,
}) => {
  const [isMetroOpen, setIsMetroOpen] = useState(false)
  const [isDistrictsOpen, setIsDistrictsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    onEnsureGeoData()

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, onEnsureGeoData])

  if (!isOpen || typeof document === 'undefined') return null

  const toggleSelection = (list, setList, value) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value))
      return
    }
    setList([...list, value])
  }

  const handleToggleMetroSection = () => {
    setIsMetroOpen((prev) => !prev)
  }

  const handleToggleDistrictsSection = () => {
    setIsDistrictsOpen((prev) => !prev)
  }

  const subtypeOptions = category ? SUBTYPES_BY_CATEGORY[category] || [] : []

  return createPortal(
    <div
      id="mobile-filter-sheet"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-filters-title"
      className="fixed inset-0 z-[100] bg-white flex flex-col font-inter text-foreground"
    >
      {/* Pinned Top Header */}
      <div className="shrink-0 flex items-center justify-between gap-3 px-4 pt-[calc(0.875rem+env(safe-area-inset-top))] pb-3.5 bg-white border-b border-border shadow-sm">
        <div className="flex items-center gap-2 min-w-0">
          <h2 id="mobile-filters-title" className="text-base font-bold text-foreground">
            Фільтри
          </h2>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-navy text-white text-[11px] font-bold">
              {activeFiltersCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {hasFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              tabIndex={0}
              className="text-xs font-semibold text-destructive px-2.5 py-1.5 rounded-full hover:bg-destructive/10 transition-colors"
            >
              Скинути все
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            tabIndex={0}
            aria-label="Закрити фільтри"
            className="w-9 h-9 rounded-full bg-muted hover:bg-muted/80 text-foreground flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Scrollable Filter Sections */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-4 space-y-5 bg-white">
        {/* Text / Tag / Agent Phone Search */}
        <div className="space-y-2">
          <label htmlFor="mobile-filter-query" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Пошук за ключовим словом, кодом або телефоном
          </label>
          <div className="relative flex items-center bg-muted rounded-full px-3.5 h-11">
            <Search className="w-4 h-4 text-muted-foreground shrink-0 mr-2" aria-hidden="true" />
            <input
              id="mobile-filter-query"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="Назва, #ID або тел. агента..."
              className="w-full min-w-0 bg-transparent text-base text-foreground placeholder:text-muted-foreground outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchQueryChange('')}
                tabIndex={0}
                aria-label="Очистити пошук"
                className="w-7 h-7 rounded-full bg-black/10 text-foreground flex items-center justify-center shrink-0 ml-1"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Location Autocomplete */}
        <div className="space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Локація</p>
          <div onFocus={onEnsureGeoData}>
            <Autocomplete
              placeholder="Оберіть ЖК..."
              options={complexOptions}
              value={searchComplex}
              onChange={onComplexSelect}
              onInputChange={onComplexInputChange}
            />
          </div>
          <div onFocus={onEnsureGeoData}>
            <Autocomplete
              placeholder="Вулиця..."
              options={streetOptions}
              value={searchStreet}
              onChange={(val) => {
                onStreetChange(val)
                onHouseChange('')
              }}
              onInputChange={(val) => {
                onStreetInputChange(val)
                onHouseChange('')
              }}
              minChars={1}
            />
          </div>
          <div onFocus={onEnsureGeoData}>
            <Autocomplete
              placeholder="Дім..."
              disabled={!searchStreet}
              options={houseOptions}
              value={searchHouse}
              onChange={onHouseChange}
              onInputChange={onHouseInputChange}
            />
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {deal === 'rent' ? 'Ціна (грн)' : 'Ціна ($)'}
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <input
              type="text"
              inputMode="numeric"
              aria-label="Мінімальна ціна"
              placeholder="Від"
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-muted border border-border/60 text-base text-foreground placeholder:text-muted-foreground outline-none focus:border-navy focus:bg-white transition-colors"
            />
            <input
              type="text"
              inputMode="numeric"
              aria-label="Максимальна ціна"
              placeholder="До"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-muted border border-border/60 text-base text-foreground placeholder:text-muted-foreground outline-none focus:border-navy focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Area Range */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Площа (м²)</p>
          <div className="grid grid-cols-2 gap-2.5">
            <input
              type="text"
              inputMode="numeric"
              aria-label="Мінімальна площа"
              placeholder="Від"
              value={minArea}
              onChange={(e) => onMinAreaChange(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-muted border border-border/60 text-base text-foreground placeholder:text-muted-foreground outline-none focus:border-navy focus:bg-white transition-colors"
            />
            <input
              type="text"
              inputMode="numeric"
              aria-label="Максимальна площа"
              placeholder="До"
              value={maxArea}
              onChange={(e) => onMaxAreaChange(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-muted border border-border/60 text-base text-foreground placeholder:text-muted-foreground outline-none focus:border-navy focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Subtypes */}
        {subtypeOptions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Тип нерухомості</p>
            <div className="flex flex-wrap gap-2">
              {subtypeOptions.map((opt) => {
                const isSelected = subTypes.includes(opt.value)
                return (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={isSelected}
                    tabIndex={0}
                    onClick={() => toggleSelection(subTypes, onSubTypesChange, opt.value)}
                    className={cn(
                      'px-3.5 py-2 rounded-full text-xs font-semibold border transition-colors',
                      isSelected
                        ? 'bg-navy text-white border-navy shadow-sm'
                        : 'bg-muted text-foreground border-transparent hover:border-border'
                    )}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Government Programs */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Державні програми</p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={onToggleErecovery}
              aria-pressed={filterErecovery}
              tabIndex={0}
              className={cn(
                'h-11 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-colors',
                filterErecovery
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                  : 'bg-muted text-foreground border-transparent'
              )}
            >
              <Hammer className={cn('w-4 h-4 shrink-0', filterErecovery ? 'text-white' : 'text-emerald-600')} aria-hidden="true" />
              <span className="truncate">єВідновлення</span>
            </button>
            <button
              type="button"
              onClick={onToggleEoselia}
              aria-pressed={filterEoselia}
              tabIndex={0}
              className={cn(
                'h-11 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-colors',
                filterEoselia
                  ? 'bg-navy text-white border-navy shadow-sm'
                  : 'bg-muted text-foreground border-transparent'
              )}
            >
              <HomeIcon className={cn('w-4 h-4 shrink-0', filterEoselia ? 'text-white' : 'text-navy')} aria-hidden="true" />
              <span className="truncate">єОселя</span>
            </button>
          </div>
        </div>

        {/* Metro Stations Accordion */}
        <div className="border border-border/70 rounded-2xl overflow-hidden bg-white">
          <button
            type="button"
            onClick={handleToggleMetroSection}
            aria-expanded={isMetroOpen}
            tabIndex={0}
            className="w-full px-4 py-3 flex items-center justify-between gap-2 text-left bg-muted/40 hover:bg-muted/70 transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">Станція метро</span>
              {metroStations.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-navy text-white text-[10px] font-bold">
                  {metroStations.length}
                </span>
              )}
            </div>
            <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', isMetroOpen && 'rotate-180')} aria-hidden="true" />
          </button>

          {isMetroOpen && (
            <div className="p-3 space-y-3 border-t border-border/60">
              {METRO_LINES.map((line) => (
                <div key={line.name} className="space-y-1.5">
                  <p className={cn('text-[11px] font-bold uppercase tracking-wider', line.color)}>
                    {line.name}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {line.stations.map((st) => {
                      const isSelected = metroStations.includes(st.value)
                      return (
                        <button
                          key={st.value}
                          type="button"
                          aria-pressed={isSelected}
                          tabIndex={0}
                          onClick={() => toggleSelection(metroStations, onMetroStationsChange, st.value)}
                          className={cn(
                            'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                            isSelected
                              ? 'bg-navy text-white border-navy'
                              : 'bg-muted text-foreground border-transparent'
                          )}
                        >
                          {st.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Districts Accordion */}
        <div className="border border-border/70 rounded-2xl overflow-hidden bg-white">
          <button
            type="button"
            onClick={handleToggleDistrictsSection}
            aria-expanded={isDistrictsOpen}
            tabIndex={0}
            className="w-full px-4 py-3 flex items-center justify-between gap-2 text-left bg-muted/40 hover:bg-muted/70 transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">Район</span>
              {districts.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-navy text-white text-[10px] font-bold">
                  {districts.length}
                </span>
              )}
            </div>
            <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', isDistrictsOpen && 'rotate-180')} aria-hidden="true" />
          </button>

          {isDistrictsOpen && (
            <div className="p-3 border-t border-border/60 flex flex-wrap gap-1.5">
              {DISTRICTS.map((district) => {
                const isSelected = districts.includes(district.value)
                return (
                  <button
                    key={district.value}
                    type="button"
                    aria-pressed={isSelected}
                    tabIndex={0}
                    onClick={() => toggleSelection(districts, onDistrictsChange, district.value)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                      isSelected
                        ? 'bg-navy text-white border-navy'
                        : 'bg-muted text-foreground border-transparent'
                    )}
                  >
                    {district.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Floor & Total Floors */}
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Поверх</p>
            <div className="grid grid-cols-2 gap-2.5">
              <input
                type="text"
                inputMode="numeric"
                aria-label="Мінімальний поверх"
                placeholder="Від"
                value={minFloor}
                onChange={(e) => onMinFloorChange(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-muted border border-border/60 text-base text-foreground placeholder:text-muted-foreground outline-none focus:border-navy focus:bg-white transition-colors"
              />
              <input
                type="text"
                inputMode="numeric"
                aria-label="Максимальний поверх"
                placeholder="До"
                value={maxFloor}
                onChange={(e) => onMaxFloorChange(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-muted border border-border/60 text-base text-foreground placeholder:text-muted-foreground outline-none focus:border-navy focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Всього поверхів</p>
            <div className="grid grid-cols-2 gap-2.5">
              <input
                type="text"
                inputMode="numeric"
                aria-label="Мінімальна поверховість будинку"
                placeholder="Від"
                value={minFloorsTotal}
                onChange={(e) => onMinFloorsTotalChange(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-muted border border-border/60 text-base text-foreground placeholder:text-muted-foreground outline-none focus:border-navy focus:bg-white transition-colors"
              />
              <input
                type="text"
                inputMode="numeric"
                aria-label="Максимальна поверховість будинку"
                placeholder="До"
                value={maxFloorsTotal}
                onChange={(e) => onMaxFloorsTotalChange(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-muted border border-border/60 text-base text-foreground placeholder:text-muted-foreground outline-none focus:border-navy focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Property State */}
        <div className="space-y-2 pb-2">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Стан</p>
          <div className="flex flex-wrap gap-2">
            {STATES.map((st) => {
              const isSelected = states.includes(st.value)
              return (
                <button
                  key={st.value}
                  type="button"
                  aria-pressed={isSelected}
                  tabIndex={0}
                  onClick={() => toggleSelection(states, onStatesChange, st.value)}
                  className={cn(
                    'px-3.5 py-2 rounded-full text-xs font-semibold border transition-colors',
                    isSelected
                      ? 'bg-navy text-white border-navy shadow-sm'
                      : 'bg-muted text-foreground border-transparent hover:border-border'
                  )}
                >
                  {st.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Pinned Bottom Apply CTA */}
      <div className="shrink-0 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] bg-white border-t border-border shadow-[0_-8px_24px_rgba(15,23,42,0.06)]">
        <button
          type="button"
          onClick={onClose}
          tabIndex={0}
          className="w-full py-3.5 rounded-2xl bg-navy hover:bg-navy/90 active:scale-[0.99] text-white text-sm font-bold transition-all shadow-sm"
        >
          Показати {filteredCount} об&apos;єктів
        </button>
      </div>
    </div>,
    document.body
  )
}

export default MobileFilterSheet
