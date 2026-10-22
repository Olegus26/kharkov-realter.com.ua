import { useState, useEffect } from 'react'
import { MapPin, ChevronLeft, ChevronRight, Phone, ExternalLink } from 'lucide-react'
import { getPhoneLink } from '@/lib/phones'

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
  const officeAddr = currentOffice.address || currentOffice.shortAddress || ''
  const officeMetro = currentOffice.metro
  const officePhones = currentOffice.phones || []
  const reviewUrl = currentOffice.reviewUrl

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + count) % count)
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % count)
  }

  const handleSelectOffice = (e) => {
    setActiveIndex(Number(e.target.value))
  }

  return (
    <div className="w-full bg-muted/40 dark:bg-muted/20 border border-border/80 rounded-2xl p-4 shadow-sm hover:border-gold/30 transition-all">
      {/* Office Selector Header with Stepper */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-border/60">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-7 h-7 rounded-lg bg-gold/15 text-gold flex items-center justify-center shrink-0">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div className="relative min-w-0 flex-1">
            <select
              value={activeIndex}
              onChange={handleSelectOffice}
              aria-label="Вибрати філію зі списку"
              tabIndex={0}
              className="w-full bg-transparent font-bold text-sm text-foreground cursor-pointer focus:outline-none appearance-none pr-3 truncate font-inter"
            >
              {addresses.map((office, idx) => (
                <option key={office.id || idx} value={idx} className="bg-card text-foreground">
                  {office.name} ({office.metro})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Counter & Steppers */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[11px] font-semibold text-muted-foreground font-inter mr-0.5">
            {activeIndex + 1}/{count}
          </span>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Попередня філія"
            tabIndex={0}
            className="w-6 h-6 rounded-md border border-border/80 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Наступна філія"
            tabIndex={0}
            className="w-6 h-6 rounded-md border border-border/80 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Metro station & Address */}
      <div className="mb-3 space-y-1.5">
        {officeMetro && (
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-navy dark:text-gold bg-navy/5 dark:bg-gold/10 px-2.5 py-0.5 rounded-full font-inter">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>м. {officeMetro}</span>
          </div>
        )}
        <p className="text-xs text-foreground/80 leading-relaxed font-inter font-medium">
          {officeAddr}
        </p>
      </div>

      {/* Direct Branch Office Phones */}
      {officePhones.length > 0 && (
        <div className="space-y-1.5 pt-2.5 border-t border-border/50">
          {officePhones.map((phone, idx) => (
            <a
              key={idx}
              href={getPhoneLink(phone)}
              tabIndex={0}
              aria-label={`Зателефонувати до філії ${officeName}: ${phone}`}
              className="flex items-center justify-between text-xs font-semibold text-foreground hover:text-gold transition-colors py-1 px-2 rounded-lg hover:bg-muted/60 group"
            >
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3 text-gold shrink-0 group-hover:scale-110 transition-transform" />
                <span>{phone}</span>
              </div>
              <span className="text-[10px] text-muted-foreground font-normal group-hover:text-gold transition-colors">
                Дзвінок
              </span>
            </a>
          ))}
        </div>
      )}

      {/* Google Reviews Badge */}
      {reviewUrl && (
        <div className="mt-2.5 pt-2 border-t border-border/50 flex items-center justify-between text-[11px] font-inter">
          <a
            href={reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={0}
            aria-label={`Відгуки про відділення ${officeName} в Google`}
            className="flex items-center gap-1.5 text-gold hover:text-gold/80 font-medium transition-colors"
          >
            <span>★ 4.9 · Відгуки в Google</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  )
}

export default AddressRevolver
