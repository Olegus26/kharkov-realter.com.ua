import { useState, useEffect } from 'react'
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const AddressRevolver = ({ addresses = [], onChange }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const count = addresses?.length || 0

  useEffect(() => {
    if (onChange && count > 0) {
      onChange(activeIndex)
    }
  }, [activeIndex, count, onChange])

  if (!addresses || count === 0) return null

  const currentOffice = addresses[activeIndex] || addresses[0]
  const officeName = currentOffice.name || currentOffice.title || 'Філія'
  const officeAddr = currentOffice.shortAddress || currentOffice.address || currentOffice.addr || ''
  const officeMetro = currentOffice.metro

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + count) % count)
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % count)
  }

  const handleSelect = (idx) => {
    setActiveIndex(idx)
  }

  return (
    <div className="flex flex-col gap-2.5 w-full">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0 mt-0.5">
          <MapPin className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-foreground">
              {officeName}
            </span>
            {officeMetro && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                м. {officeMetro}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-snug line-clamp-2">
            {officeAddr}
          </p>
        </div>

        {count > 1 && (
          <div className="flex items-center gap-1 shrink-0 ml-1">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Попереднє відділення"
              tabIndex={0}
              className="w-7 h-7 rounded-lg border border-border/70 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Наступне відділення"
              tabIndex={0}
              className="w-7 h-7 rounded-lg border border-border/70 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {count > 1 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {addresses.map((office, idx) => {
            const isSelected = idx === activeIndex
            const label = office.name || `Офіс ${idx + 1}`

            return (
              <button
                key={office.id || idx}
                type="button"
                onClick={() => handleSelect(idx)}
                tabIndex={0}
                aria-label={`Вибрати відділення ${label}`}
                className={cn(
                  'text-[11px] font-inter font-medium px-2.5 py-1 rounded-lg transition-all duration-200',
                  isSelected
                    ? 'bg-gold/15 text-gold font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                )}
              >
                {label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AddressRevolver
