import { useState, useRef, useEffect, useCallback } from 'react'
import { Phone, ChevronUp, ChevronDown } from 'lucide-react'
import { getPhoneLink } from '@/lib/phones'

const PhoneRevolver = ({ phones = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const isWheeling = useRef(false)
  const wheelTimeout = useRef(null)
  const containerRef = useRef(null)

  const handleNext = useCallback(() => {
    if (!phones || phones.length <= 1) return
    setActiveIndex((prev) => (prev + 1) % phones.length)
  }, [phones])

  const handlePrev = useCallback(() => {
    if (!phones || phones.length <= 1) return
    setActiveIndex((prev) => (prev - 1 + phones.length) % phones.length)
  }, [phones])

  useEffect(() => {
    const el = containerRef.current
    if (!el || !phones || phones.length <= 1) return

    const handleNativeWheel = (e) => {
      // Allow wheel to rotate phone numbers smoothly
      if (isWheeling.current) return

      if (e.deltaY > 0) {
        setActiveIndex((prev) => (prev + 1) % phones.length)
      } else if (e.deltaY < 0) {
        setActiveIndex((prev) => (prev - 1 + phones.length) % phones.length)
      }

      isWheeling.current = true
      clearTimeout(wheelTimeout.current)
      wheelTimeout.current = setTimeout(() => {
        isWheeling.current = false
      }, 150)
    }

    el.addEventListener('wheel', handleNativeWheel, { passive: true })
    return () => {
      el.removeEventListener('wheel', handleNativeWheel)
      if (wheelTimeout.current) clearTimeout(wheelTimeout.current)
    }
  }, [phones])

  if (!phones || phones.length === 0) return null

  if (phones.length === 1) {
    return (
      <a
        href={getPhoneLink(phones[0])}
        tabIndex={0}
        aria-label={`Зателефонувати ${phones[0]}`}
        className="hidden xl:flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-gold transition-colors focus:outline-none focus:ring-1 focus:ring-gold rounded-full px-2 py-1"
      >
        <Phone className="w-4 h-4 text-gold" />
        <span>{phones[0]}</span>
      </a>
    )
  }

  const currentPhone = phones[activeIndex] || phones[0]

  return (
    <div
      ref={containerRef}
      className="hidden xl:flex items-center gap-1.5 relative h-[44px] bg-muted/40 hover:bg-muted/70 px-3 py-1 rounded-full border border-border/40 transition-colors"
      title="Гортайте або використовуйте стрілки для зміни номера"
    >
      <Phone className="w-3.5 h-3.5 text-gold shrink-0" />

      <a
        href={getPhoneLink(currentPhone)}
        tabIndex={0}
        aria-label={`Зателефонувати черговому спеціалісту: ${currentPhone}`}
        className="text-xs font-semibold font-inter text-foreground hover:text-gold transition-colors tracking-tight min-w-[130px]"
      >
        {currentPhone}
      </a>

      <div className="flex flex-col -my-1 ml-0.5">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Попередній телефон"
          tabIndex={0}
          className="p-0.5 text-muted-foreground hover:text-foreground transition-colors leading-none"
        >
          <ChevronUp className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          aria-label="Наступний телефон"
          tabIndex={0}
          className="p-0.5 text-muted-foreground hover:text-foreground transition-colors leading-none"
        >
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}

export default PhoneRevolver
