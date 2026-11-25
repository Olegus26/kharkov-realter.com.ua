import { useState, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const TRIGGER_CLASS =
  'relative w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-3.5 bg-muted rounded-full text-sm flex items-center justify-between gap-2 sm:gap-3 hover:bg-muted/80 transition-colors text-foreground [&[data-state=open]>svg]:rotate-180'

// Popover with a pill trigger. `count` shows a numeric badge, `isActive` shows a dot (for range filters)
const FilterPopover = ({ label, count = 0, isActive = false, contentClassName = 'w-64 p-5', children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef(null)

  const handleOpenChange = (nextOpen) => {
    if (nextOpen && typeof window !== 'undefined' && window.innerWidth < 640 && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      if (rect.top < 80 || rect.bottom > window.innerHeight - 220) {
        window.scrollBy({ top: rect.top - 92, behavior: 'instant' })
      }
    }
    setIsOpen(nextOpen)
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger ref={triggerRef} className={TRIGGER_CLASS}>
        <span className="truncate">{label}</span>
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform duration-200" aria-hidden="true" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-navy text-white flex items-center justify-center text-[10px] rounded-full font-bold shadow-sm">
            {count}
          </span>
        )}
        {isActive && <span className="absolute top-0 right-1 w-3 h-3 bg-navy border-2 border-card rounded-full" />}
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          contentClassName,
          'flex flex-col max-w-[calc(100vw-1.5rem)] max-h-[min(500px,var(--radix-popover-content-available-height,calc(100dvh-6rem)))] border-border bg-card rounded-2xl shadow-lg overflow-hidden'
        )}
        side="bottom"
        sticky="always"
        avoidCollisions
        align="start"
        collisionPadding={{ top: 76, bottom: 16, left: 12, right: 12 }}
      >
        {children}
      </PopoverContent>
    </Popover>
  )
}

export const FilterTitle = ({ children, className = 'mb-3' }) => (
  <p className={`text-[10px] tracking-widest uppercase text-muted-foreground font-semibold ${className}`}>{children}</p>
)

export default FilterPopover
