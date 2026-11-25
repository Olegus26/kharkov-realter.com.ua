import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_BUTTON_CLASS =
  'flex items-center gap-1.5 px-2 sm:px-3 py-2 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors text-xs sm:text-sm font-inter'

// Builds [1, '…', 4, 5, 6, '…', 20]
const getPageItems = (currentPage, totalPages, neighbourPages) => {
  const items = []
  for (let page = 1; page <= totalPages; page++) {
    const isNear = Math.abs(currentPage - page) <= neighbourPages
    const isEdge = page === 1 || page === totalPages
    if (isNear || isEdge) {
      items.push(page)
      continue
    }
    if (page === 2 || page === totalPages - 1) items.push(`gap-${page}`)
  }
  return items
}

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [isCompact, setIsCompact] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 639px)').matches : false
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mql = window.matchMedia('(max-width: 639px)')
    const handleChange = (e) => setIsCompact(e.matches)
    setIsCompact(mql.matches)
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])

  if (totalPages <= 1) return null

  const neighbourPages = isCompact ? 1 : 2

  return (
    <nav aria-label="Пагінація каталогу" className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 border-t border-border">
      <div className="flex flex-wrap items-center justify-center gap-0.5 sm:gap-1 max-w-full">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          aria-label="Попередня сторінка"
          className={NAV_BUTTON_CLASS}
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline">Назад</span>
        </button>

        {getPageItems(currentPage, totalPages, neighbourPages).map((item) => {
          if (typeof item === 'string') {
            return <span key={item} className="px-1 sm:px-2 text-xs sm:text-sm text-muted-foreground" aria-hidden="true">...</span>
          }
          const isCurrent = item === currentPage
          return (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-label={`Сторінка ${item}`}
              aria-current={isCurrent ? 'page' : undefined}
              className={cn('relative z-10 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-xs sm:text-sm font-inter transition-colors rounded-full', {
                'text-white': isCurrent,
                'text-muted-foreground hover:bg-muted hover:text-foreground': !isCurrent,
              })}
            >
              {isCurrent && (
                <motion.div
                  layoutId="pagination-pill"
                  className="absolute inset-0 gradient-gold rounded-full -z-10"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              {item}
            </button>
          )
        })}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          aria-label="Наступна сторінка"
          className={NAV_BUTTON_CLASS}
        >
          <span className="hidden sm:inline">Вперед</span>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </nav>
  )
}

export default Pagination
