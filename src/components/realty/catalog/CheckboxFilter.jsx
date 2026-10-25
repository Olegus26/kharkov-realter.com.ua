import { cn } from '@/lib/utils'
import FilterPopover, { FilterTitle } from './FilterPopover'

// Native checkbox stays in the DOM (sr-only) so the filter is keyboard accessible
const CheckboxOption = ({ option, isChecked, onToggle }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <input
      type="checkbox"
      className="sr-only peer"
      checked={isChecked}
      onChange={(e) => onToggle(option.value, e.target.checked)}
    />
    <span
      aria-hidden="true"
      className={cn(
        'w-5 h-5 rounded flex items-center justify-center transition-colors border shrink-0 peer-focus-visible:ring-2 peer-focus-visible:ring-navy/40',
        isChecked ? 'bg-navy border-navy text-white' : 'border-border group-hover:border-navy'
      )}
    >
      {isChecked && <span className="w-2.5 h-2.5 bg-white rounded-sm" />}
    </span>
    <span
      className={cn('text-sm truncate transition-colors', isChecked ? 'text-navy font-medium' : 'text-foreground group-hover:text-navy')}
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
    <FilterPopover label={label} count={selected.length} contentClassName={cn('p-6', contentClassName)}>
      <FilterTitle className="mb-4">{title || label}</FilterTitle>
      <div className="max-h-[60vh] overflow-y-auto pr-3 custom-scrollbar">
        {groups
          ? groups.map((group) => (
            <div key={group.name} className="mb-6 last:mb-0">
              <p className={cn('text-[10px] font-bold uppercase tracking-wider mb-4', group.color)}>{group.name}</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">{renderOptions(group.options || group.stations || [])}</div>
            </div>
          ))
          : <div className="grid grid-cols-2 gap-x-6 gap-y-3">{renderOptions(options)}</div>}
      </div>
    </FilterPopover>
  )
}

export default CheckboxFilter
