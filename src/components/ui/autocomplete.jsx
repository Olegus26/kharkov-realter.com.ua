import { useState, useRef, useEffect } from 'react'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Autocomplete({ 
    options = [], 
    value, 
    onChange, 
    placeholder, 
    disabled, 
    className,
    onInputChange,
    renderItem,
    minChars = 0
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const containerRef = useRef(null)

    // Sync input value with selected value when closed or value changes
    useEffect(() => {
        if (!isOpen) {
            const selected = options.find(o => o.value === value)
            setInputValue(selected ? selected.label : '')
        }
    }, [value, isOpen, options])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleInputChange = (e) => {
        setInputValue(e.target.value)
        setIsOpen(true)
        if (onInputChange) onInputChange(e.target.value)
    }

    const handleSelect = (option) => {
        onChange(option.value)
        setIsOpen(false)
    }

    const clearSelection = (e) => {
        e.stopPropagation()
        onChange('')
        setInputValue('')
        if (onInputChange) onInputChange('')
    }

    const filteredOptions = options.filter(opt => 
        opt.label.toLowerCase().includes(inputValue.toLowerCase())
    )

    return (
        <div ref={containerRef} className={cn("relative", className)}>
            <div className="relative flex items-center w-full">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="w-full bg-muted text-foreground text-sm px-4 lg:px-6 py-3.5 rounded-full outline-none focus:ring-2 focus:ring-navy/20 transition-all placeholder:text-muted-foreground disabled:opacity-50"
                />
                {value && (
                    <button 
                        onClick={clearSelection}
                        className="absolute right-3 p-1 rounded-full hover:bg-black/5 text-muted-foreground transition-colors"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>
            
            {isOpen && inputValue.length >= minChars && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-lg z-50 max-h-60 overflow-y-auto py-2 font-inter">
                    {filteredOptions.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                            Нічого не знайдено
                        </div>
                    ) : (
                        filteredOptions.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleSelect(opt)}
                                className={cn(
                                    "w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-muted/50 flex items-center justify-between",
                                    value === opt.value ? "bg-muted/30 text-navy font-medium" : "text-foreground"
                                )}
                            >
                                <span className="truncate">
                                    {renderItem ? renderItem(opt) : opt.label}
                                </span>
                                {value === opt.value && <Check className="w-4 h-4 text-navy shrink-0 ml-2" />}
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}
