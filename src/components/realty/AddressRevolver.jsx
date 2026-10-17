import { useState, useRef, useEffect } from 'react'
import { MapPin, ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const AddressRevolver = ({ addresses = [], onChange }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const isWheeling = useRef(false)
  const wheelTimeout = useRef(null)
  const containerRef = useRef(null)

  const count = addresses?.length || 0

  useEffect(() => {
    if (onChange && count > 0) {
      onChange(activeIndex)
    }
  }, [activeIndex, count, onChange])

  useEffect(() => {
    const el = containerRef.current
    if (!el || count <= 1) return

    const handleNativeWheel = (e) => {
      const atTop = activeIndex === 0 && e.deltaY < 0
      const atBottom = activeIndex === count - 1 && e.deltaY > 0
      if (atTop || atBottom) return

      e.preventDefault()
      if (isWheeling.current) return

      if (e.deltaY > 0) {
        setActiveIndex((prev) => Math.min(prev + 1, count - 1))
      } else if (e.deltaY < 0) {
        setActiveIndex((prev) => Math.max(prev - 1, 0))
      }

      isWheeling.current = true
      clearTimeout(wheelTimeout.current)
      wheelTimeout.current = setTimeout(() => {
        isWheeling.current = false
      }, 150)
    }

    el.addEventListener('wheel', handleNativeWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleNativeWheel)
  }, [activeIndex, count])

  if (!addresses || count === 0) return null

  if (count === 1) {
    return (
      <div className="flex gap-3 w-full">
        <MapPin className="w-4 h-4 text-gold mt-0.5 shrink-0" />
        <div className="flex flex-col text-muted-foreground w-full">
          <span className="font-semibold text-sm leading-tight">{addresses[0].title}</span>
          <span className="text-[13px] leading-tight truncate">{addresses[0].addr}</span>
        </div>
      </div>
    )
  }

  const handlePrev = () => {
    setActiveIndex((prev) => Math.max(prev - 1, 0))
  }

  const handleNext = () => {
    setActiveIndex((prev) => Math.min(prev + 1, count - 1))
  }

  return (
    <div
      ref={containerRef}
      className="flex items-center gap-3 relative h-[80px] w-full group"
      title="Гортайте коліщатком миші або кнопками"
    >
      <MapPin className="w-4 h-4 text-gold shrink-0 z-10" />

      <div
        className="flex flex-col h-[80px] overflow-hidden relative perspective-[1000px] w-full py-5"
      >
        <div
          className="transition-transform duration-300 ease-out flex flex-col"
          style={{ transform: `translateY(-${activeIndex * 40}px)` }}
        >
          {addresses.map((a, idx) => {
            const diff = idx - activeIndex
            const isActive = diff === 0

            return (
              <div
                key={idx}
                className="flex-none h-[40px] flex items-center justify-start transition-all duration-300 ease-out origin-left"
                style={{
                  transform: `rotateX(${diff * -40}deg) scale(${isActive ? 1 : 0.85}) translateZ(${isActive ? '0px' : '-10px'})`,
                  opacity: isActive ? 1 : 0.4,
                  pointerEvents: isActive ? 'auto' : 'none'
                }}
              >
                <div className={cn("flex flex-col w-full transition-colors", isActive ? "text-muted-foreground" : "text-muted-foreground/50")}>
                  <span className="font-semibold text-sm leading-tight">{a.title}</span>
                  <span className="text-[13px] leading-tight truncate">{a.addr}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={handlePrev}
          disabled={activeIndex === 0}
          aria-label="Попередня адреса"
          className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={activeIndex === count - 1}
          aria-label="Наступна адреса"
          className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

export default AddressRevolver
