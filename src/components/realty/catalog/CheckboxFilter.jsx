import { cn } from '@/lib/utils'
import FilterPopover, { FilterTitle } from './FilterPopover'

// Native checkbox stays in the DOM (sr-only) so the filter is keyboard accessible
const CheckboxOption = ({ option, isChecked, onToggle }) => (
  <label className="flex items-center gap-2.5 cursor-pointer group">
    <input
      type="checkbox"
      className="sr-only peer"
      checked={isChecked}
      onChange={(e) => onToggle(option.value, e.target.checked)}
    />
    <span
      aria-hidden="true"
      className={cn(
        'w-4 h-4 rounded flex items-center justify-center transition-colors border shrink-0 peer-focus-visible:ring-2 peer-focus-visible:ring-navy/40',
        isChecked ? 'bg-navy border-navy text-white' : 'border-border group-hover:border-navy'
      )}
    >
      {isChecked && <span className="w-2 h-2 bg-white rounded-sm" />}
    </span>
    <span
      className={cn('text-[13px] leading-tight truncate transition-colors', isChecked ? 'text-navy font-medium' : 'text-foreground group-hover:text-navy')}
      title={option.label}
    >
      {option.label}
    </span>
  </label>
)

// `options` is a flat list; `groups` ([{ name, color, options }]) renders sections (e.g. metro lines)
const CheckboxFilter = ({ label, title, options, groups, selected, onChange, contentClassName }) => {
  const handleToggle = (value, isChecked) => {
    onChange(isChecked ? [...selected, value] : selected.filter((item) => item !== value))
  }

  const renderOptions = (items) => items.map((option) => (
    <CheckboxOption
      key={option.value}
      option={option}
      isChecked={selected.includes(option.value)}
      onToggle={handleToggle}
    />
  ))

  return (
    <FilterPopover label={label} count={selected.length} contentClassName={cn('p-4 sm:p-5', contentClassName)}>
      <FilterTitle className="mb-2.5">{title || label}</FilterTitle>
      <div className="max-h-[min(440px,calc(var(--radix-popover-content-available-height,460px)-56px))] overflow-y-auto pr-1 custom-scrollbar">
        {groups ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-4">
            {groups.map((group) => (
              <div key={group.name} className="min-w-0">
                <p className={cn('text-[10px] font-bold uppercase tracking-wider mb-2', group.color)}>{group.name}</p>
                <div className="space-y-1.5">{renderOptions(group.options || group.stations || [])}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-2">{renderOptions(options)}</div>
        )}
      </div>
    </FilterPopover>
  )
}

export default CheckboxFilter
