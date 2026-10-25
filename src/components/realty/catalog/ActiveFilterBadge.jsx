import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const TONES = {
  navy: 'bg-navy/10 text-navy',
  emerald: 'bg-emerald-600/10 text-emerald-700',
}

const ActiveFilterBadge = ({ children, onRemove, removeLabel, tone = 'navy', isBold = false }) => (
  <span className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-full', TONES[tone], isBold ? 'font-semibold' : 'font-medium')}>
    {children}
    <button type="button" onClick={onRemove} aria-label={removeLabel} className="hover:text-destructive transition-colors">
      <X className="w-3 h-3" aria-hidden="true" />
    </button>
  </span>
)

export default ActiveFilterBadge
