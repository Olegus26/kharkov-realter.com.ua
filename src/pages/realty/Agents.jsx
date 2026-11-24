import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Send, Instagram } from 'lucide-react'
import SeoMeta from '@/components/seo/SeoMeta'
import { formatPhone } from '@/lib/utils'
import { getPhoneLink } from '@/lib/phones'

const TikTokIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.73a8.19 8.19 0 0 0 4.77 1.52V6.81a4.85 4.85 0 0 1-1-.12z" />
  </svg>
)

const AGENTS = [
  {
    id: 'agent-1',
    name: 'Моїсеєва Наталія',
    role: 'Провідний експерт з нерухомості',
    bio: "Повний супровід угод купівлі, продажу та оренди будь-якої нерухомості у Харкові. Підбір житла, перевірка документів та державні програми.",
    phone: '+380 (95) 737-22-61',
    telegram: 'https://t.me/kharkovrealter_bot',
    instagram: 'https://www.instagram.com/kharkov_realter/',
    tiktok: 'https://www.tiktok.com/',
    photo: '/images/agents/agent-1.webp',
    photoPosition: 'object-[50%_26%]',
  },
  {
    id: 'agent-2',
    name: 'Ганшина Наталія',
    role: 'Експерт з нерухомості',
    bio: "Допоможу вигідно купити, продати чи здати квартиру, будинок або комерційну нерухомість у будь-якому районі Харкова.",
    phone: '+380 (50) 135-18-16',
    telegram: 'https://t.me/kharkovrealter_bot',
    instagram: 'https://www.instagram.com/kharkov_realter/',
    tiktok: 'https://www.tiktok.com/',
    photo: '/images/agents/agent-2.webp',
    photoPosition: 'object-[50%_42%]',
  },
  {
    id: 'agent-3',
    name: 'Коробейник Ліна',
    role: 'Експерт з нерухомості',
    bio: "Підбір житлової та комерційної нерухомості під ваш бюджет і запит. Організація переглядів, переговори та безпечне оформлення.",
    phone: '+380 (99) 049-83-91',
    telegram: 'https://t.me/kharkovrealter_bot',
    instagram: 'https://www.instagram.com/kharkov_realter/',
    tiktok: 'https://www.tiktok.com/',
    photo: '/images/agents/agent-3.webp',
    photoPosition: 'object-[50%_22%]',
  },
]

const AgentsPage = () => {
  const [revealedPhones, setRevealedPhones] = useState({})

  const handleRevealPhone = (agentId) => {
    setRevealedPhones((prev) => ({ ...prev, [agentId]: true }))
  }

  return (
    <div className="pt-24 pb-12" aria-label="Сторінка експертів">
      <SeoMeta
        title="Експерти та ріелтори | Харків Ріелтер"
        description="Наша команда провідних фахівців з нерухомості у Харкові. Професійний підбір житла, юридичний супровід та безпека угод."
        url="/agents"
      />

      <div className="max-w-7xl mx-auto px-6">
        <header className="pb-4 text-center mb-6">
          <p className="text-[10px] tracking-[0.3em] uppercase text-gold mb-1.5 font-inter font-semibold">Наша команда</p>
          <h1 className="font-cormorant text-4xl sm:text-5xl font-bold mb-2 text-foreground tracking-tight">Експерти агентства</h1>
          <p className="text-muted-foreground max-w-xl mx-auto font-inter text-xs sm:text-sm leading-relaxed">
            Команда професіоналів, яка супроводжує купівлю, продаж, оренду житлової та комерційної нерухомості у Харкові та області
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          {AGENTS.map((agent, i) => {
            const phoneLink = getPhoneLink(agent.phone)
            const phoneDisplay = formatPhone(agent.phone)
            const isRevealed = Boolean(revealedPhones[agent.id])

            return (
              <motion.div
                key={agent.id}
                role="listitem"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                tabIndex={0}
                className="group bg-card rounded-2xl border border-border transition-all duration-300 overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative h-[340px] sm:h-[clamp(310px,calc(100vh-435px),520px)] overflow-hidden">
                  <img
                    src={agent.photo}
                    alt={`Фотографія експерта ${agent.name}`}
                    width={640}
                    height={960}
                    loading="lazy"
                    decoding="async"
                    className={`w-full h-full object-cover ${agent.photoPosition || 'object-center'} transition-transform duration-700 group-hover:scale-105`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent opacity-90" aria-hidden="true" />

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h2 className="font-inter text-xl font-bold text-white tracking-tight">{agent.name}</h2>
                    <p className="text-white/80 text-[10px] tracking-widest uppercase font-inter mt-0.5 font-semibold">{agent.role}</p>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow bg-card">
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed font-inter mb-4 flex-grow">
                    {agent.bio}
                  </p>

                  <div className="flex items-center gap-2 pt-4 border-t border-border">
                    {/* Mobile: direct tel: call */}
                    <a
                      href={phoneLink}
                      tabIndex={0}
                      aria-label={`Зателефонувати ${agent.name}`}
                      className="flex sm:hidden items-center justify-center gap-2 flex-1 py-2.5 bg-navy text-white text-xs font-inter font-semibold rounded-xl hover:bg-navy/90 transition-colors shadow-sm"
                    >
                      <Phone aria-hidden="true" className="w-3.5 h-3.5" /> Зателефонувати
                    </a>

                    {/* Desktop: reveal number on click */}
                    {!isRevealed ? (
                      <button
                        type="button"
                        onClick={() => handleRevealPhone(agent.id)}
                        tabIndex={0}
                        aria-label={`Показати номер ${agent.name}`}
                        className="hidden sm:flex items-center justify-center gap-2 flex-1 py-2.5 bg-navy text-white text-xs font-inter font-semibold rounded-xl hover:bg-navy/90 transition-colors shadow-sm cursor-pointer"
                      >
                        <Phone aria-hidden="true" className="w-3.5 h-3.5" /> Зателефонувати
                      </button>
                    ) : (
                      <a
                        href={phoneLink}
                        tabIndex={0}
                        aria-label={`Номер ${agent.name} ${phoneDisplay}`}
                        className="hidden sm:flex items-center justify-center gap-1.5 flex-1 py-2.5 px-2 bg-navy text-white text-xs font-inter font-bold rounded-xl hover:bg-navy/90 transition-colors shadow-sm whitespace-nowrap"
                      >
                        <Phone aria-hidden="true" className="w-3.5 h-3.5 shrink-0" />
                        <span>{phoneDisplay}</span>
                      </a>
                    )}

                    <a
                      href={agent.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={0}
                      aria-label={`Telegram ${agent.name}`}
                      title="Telegram"
                      className="w-9 h-9 rounded-xl border border-sky-200/80 bg-sky-50/70 text-[#0088cc] hover:bg-[#0088cc] hover:text-white hover:border-transparent flex items-center justify-center transition-all shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </a>
                    <a
                      href={agent.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={0}
                      aria-label={`Instagram ${agent.name}`}
                      title="Instagram"
                      className="w-9 h-9 rounded-xl border border-pink-200/80 bg-pink-50/70 text-[#E1306C] hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white hover:border-transparent flex items-center justify-center transition-all shrink-0"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                    <a
                      href={agent.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={0}
                      aria-label={`TikTok ${agent.name}`}
                      title="TikTok"
                      className="w-9 h-9 rounded-xl border border-border bg-muted/40 text-foreground hover:bg-slate-950 hover:text-white hover:border-transparent flex items-center justify-center transition-all shrink-0"
                    >
                      <TikTokIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AgentsPage
