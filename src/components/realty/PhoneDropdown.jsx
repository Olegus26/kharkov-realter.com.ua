import { useState, useRef, useEffect } from 'react'
import { Phone, ChevronDown, Check, Copy, MessageCircle, Send as TelegramIcon } from 'lucide-react'
import { getPhoneLink } from '@/lib/phones'
import { cn } from '@/lib/utils'

const getCarrierBadge = (phone) => {
  if (phone.includes('(67)') || phone.includes('(98)') || phone.includes('(96)')) return 'Kyivstar'
  if (phone.includes('(50)') || phone.includes('(66)') || phone.includes('(95)') || phone.includes('(99)')) return 'Vodafone'
  if (phone.includes('(63)') || phone.includes('(93)') || phone.includes('(73)')) return 'Lifecell'
  return 'Мобільний'
}

const PhoneDropdown = ({ phones = [] }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [copiedPhone, setCopiedPhone] = useState(null)
  const dropdownRef = useRef(null)

  const handleToggle = () => {
    setIsOpen((prev) => !prev)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleCopyPhone = (e, phone) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard?.writeText(phone)
    setCopiedPhone(phone)
    setTimeout(() => {
      setCopiedPhone(null)
    }, 2000)
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  if (!phones || phones.length === 0) return null

  const mainPhone = phones[0]

  return (
    <div ref={dropdownRef} className="relative hidden xl:block">
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Вибрати телефон для зв'язку"
        tabIndex={0}
        className={cn(
          'flex items-center gap-2 h-10 px-3.5 py-1.5 rounded-full border text-xs font-semibold font-inter transition-all duration-200 outline-none focus:ring-2 focus:ring-gold/40',
          isOpen
            ? 'bg-muted border-gold text-foreground shadow-sm'
            : 'bg-muted/50 hover:bg-muted border-border/60 text-foreground/80 hover:text-foreground'
        )}
      >
        <div className="w-6 h-6 rounded-full bg-gold/15 text-gold flex items-center justify-center shrink-0">
          <Phone className="w-3.5 h-3.5" />
        </div>
        <span className="tracking-tight">{mainPhone}</span>
        <ChevronDown className={cn('w-3.5 h-3.5 text-muted-foreground transition-transform duration-200', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-[0_16px_40px_rgba(15,23,42,0.14)] border border-border/70 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2 pb-2 mb-2 border-b border-border/50 flex items-center justify-between">
            <span className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground font-inter">
              Чергові спеціалісти
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold font-inter">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              На зв'язку
            </span>
          </div>

          <div className="space-y-1">
            {phones.map((phone, idx) => {
              const carrier = getCarrierBadge(phone)
              const isCopied = copiedPhone === phone

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-muted/60 transition-colors group"
                >
                  <a
                    href={getPhoneLink(phone)}
                    onClick={handleClose}
                    className="flex flex-col flex-1 min-w-0"
                    aria-label={`Зателефонувати: ${phone}`}
                  >
                    <span className="text-xs font-semibold text-foreground group-hover:text-gold transition-colors">
                      {phone}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {carrier} • Безкоштовна лінія
                    </span>
                  </a>

                  <button
                    type="button"
                    onClick={(e) => handleCopyPhone(e, phone)}
                    aria-label={isCopied ? 'Скопійовано' : `Скопіювати номер ${phone}`}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card transition-colors shrink-0 ml-1"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )
            })}
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-border/50 grid grid-cols-2 gap-1.5">
            <a
              href="https://t.me/kharkov_realter"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClose}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-[11px] font-semibold font-inter text-[#0088cc] bg-[#0088cc]/10 hover:bg-[#0088cc]/15 transition-colors"
            >
              <TelegramIcon className="w-3 h-3" />
              <span>Telegram</span>
            </a>
            <a
              href="viber://chat?number=%2B380507136363"
              onClick={handleClose}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-[11px] font-semibold font-inter text-[#7360f2] bg-[#7360f2]/10 hover:bg-[#7360f2]/15 transition-colors"
            >
              <MessageCircle className="w-3 h-3" />
              <span>Viber</span>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default PhoneDropdown
