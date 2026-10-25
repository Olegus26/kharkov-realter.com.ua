import FilterPopover, { FilterTitle } from './FilterPopover'

const INPUT_CLASS =
  'w-full bg-muted text-sm px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-navy/20 transition-all text-foreground'

const RangeFilter = ({ label, title = label, minValue, maxValue, onMinChange, onMaxChange }) => (
  <FilterPopover label={label} isActive={Boolean(minValue || maxValue)}>
    <FilterTitle>{title}</FilterTitle>
    <div className="flex items-center gap-2 mb-2">
      <input
        type="number"
        min="0"
        inputMode="numeric"
        placeholder="від"
        aria-label={`${label}: від`}
        value={minValue}
        onChange={(e) => onMinChange(e.target.value)}
        className={INPUT_CLASS}
      />
      <span className="text-muted-foreground" aria-hidden="true">–</span>
      <input
        type="number"
        min="0"
        inputMode="numeric"
        placeholder="до"
        aria-label={`${label}: до`}
        value={maxValue}
        onChange={(e) => onMaxChange(e.target.value)}
        className={INPUT_CLASS}
      />
    </div>
  </FilterPopover>
)

export default RangeFilter
